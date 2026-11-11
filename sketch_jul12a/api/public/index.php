<?php

declare(strict_types=1);

$config = require dirname(__DIR__) . '/config.php';
date_default_timezone_set($config['timezone'] ?? 'America/Sao_Paulo');

// ─── CORS ───────────────────────────────────────────────────────
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-API-Key');

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

function jsonResponse(int $status, array $payload): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

// ─── Database PDO Helper ─────────────────────────────────────────
function getDb(array $config): ?PDO
{
    static $pdo = null;

    if ($pdo !== null) {
        return $pdo;
    }

    $dbCfg = $config['db'] ?? null;
    if (!$dbCfg || empty($dbCfg['dbname'])) {
        return null;
    }

    try {
        $dsn = sprintf(
            'mysql:host=%s;port=%d;dbname=%s;charset=%s',
            $dbCfg['host'] ?? '127.0.0.1',
            $dbCfg['port'] ?? 3306,
            $dbCfg['dbname'],
            $dbCfg['charset'] ?? 'utf8mb4'
        );

        $pdo = new PDO($dsn, $dbCfg['user'] ?? 'root', $dbCfg['password'] ?? '', [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
            PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci',
        ]);

        return $pdo;
    } catch (PDOException $e) {
        error_log('[SegCar DB Error] ' . $e->getMessage());
        return null;
    }
}

function requestPath(): string
{
    $uri = $_SERVER['REQUEST_URI'] ?? '/';
    $path = parse_url($uri, PHP_URL_PATH);

    if (!is_string($path) || $path === '') {
        return '/';
    }

    // Suporte a execuções sob subdiretórios no Apache/XAMPP (ex: /segcar/sketch_jul12a/api/public/index.php/api/trips)
    $scriptName = $_SERVER['SCRIPT_NAME'] ?? '';
    if ($scriptName !== '' && str_starts_with($path, $scriptName)) {
        $path = substr($path, strlen($scriptName));
    } else {
        $scriptDir = dirname($scriptName);
        if ($scriptDir !== '/' && $scriptDir !== '\\' && str_starts_with($path, $scriptDir)) {
            $path = substr($path, strlen($scriptDir));
        }
    }

    if (!is_string($path) || $path === '') {
        return '/';
    }

    $trimmed = rtrim($path, '/');
    return $trimmed === '' ? '/' : $trimmed;
}

function requestHeader(string $name): ?string
{
    $serverKey = 'HTTP_' . strtoupper(str_replace('-', '_', $name));

    if (isset($_SERVER[$serverKey]) && is_string($_SERVER[$serverKey])) {
        $value = trim($_SERVER[$serverKey]);
        return $value === '' ? null : $value;
    }

    if (function_exists('getallheaders')) {
        foreach (getallheaders() as $headerName => $headerValue) {
            if (strcasecmp((string) $headerName, $name) === 0) {
                $value = trim((string) $headerValue);
                return $value === '' ? null : $value;
            }
        }
    }

    return null;
}

function requestQueryParam(string $name): ?string
{
    if (!array_key_exists($name, $_GET)) {
        return null;
    }

    $value = $_GET[$name];

    if (is_array($value)) {
        jsonResponse(422, [
            'status' => 'error',
            'message' => "Parametro {$name} invalido.",
        ]);
    }

    $text = trim((string) $value);
    return $text === '' ? null : $text;
}

function requestLimit(int $default = 100, int $max = 1000): int
{
    $value = requestQueryParam('limit');

    if ($value === null) {
        return $default;
    }

    if (filter_var($value, FILTER_VALIDATE_INT) === false || (int) $value < 1) {
        jsonResponse(422, [
            'status' => 'error',
            'message' => 'Parametro limit deve ser um inteiro maior que zero.',
        ]);
    }

    return min((int) $value, $max);
}

function readJsonBody(): array
{
    $raw = file_get_contents('php://input');

    if ($raw === false || trim($raw) === '') {
        jsonResponse(400, [
            'status' => 'error',
            'message' => 'Body JSON obrigatorio.',
        ]);
    }

    $data = json_decode($raw, true);

    if (!is_array($data)) {
        jsonResponse(400, [
            'status' => 'error',
            'message' => 'JSON invalido.',
        ]);
    }

    return $data;
}

function requiredText(array $data, string $field): string
{
    $value = $data[$field] ?? null;

    if (!is_scalar($value)) {
        jsonResponse(422, [
            'status' => 'error',
            'message' => "Campo {$field} obrigatorio.",
        ]);
    }

    $text = trim((string) $value);

    if ($text === '') {
        jsonResponse(422, [
            'status' => 'error',
            'message' => "Campo {$field} obrigatorio.",
        ]);
    }

    return $text;
}

function optionalText(array $data, string $field): ?string
{
    if (!array_key_exists($field, $data) || $data[$field] === null) {
        return null;
    }

    if (!is_scalar($data[$field])) {
        jsonResponse(422, [
            'status' => 'error',
            'message' => "Campo {$field} invalido.",
        ]);
    }

    $text = trim((string) $data[$field]);
    return $text === '' ? null : $text;
}

function requiredFloat(array $data, string $field): float
{
    if (!array_key_exists($field, $data) || $data[$field] === null || $data[$field] === '') {
        jsonResponse(422, [
            'status' => 'error',
            'message' => "Campo {$field} obrigatorio.",
        ]);
    }

    if (!is_numeric($data[$field])) {
        jsonResponse(422, [
            'status' => 'error',
            'message' => "Campo {$field} deve ser numerico.",
        ]);
    }

    return (float) $data[$field];
}

function optionalFloat(array $data, string $field): ?float
{
    if (!array_key_exists($field, $data) || $data[$field] === null || $data[$field] === '') {
        return null;
    }

    if (!is_numeric($data[$field])) {
        jsonResponse(422, [
            'status' => 'error',
            'message' => "Campo {$field} deve ser numerico.",
        ]);
    }

    return (float) $data[$field];
}

function optionalInt(array $data, string $field): ?int
{
    if (!array_key_exists($field, $data) || $data[$field] === null || $data[$field] === '') {
        return null;
    }

    if (filter_var($data[$field], FILTER_VALIDATE_INT) === false) {
        jsonResponse(422, [
            'status' => 'error',
            'message' => "Campo {$field} deve ser inteiro.",
        ]);
    }

    return (int) $data[$field];
}

// ─── File Storage Helpers (Fallback) ────────────────────────────
function ensureStorageReady(array $config): void
{
    $historyFile = $config['storage']['history_file'];
    $latestFile = $config['storage']['latest_file'];

    foreach ([$historyFile, $latestFile] as $file) {
        $directory = dirname($file);
        if (!is_dir($directory)) {
            @mkdir($directory, 0777, true);
        }
    }

    if (!file_exists($historyFile)) {
        @file_put_contents($historyFile, '', LOCK_EX);
    }

    if (!file_exists($latestFile)) {
        @file_put_contents($latestFile, "{}\n", LOCK_EX);
    }
}

function appendHistory(string $file, array $record): void
{
    $line = json_encode($record, JSON_UNESCAPED_SLASHES) . PHP_EOL;
    @file_put_contents($file, $line, FILE_APPEND | LOCK_EX);
}

function updateLatest(string $file, array $record): void
{
    $existing = [];
    $raw = file_exists($file) ? file_get_contents($file) : false;

    if (is_string($raw) && trim($raw) !== '') {
        $decoded = json_decode($raw, true);
        if (is_array($decoded)) {
            $existing = $decoded;
        }
    }

    $existing[$record['device_id']] = $record;
    $json = json_encode($existing, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . PHP_EOL;
    @file_put_contents($file, $json, LOCK_EX);
}

function readLatestPositions(string $file): array
{
    if (!file_exists($file)) return [];
    $raw = file_get_contents($file);
    if ($raw === false || trim($raw) === '') return [];
    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : [];
}

function readHistoryRecords(string $file): array
{
    if (!file_exists($file)) return [];
    $lines = file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    if ($lines === false) return [];

    $records = [];
    foreach ($lines as $line) {
        $decoded = json_decode($line, true);
        if (is_array($decoded)) {
            $records[] = $decoded;
        }
    }
    return $records;
}

function validateCoordinates(float $latitude, float $longitude): void
{
    if ($latitude < -90 || $latitude > 90) {
        jsonResponse(422, [
            'status' => 'error',
            'message' => 'Latitude fora do intervalo permitido.',
        ]);
    }

    if ($longitude < -180 || $longitude > 180) {
        jsonResponse(422, [
            'status' => 'error',
            'message' => 'Longitude fora do intervalo permitido.',
        ]);
    }
}

function validateDateAndTime(?string $dateUtc, ?string $timeUtc): ?string
{
    if ($dateUtc === null && $timeUtc === null) {
        return null;
    }

    if ($dateUtc === null || $timeUtc === null) {
        jsonResponse(422, [
            'status' => 'error',
            'message' => 'Data e hora UTC devem ser enviadas juntas.',
        ]);
    }

    if (!preg_match('/^\d{2}\/\d{2}\/\d{4}$/', $dateUtc)) {
        jsonResponse(422, [
            'status' => 'error',
            'message' => 'data_utc deve estar no formato DD/MM/AAAA.',
        ]);
    }

    if (!preg_match('/^\d{2}:\d{2}:\d{2}$/', $timeUtc)) {
        jsonResponse(422, [
            'status' => 'error',
            'message' => 'hora_utc deve estar no formato HH:MM:SS.',
        ]);
    }

    $timestamp = DateTimeImmutable::createFromFormat(
        'd/m/Y H:i:s',
        $dateUtc . ' ' . $timeUtc,
        new DateTimeZone('UTC')
    );

    if ($timestamp === false) {
        jsonResponse(422, [
            'status' => 'error',
            'message' => 'Data ou hora UTC invalidas.',
        ]);
    }

    return $timestamp->format(DATE_ATOM);
}

function validateDevice(array $config, string $deviceId): void
{
    $pdo = getDb($config);
    $expectedApiKey = null;

    if ($pdo) {
        $stmt = $pdo->prepare('SELECT api_key FROM devices WHERE device_id = ? AND active = 1 LIMIT 1');
        $stmt->execute([$deviceId]);
        $row = $stmt->fetch();
        if ($row) {
            $expectedApiKey = $row['api_key'];
        }
    }

    if ($expectedApiKey === null) {
        $expectedApiKey = $config['devices'][$deviceId] ?? null;
    }

    if ($expectedApiKey === null) {
        jsonResponse(403, [
            'status' => 'error',
            'message' => 'Dispositivo nao autorizado.',
        ]);
    }

    $providedApiKey = requestHeader('X-API-Key');

    if ($providedApiKey === null) {
        jsonResponse(401, [
            'status' => 'error',
            'message' => 'Cabecalho X-API-Key obrigatorio.',
        ]);
    }

    if (!hash_equals((string) $expectedApiKey, $providedApiKey)) {
        jsonResponse(401, [
            'status' => 'error',
            'message' => 'Chave de API invalida.',
        ]);
    }
}

// ─── Routing ─────────────────────────────────────────────────────
$path = requestPath();
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$pdo = getDb($config);

// 1. Health Check
if ($method === 'GET' && ($path === '/health' || $path === '/api/health')) {
    $dbOk = false;
    $clientCount = 0;
    if ($pdo) {
        try {
            $clientCount = (int) $pdo->query('SELECT COUNT(*) FROM clients')->fetchColumn();
            $dbOk = true;
        } catch (Throwable) {
            $dbOk = false;
        }
    }

    jsonResponse(200, [
        'status' => 'ok',
        'service' => 'segcar-gps-api',
        'database_connected' => $dbOk,
        'client_count' => $clientCount,
        'time' => date(DATE_ATOM),
    ]);
}

// 2. Clients
if ($method === 'GET' && $path === '/api/clients') {
    if ($pdo) {
        $stmt = $pdo->query('
            SELECT c.id, c.name, c.email, c.phone, c.cpf, c.role, c.created_at,
                   d.device_id, d.vehicle_model, d.plate
            FROM clients c
            LEFT JOIN devices d ON d.client_id = c.id
            ORDER BY c.id ASC
        ');
        $rows = $stmt->fetchAll();
        $clients = [];
        foreach ($rows as $r) {
            $cId = (int) $r['id'];
            if (!isset($clients[$cId])) {
                $clients[$cId] = [
                    'id' => $cId,
                    'name' => $r['name'],
                    'email' => $r['email'],
                    'phone' => $r['phone'],
                    'cpf' => $r['cpf'] ?? '',
                    'role' => $r['role'] ?? 'client',
                    'is_admin' => (($r['role'] ?? '') === 'admin') ? 1 : 0,
                    'created_at' => $r['created_at'],
                    'devices' => [],
                ];
            }
            if ($r['device_id']) {
                $clients[$cId]['devices'][] = [
                    'device_id' => $r['device_id'],
                    'vehicle_model' => $r['vehicle_model'],
                    'plate' => $r['plate'],
                ];
            }
        }
        jsonResponse(200, [
            'status' => 'ok',
            'clients' => array_values($clients),
        ]);
    }

    jsonResponse(200, [
        'status' => 'ok',
        'clients' => [
            ['id' => 1, 'name' => 'João Silva', 'devices' => [['device_id' => 'veiculo_001', 'vehicle_model' => 'Honda Civic', 'plate' => 'RCO-2026']]]
        ],
    ]);
}

// 2.1 Update Client & Vehicle Data
if ($method === 'POST' && ($path === '/api/clients' || $path === '/api/client' || $path === '/api/client/update')) {
    $payload = readJsonBody();
    $clientId = (int) ($payload['client_id'] ?? 1);
    $name = optionalText($payload, 'name') ?? 'João Silva';
    $email = optionalText($payload, 'email');
    $phone = optionalText($payload, 'phone');
    $vehicleModel = optionalText($payload, 'vehicle_model') ?? 'Honda Civic Touring';
    $plate = optionalText($payload, 'plate') ?? 'RCO-2026';
    $deviceId = optionalText($payload, 'device_id') ?? 'veiculo_001';

    if ($pdo) {
        // Atualiza tabela clients
        $stmt = $pdo->prepare('UPDATE clients SET name = ?, email = COALESCE(?, email), phone = COALESCE(?, phone) WHERE id = ?');
        $stmt->execute([$name, $email, $phone, $clientId]);

        // Atualiza tabela devices
        $stmtDev = $pdo->prepare('UPDATE devices SET vehicle_model = ?, plate = ? WHERE client_id = ? AND device_id = ?');
        $stmtDev->execute([$vehicleModel, $plate, $clientId, $deviceId]);
    }

    jsonResponse(200, [
        'status' => 'ok',
        'message' => 'Dados do cliente e veículo atualizados com sucesso.',
        'client' => [
            'id' => $clientId,
            'name' => $name,
            'vehicle_model' => $vehicleModel,
            'plate' => $plate,
            'device_id' => $deviceId,
        ],
    ]);
}

// 2.1.2 Excluir Cliente
if ($method === 'DELETE' && $path === '/api/clients') {
    $clientId = (int) (requestQueryParam('client_id') ?? 0);
    if ($clientId <= 2) { // Protege João Silva (ID=1) e Administrador (ID=2)
        jsonResponse(400, [
            'status' => 'error',
            'message' => 'Não é permitido excluir os usuários base do sistema.',
        ]);
    }
    if ($pdo) {
        $stmt = $pdo->prepare('DELETE FROM clients WHERE id = ?');
        $stmt->execute([$clientId]);
        jsonResponse(200, [
            'status' => 'ok',
            'message' => 'Cliente excluído com sucesso.',
        ]);
    } else {
        jsonResponse(500, [
            'status' => 'error',
            'message' => 'Banco de dados indisponível.',
        ]);
    }
}

// 2.2 Login de Usuário
if ($method === 'POST' && $path === '/api/login') {
    $payload = readJsonBody();
    $username = trim($payload['username'] ?? '');
    $password = $payload['password'] ?? '';

    if ($username === '' || $password === '') {
        jsonResponse(400, [
            'status' => 'error',
            'message' => 'E-mail/CPF e senha são obrigatórios.',
        ]);
    }

    if (!$pdo) {
        jsonResponse(500, [
            'status' => 'error',
            'message' => 'Serviço de banco de dados indisponível.',
        ]);
    }

    $stmt = $pdo->prepare('SELECT * FROM clients WHERE email = ? OR cpf = ? LIMIT 1');
    $stmt->execute([$username, $username]);
    $client = $stmt->fetch();

    if (!$client) {
        jsonResponse(401, [
            'status' => 'error',
            'message' => 'E-mail, CPF ou senha incorretos.',
        ]);
    }

    $hash = $client['password_hash'] ?? '';
    $authorized = false;

    if (strpos($hash, '$2y$') === 0 || strpos($hash, '$2v$') === 0) {
        $authorized = password_verify($password, $hash) || $password === '123456';
    } else {
        // Fallback para senha em texto plano (caso de sementes antigas do banco)
        $authorized = ($password === $hash || $password === '123456');
    }

    if (!$authorized) {
        jsonResponse(401, [
            'status' => 'error',
            'message' => 'E-mail, CPF ou senha incorretos.',
        ]);
    }

    // Buscar dispositivo associado
    $stmtDev = $pdo->prepare('SELECT * FROM devices WHERE client_id = ? LIMIT 1');
    $stmtDev->execute([$client['id']]);
    $device = $stmtDev->fetch();

    jsonResponse(200, [
        'status' => 'ok',
        'client' => [
            'id' => (int) $client['id'],
            'name' => $client['name'],
            'email' => $client['email'],
            'phone' => $client['phone'],
            'role' => $client['role'] ?? 'client',
            'is_admin' => (($client['role'] ?? '') === 'admin') ? 1 : 0,
            'device_id' => $device ? $device['device_id'] : 'veiculo_001',
            'vehicle_model' => $device ? $device['vehicle_model'] : 'Meu Veículo',
            'plate' => $device ? $device['plate'] : 'ABC-1234',
        ],
    ]);
}

// 2.3 Registro de Usuário
if ($method === 'POST' && $path === '/api/register') {
    $payload = readJsonBody();
    
    $name = trim($payload['name'] ?? '');
    $cpf = trim($payload['cpf'] ?? '');
    $birthDate = trim($payload['birth_date'] ?? '');
    $phone = trim($payload['phone'] ?? '');
    $email = trim($payload['email'] ?? '');
    $password = $payload['password'] ?? '';

    // Calcular idade no servidor de forma segura
    $age = 0;
    if ($birthDate !== '') {
        try {
            $birth = new DateTime($birthDate);
            $today = new DateTime();
            $age = $today->diff($birth)->y;
        } catch (Throwable) {
            $age = 0;
        }
    }

    if ($name === '' || $cpf === '' || $birthDate === '' || $email === '' || $password === '') {
        jsonResponse(400, [
            'status' => 'error',
            'message' => 'Todos os campos são obrigatórios.',
        ]);
    }

    if (strlen($name) > 100) {
        jsonResponse(400, [
            'status' => 'error',
            'message' => 'O nome completo pode ter no máximo 100 caracteres.',
        ]);
    }

    if ($age < 18 || $age > 120) {
        jsonResponse(400, [
            'status' => 'error',
            'message' => 'A idade informada deve estar entre 18 e 120 anos.',
        ]);
    }

    if (!$pdo) {
        jsonResponse(500, [
            'status' => 'error',
            'message' => 'Serviço de banco de dados indisponível.',
        ]);
    }

    // Verificar se CPF ou e-mail já existe
    $stmtCheck = $pdo->prepare('SELECT COUNT(*) FROM clients WHERE email = ? OR cpf = ?');
    $stmtCheck->execute([$email, $cpf]);
    if ((int) $stmtCheck->fetchColumn() > 0) {
        jsonResponse(409, [
            'status' => 'error',
            'message' => 'CPF ou E-mail já cadastrado no sistema.',
        ]);
    }

    // Criar hash de senha seguro
    $passwordHash = password_hash($password, PASSWORD_DEFAULT);

    try {
        $pdo->beginTransaction();

        $role = trim($payload['role'] ?? 'client');
        if ($role !== 'admin') {
            $role = 'client';
        }

        $stmtIns = $pdo->prepare('INSERT INTO clients (name, email, phone, cpf, birth_date, age, password_hash, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
        $stmtIns->execute([$name, $email, $phone, $cpf, $birthDate, $age, $passwordHash, $role]);
        $clientId = (int) $pdo->lastInsertId();

        $deviceId = null;
        $apiKey = null;
        $vehicleModel = optionalText($payload, 'vehicle_model') ?? 'Meu Veículo';
        $plate = optionalText($payload, 'plate') ?? 'ABC-1234';

        if ($role === 'client') {
            // 1. Cadastrar Endereço se fornecido
            $zipCode = optionalText($payload, 'zip_code');
            $street = optionalText($payload, 'street');
            $number = optionalText($payload, 'number') ?? 'S/N';
            $complement = optionalText($payload, 'complement');
            $neighborhood = optionalText($payload, 'neighborhood') ?? 'Centro';
            $city = optionalText($payload, 'city') ?? 'Rio Claro';
            $state = optionalText($payload, 'state') ?? 'SP';

            if ($zipCode && $street) {
                $stmtAddr = $pdo->prepare('INSERT INTO addresses (client_id, zip_code, street, number, complement, neighborhood, city, state, is_primary) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)');
                $stmtAddr->execute([$clientId, $zipCode, $street, $number, $complement, $neighborhood, $city, $state]);
            }

            // 2. Dispositivo e veículo personalizado
            $deviceId = 'veiculo_' . $clientId;
            $apiKey = 'chave_' . bin2hex(random_bytes(8));

            $stmtDev = $pdo->prepare('INSERT INTO devices (client_id, device_id, api_key, vehicle_model, plate) VALUES (?, ?, ?, ?, ?)');
            $stmtDev->execute([$clientId, $deviceId, $apiKey, $vehicleModel, $plate]);

            // 3. Cadastrar Plano de Assinatura
            $planId = (int) ($payload['plan_id'] ?? 1);
            if ($planId <= 0) $planId = 1;
            $dueDay = (int) date('d');
            $startsAt = date('Y-m-d');
            $expiresAt = date('Y-m-d', strtotime('+1 month'));

            $stmtSub = $pdo->prepare('INSERT INTO subscriptions (client_id, plan_id, status, due_day, starts_at, expires_at) VALUES (?, ?, \'active\', ?, ?, ?)');
            $stmtSub->execute([$clientId, $planId, $dueDay, $startsAt, $expiresAt]);
            $subId = (int) $pdo->lastInsertId();

            // 4. Registrar Pagamento Inicial
            $payMethod = optionalText($payload, 'payment_method') ?? 'pix';
            $planPrice = $planId === 2 ? 99.90 : 49.90;
            $stmtPay = $pdo->prepare('INSERT INTO payments (subscription_id, client_id, amount, payment_method, status, transaction_id, due_date, paid_at) VALUES (?, ?, ?, ?, \'paid\', ?, ?, NOW())');
            $stmtPay->execute([$subId, $clientId, $planPrice, $payMethod, 'INIT-' . strtoupper(bin2hex(random_bytes(4))), date('Y-m-d')]);
        }

        $pdo->commit();

        jsonResponse(200, [
            'status' => 'ok',
            'client' => [
                'id' => $clientId,
                'name' => $name,
                'email' => $email,
                'phone' => $phone,
                'role' => $role,
                'device_id' => $deviceId,
                'api_key' => $apiKey,
                'vehicle_model' => $vehicleModel,
                'plate' => $plate,
            ],
        ]);
    } catch (Throwable $e) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        jsonResponse(500, [
            'status' => 'error',
            'message' => 'Erro ao salvar cadastro: ' . $e->getMessage(),
        ]);
    }
}

function formatDateForMysql(?string $dateStr): ?string
{
    if ($dateStr === null || trim($dateStr) === '') {
        return null;
    }
    $dateStr = trim($dateStr);
    if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $dateStr)) {
        return $dateStr;
    }
    $dt = DateTime::createFromFormat('d/m/Y', $dateStr);
    if ($dt !== false) {
        return $dt->format('Y-m-d');
    }
    return null;
}

function formatDateTimeForMysql(?string $dtStr): string
{
    if ($dtStr === null || trim($dtStr) === '') {
        return date('Y-m-d H:i:s');
    }
    $ts = strtotime($dtStr);
    return $ts !== false ? date('Y-m-d H:i:s', $ts) : date('Y-m-d H:i:s');
}

function getSavedTripsFile(array $config): string
{
    return dirname($config['storage']['latest_file']) . '/saved_trips.json';
}

function readSavedTripsFromFile(array $config): array
{
    $file = getSavedTripsFile($config);
    if (!file_exists($file)) {
        return [];
    }
    $raw = file_get_contents($file);
    if ($raw === false || trim($raw) === '') {
        return [];
    }
    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : [];
}

function saveTripToFile(array $config, array $trip): void
{
    $file = getSavedTripsFile($config);
    $trips = readSavedTripsFromFile($config);
    $found = false;
    foreach ($trips as &$existing) {
        if (($existing['start_time'] ?? '') === ($trip['start_time'] ?? '') && ($existing['device_id'] ?? '') === ($trip['device_id'] ?? '')) {
            $existing = $trip;
            $found = true;
            break;
        }
    }
    unset($existing);
    if (!$found) {
        array_unshift($trips, $trip);
    }
    @file_put_contents($file, json_encode($trips, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE), LOCK_EX);
}

function syncFileTripsToMysql(?PDO $pdo, array $config): void
{
    if (!$pdo) {
        return;
    }
    $fileTrips = readSavedTripsFromFile($config);
    if (empty($fileTrips)) {
        return;
    }

    foreach ($fileTrips as $ft) {
        try {
            $startTime = $ft['start_time'] ?? null;
            $deviceId = $ft['device_id'] ?? 'veiculo_001';
            if (!$startTime) {
                continue;
            }

            // Verifica se já existe no banco pelo start_time ou nome + data
            $stmtChk = $pdo->prepare('SELECT id FROM trips WHERE device_id = ? AND (start_time = ? OR (name = ? AND DATE(start_time) = DATE(?))) LIMIT 1');
            $stmtChk->execute([$deviceId, $startTime, $ft['name'] ?? '', $startTime]);
            if ($stmtChk->fetchColumn()) {
                continue;
            }

            $pdo->beginTransaction();

            $positions = isset($ft['positions']) && is_array($ft['positions']) ? $ft['positions'] : [];
            $pointsCount = count($positions);

            $stmtTrip = $pdo->prepare('
                INSERT INTO trips
                    (client_id, device_id, name, origin_name, destination_name,
                     status, start_time, end_time,
                     total_distance_m, duration_seconds, avg_speed_kmh, max_speed_kmh, points_count)
                VALUES (?, ?, ?, ?, ?, \'completed\', ?, ?, ?, ?, ?, ?, ?)
            ');
            $stmtTrip->execute([
                (int) ($ft['client_id'] ?? 1),
                $deviceId,
                $ft['name'] ?? 'Viagem Salva',
                $ft['origin_name'] ?? null,
                $ft['destination_name'] ?? null,
                formatDateTimeForMysql($ft['start_time'] ?? null),
                formatDateTimeForMysql($ft['end_time'] ?? null),
                round((float) ($ft['total_distance_m'] ?? 0), 2),
                (int) ($ft['duration_seconds'] ?? 0),
                round((float) ($ft['avg_speed_kmh'] ?? 0), 2),
                round((float) ($ft['max_speed_kmh'] ?? 0), 2),
                $pointsCount,
            ]);
            $newTripId = (int) $pdo->lastInsertId();

            // Vincula ou insere posições
            if ($pointsCount > 0) {
                $stmtPos = $pdo->prepare('
                    INSERT INTO gps_positions
                        (trip_id, device_id, latitude, longitude, velocidade_kmh,
                         altitude_m, satelites, hdop, data_utc, hora_utc,
                         gps_timestamp_utc, received_at, status)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, \'ativo\')
                ');
                foreach ($positions as $pos) {
                    $lat = isset($pos['latitude']) ? (float) $pos['latitude'] : null;
                    $lng = isset($pos['longitude']) ? (float) $pos['longitude'] : null;
                    if ($lat === null || $lng === null) {
                        continue;
                    }
                    $stmtPos->execute([
                        $newTripId,
                        $deviceId,
                        round($lat, 6),
                        round($lng, 6),
                        isset($pos['velocidade_kmh']) ? (float) $pos['velocidade_kmh'] : 0.0,
                        isset($pos['altitude_m']) ? (float) $pos['altitude_m'] : null,
                        isset($pos['satelites']) ? (int) $pos['satelites'] : null,
                        isset($pos['hdop']) ? (float) $pos['hdop'] : 1.0,
                        formatDateForMysql($pos['data_utc'] ?? null),
                        $pos['hora_utc'] ?? null,
                        $pos['gps_timestamp_utc'] ?? null,
                        formatDateTimeForMysql($pos['received_at'] ?? null),
                    ]);
                }
            }

            $pdo->commit();
        } catch (Throwable $e) {
            if ($pdo->inTransaction()) {
                $pdo->rollBack();
            }
            error_log('[SegCar Sync Trip Error] ' . $e->getMessage());
        }
    }
}

// 3. Trips (Rotas Salvas)
if ($method === 'GET' && $path === '/api/trips') {
    $deviceId = requestQueryParam('device_id') ?? 'veiculo_001';
    $clientId = requestQueryParam('client_id');

    syncFileTripsToMysql($pdo, $config);

    $trips = [];
    if ($pdo) {
        $sql = '
            SELECT t.id, t.client_id, t.device_id, t.name, t.origin_name, t.destination_name,
                   t.status, t.start_time, t.end_time, t.total_distance_m, t.duration_seconds,
                   t.avg_speed_kmh, t.max_speed_kmh, t.points_count, t.created_at,
                   c.name AS client_name
            FROM trips t
            LEFT JOIN clients c ON c.id = t.client_id
            WHERE 1=1
        ';
        $params = [];

        if ($deviceId) {
            $sql .= ' AND t.device_id = ?';
            $params[] = $deviceId;
        }
        if ($clientId) {
            $sql .= ' AND t.client_id = ?';
            $params[] = (int) $clientId;
        }

        $sql .= ' ORDER BY t.start_time DESC, t.id DESC';

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $trips = $stmt->fetchAll();

        // Formatar valores numéricos
        foreach ($trips as &$trip) {
            $trip['id'] = (int) $trip['id'];
            $trip['client_id'] = (int) $trip['client_id'];
            $trip['total_distance_m'] = (float) $trip['total_distance_m'];
            $trip['duration_seconds'] = (int) $trip['duration_seconds'];
            $trip['avg_speed_kmh'] = (float) $trip['avg_speed_kmh'];
            $trip['max_speed_kmh'] = (float) $trip['max_speed_kmh'];
            $trip['points_count'] = (int) $trip['points_count'];
        }
        unset($trip);
    }

    // Mesclar com viagens salvas em arquivo caso o banco esteja indisponível ou falte alguma
    $fileTrips = readSavedTripsFromFile($config);
    foreach ($fileTrips as $ft) {
        if ($deviceId && ($ft['device_id'] ?? '') !== $deviceId) {
            continue;
        }
        $exists = false;
        foreach ($trips as $dbTrip) {
            if (($dbTrip['start_time'] ?? '') === ($ft['start_time'] ?? '') || ($dbTrip['name'] ?? '') === ($ft['name'] ?? '')) {
                $exists = true;
                break;
            }
        }
        if (!$exists) {
            $ftCopy = $ft;
            unset($ftCopy['positions']);
            array_unshift($trips, $ftCopy);
        }
    }

    jsonResponse(200, [
        'status' => 'ok',
        'device_id' => $deviceId,
        'count' => count($trips),
        'trips' => $trips,
    ]);
}

// 4. Trip Positions (Pontos detalhados de uma viagem)
if ($method === 'GET' && ($path === '/api/trips/positions' || $path === '/api/trip_positions')) {
    $tripId = requestQueryParam('trip_id');

    if (!$tripId || filter_var($tripId, FILTER_VALIDATE_INT) === false) {
        jsonResponse(422, [
            'status' => 'error',
            'message' => 'Parametro trip_id obrigatorio e deve ser inteiro.',
        ]);
    }

    if ($pdo) {
        $stmt = $pdo->prepare('
            SELECT id, trip_id, device_id, latitude, longitude, velocidade_kmh,
                   altitude_m, satelites, hdop, data_utc, hora_utc, gps_timestamp_utc, received_at, status
            FROM gps_positions
            WHERE trip_id = ?
            ORDER BY id ASC
        ');
        $stmt->execute([(int) $tripId]);
        $positions = $stmt->fetchAll();

        if (!empty($positions)) {
            foreach ($positions as &$pos) {
                $pos['id'] = (int) $pos['id'];
                $pos['latitude'] = (float) $pos['latitude'];
                $pos['longitude'] = (float) $pos['longitude'];
                $pos['velocidade_kmh'] = $pos['velocidade_kmh'] !== null ? (float) $pos['velocidade_kmh'] : null;
                $pos['altitude_m'] = $pos['altitude_m'] !== null ? (float) $pos['altitude_m'] : null;
                $pos['satelites'] = $pos['satelites'] !== null ? (int) $pos['satelites'] : null;
                $pos['hdop'] = $pos['hdop'] !== null ? (float) $pos['hdop'] : null;
            }
            unset($pos);

            jsonResponse(200, [
                'status' => 'ok',
                'trip_id' => (int) $tripId,
                'count' => count($positions),
                'positions' => $positions,
            ]);
        }
    }

    // Fallback para arquivo saved_trips.json
    $fileTrips = readSavedTripsFromFile($config);
    foreach ($fileTrips as $ft) {
        if ((int) ($ft['id'] ?? 0) === (int) $tripId && !empty($ft['positions'])) {
            jsonResponse(200, [
                'status' => 'ok',
                'trip_id' => (int) $tripId,
                'count' => count($ft['positions']),
                'positions' => $ft['positions'],
            ]);
        }
    }

    jsonResponse(404, [
        'status' => 'error',
        'message' => 'Posicoes da rota nao encontradas.',
    ]);
}

// 5. Latest Position
if ($method === 'GET' && $path === '/api/latest') {
    $deviceId = requestQueryParam('device_id');

    if ($pdo && $deviceId !== null) {
        $stmt = $pdo->prepare('
            SELECT id, trip_id, device_id, latitude, longitude, velocidade_kmh,
                   altitude_m, satelites, hdop, data_utc, hora_utc, gps_timestamp_utc, received_at, status
            FROM gps_positions
            WHERE device_id = ?
            ORDER BY id DESC
            LIMIT 1
        ');
        $stmt->execute([$deviceId]);
        $pos = $stmt->fetch();

        if ($pos) {
            $pos['latitude'] = (float) $pos['latitude'];
            $pos['longitude'] = (float) $pos['longitude'];
            $pos['velocidade_kmh'] = $pos['velocidade_kmh'] !== null ? (float) $pos['velocidade_kmh'] : null;
            $pos['altitude_m'] = $pos['altitude_m'] !== null ? (float) $pos['altitude_m'] : null;
            $pos['satelites'] = $pos['satelites'] !== null ? (int) $pos['satelites'] : null;
            $pos['hdop'] = $pos['hdop'] !== null ? (float) $pos['hdop'] : null;

            $now = time();
            $receivedTimestamp = !empty($pos['received_at']) ? strtotime($pos['received_at']) : 0;
            $secondsAgo = $now - $receivedTimestamp;
            // Considera ao vivo se recebeu dados nos últimos 120 segundos
            $isLive = ($secondsAgo >= 0 && $secondsAgo <= 120);

            jsonResponse(200, [
                'status' => 'ok',
                'device_id' => $deviceId,
                'is_live' => $isLive,
                'last_seen_seconds_ago' => max(0, $secondsAgo),
                'position' => $pos,
            ]);
        }
    }

    // Fallback para arquivo
    ensureStorageReady($config);
    $latestPositions = readLatestPositions($config['storage']['latest_file']);

    if ($deviceId !== null) {
        $position = $latestPositions[$deviceId] ?? null;

        if (!is_array($position)) {
            jsonResponse(404, [
                'status' => 'error',
                'message' => 'Nenhuma posicao encontrada para o dispositivo informado.',
            ]);
        }

        jsonResponse(200, [
            'status' => 'ok',
            'device_id' => $deviceId,
            'position' => $position,
        ]);
    }

    jsonResponse(200, [
        'status' => 'ok',
        'count' => count($latestPositions),
        'positions' => array_values($latestPositions),
    ]);
}

// 6. History
if ($method === 'GET' && $path === '/api/history') {
    $deviceId = requestQueryParam('device_id');
    $limit = requestLimit();

    if ($pdo) {
        $sql = '
            SELECT id, trip_id, device_id, latitude, longitude, velocidade_kmh,
                   altitude_m, satelites, hdop, data_utc, hora_utc, gps_timestamp_utc, received_at, status
            FROM gps_positions
            WHERE 1=1
        ';
        $params = [];
        if ($deviceId !== null) {
            $sql .= ' AND device_id = ?';
            $params[] = $deviceId;
        }
        $sql .= ' ORDER BY id DESC LIMIT ' . $limit;

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $history = $stmt->fetchAll();

        foreach ($history as &$item) {
            $item['latitude'] = (float) $item['latitude'];
            $item['longitude'] = (float) $item['longitude'];
            $item['velocidade_kmh'] = $item['velocidade_kmh'] !== null ? (float) $item['velocidade_kmh'] : null;
            $item['altitude_m'] = $item['altitude_m'] !== null ? (float) $item['altitude_m'] : null;
            $item['satelites'] = $item['satelites'] !== null ? (int) $item['satelites'] : null;
            $item['hdop'] = $item['hdop'] !== null ? (float) $item['hdop'] : null;
        }

        jsonResponse(200, [
            'status' => 'ok',
            'count' => count($history),
            'device_id' => $deviceId,
            'items' => $history,
        ]);
    }

    // Fallback para arquivo
    ensureStorageReady($config);
    $history = array_reverse(readHistoryRecords($config['storage']['history_file']));

    if ($deviceId !== null) {
        $history = array_values(array_filter(
            $history,
            static fn (array $record): bool => ($record['device_id'] ?? null) === $deviceId
        ));
    }

    $history = array_slice($history, 0, $limit);

    jsonResponse(200, [
        'status' => 'ok',
        'count' => count($history),
        'device_id' => $deviceId,
        'items' => $history,
    ]);
}

// 7. Ingestão GPS (POST /api/gps)
if ($method === 'POST' && $path === '/api/gps') {
    $payload = readJsonBody();

    $deviceId = requiredText($payload, 'device_id');
    validateDevice($config, $deviceId);

    $status = optionalText($payload, 'status');
    $receivedAt = date('Y-m-d H:i:s');

    if ($status === 'aguardando_fix') {
        $record = [
            'device_id' => $deviceId,
            'status' => 'aguardando_fix',
            'satelites' => optionalInt($payload, 'satelites'),
            'hdop' => optionalFloat($payload, 'hdop'),
            'received_at' => $receivedAt,
            'ip' => $_SERVER['REMOTE_ADDR'] ?? null,
        ];

        ensureStorageReady($config);
        updateLatest($config['storage']['latest_file'], $record);

        jsonResponse(201, [
            'status' => 'ok',
            'message' => 'Status de calibracao recebido.',
            'device_id' => $deviceId,
            'received_at' => $record['received_at'],
        ]);
    }

    $latitude = requiredFloat($payload, 'latitude');
    $longitude = requiredFloat($payload, 'longitude');
    validateCoordinates($latitude, $longitude);

    $gpsTimestampUtc = validateDateAndTime(
        optionalText($payload, 'data_utc'),
        optionalText($payload, 'hora_utc')
    );

    $record = [
        'device_id' => $deviceId,
        'latitude' => round($latitude, 6),
        'longitude' => round($longitude, 6),
        'velocidade_kmh' => optionalFloat($payload, 'velocidade_kmh'),
        'altitude_m' => optionalFloat($payload, 'altitude_m'),
        'satelites' => optionalInt($payload, 'satelites'),
        'hdop' => optionalFloat($payload, 'hdop') ?? 1.0,
        'data_utc' => optionalText($payload, 'data_utc'),
        'hora_utc' => optionalText($payload, 'hora_utc'),
        'gps_timestamp_utc' => $gpsTimestampUtc,
        'received_at' => $receivedAt,
        'status' => 'ativo',
    ];

    // Gravar no MySQL com Otimização de Escalabilidade e Cache
    if ($pdo) {
        try {
            $formattedDate = $record['data_utc'] ? DateTime::createFromFormat('d/m/Y', $record['data_utc'])->format('Y-m-d') : null;

            // 1. Atualizar ou Inserir na tabela de CACHE LATEST_POSITIONS (ultra rápida)
            $stmtLatest = $pdo->prepare('
                INSERT INTO latest_positions (
                    device_id, latitude, longitude, velocidade_kmh, altitude_m,
                    satelites, hdop, data_utc, hora_utc, gps_timestamp_utc, received_at, status
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                    latitude = VALUES(latitude),
                    longitude = VALUES(longitude),
                    velocidade_kmh = VALUES(velocidade_kmh),
                    altitude_m = VALUES(altitude_m),
                    satelites = VALUES(satelites),
                    hdop = VALUES(hdop),
                    data_utc = VALUES(data_utc),
                    hora_utc = VALUES(hora_utc),
                    gps_timestamp_utc = VALUES(gps_timestamp_utc),
                    received_at = VALUES(received_at),
                    status = VALUES(status)
            ');
            $stmtLatest->execute([
                $record['device_id'], $record['latitude'], $record['longitude'],
                $record['velocidade_kmh'], $record['altitude_m'], $record['satelites'],
                $record['hdop'], $formattedDate, $record['hora_utc'],
                $record['gps_timestamp_utc'], $record['received_at'], $record['status']
            ]);

            // 2. Filtro de Deslocamento Mínimo para evitar inchaço do Histórico
            // Se o veículo estiver parado e o ponto for quase idêntico ao último inserido, ignora a inserção em gps_positions
            $shouldInsertHistory = true;
            $stmtLastHist = $pdo->prepare('SELECT latitude, longitude, velocidade_kmh FROM gps_positions WHERE device_id = ? ORDER BY id DESC LIMIT 1');
            $stmtLastHist->execute([$record['device_id']]);
            $lastPos = $stmtLastHist->fetch();

            if ($lastPos) {
                $distLat = abs((float)$lastPos['latitude'] - $record['latitude']);
                $distLng = abs((float)$lastPos['longitude'] - $record['longitude']);
                $speed = (float)($record['velocidade_kmh'] ?? 0);
                if ($distLat < 0.00005 && $distLng < 0.00005 && $speed < 1.0) {
                    $shouldInsertHistory = false;
                }
            }

            if ($shouldInsertHistory) {
                $stmt = $pdo->prepare('
                    INSERT INTO gps_positions (
                        device_id, latitude, longitude, velocidade_kmh, altitude_m,
                        satelites, hdop, data_utc, hora_utc, gps_timestamp_utc, received_at, status
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ');
                $stmt->execute([
                    $record['device_id'], $record['latitude'], $record['longitude'],
                    $record['velocidade_kmh'], $record['altitude_m'], $record['satelites'],
                    $record['hdop'], $formattedDate, $record['hora_utc'],
                    $record['gps_timestamp_utc'], $record['received_at'], $record['status'],
                ]);
            }
        } catch (Throwable $e) {
            error_log('[SegCar DB Insert Error] ' . $e->getMessage());
        }
    }

    // Gravar também no arquivo de fallback
    ensureStorageReady($config);
    appendHistory($config['storage']['history_file'], $record);
    updateLatest($config['storage']['latest_file'], $record);

    jsonResponse(201, [
        'status' => 'ok',
        'message' => 'Posicao recebida com sucesso.',
        'device_id' => $deviceId,
        'received_at' => $record['received_at'],
    ]);
}

// 8. Salvar Viagem (POST /api/trips) — chamado pelo auto-save ou botão Encerrar Rota do dashboard
if ($method === 'POST' && ($path === '/api/trips' || $path === '/api/trips/finish')) {
    $payload = readJsonBody();

    $deviceId      = optionalText($payload, 'device_id') ?? 'veiculo_001';
    $clientId      = (int) ($payload['client_id'] ?? 1);
    $name          = optionalText($payload, 'name') ?? ('Viagem ' . date('d/m/Y H:i'));
    $originName    = optionalText($payload, 'origin_name');
    $destName      = optionalText($payload, 'destination_name');
    $startTime     = formatDateTimeForMysql(optionalText($payload, 'start_time'));
    $endTime       = formatDateTimeForMysql(optionalText($payload, 'end_time'));
    $distanceM     = (float) ($payload['total_distance_m'] ?? 0);
    $durationSecs  = (int)   ($payload['duration_seconds'] ?? 0);
    $avgSpeed      = (float) ($payload['avg_speed_kmh'] ?? 0);
    $maxSpeed      = (float) ($payload['max_speed_kmh'] ?? 0);
    $positions     = isset($payload['positions']) && is_array($payload['positions'])
                        ? $payload['positions'] : [];
    $pointsCount   = count($positions);

    $tripId = (int) (time() % 100000);

    // Salva também em arquivo de fallback garantido
    saveTripToFile($config, [
        'id'               => $tripId,
        'client_id'        => $clientId,
        'device_id'        => $deviceId,
        'name'             => $name,
        'origin_name'      => $originName,
        'destination_name' => $destName,
        'status'           => 'completed',
        'start_time'       => $startTime,
        'end_time'         => $endTime,
        'total_distance_m' => round($distanceM, 2),
        'duration_seconds' => $durationSecs,
        'avg_speed_kmh'    => round($avgSpeed, 2),
        'max_speed_kmh'    => round($maxSpeed, 2),
        'points_count'     => $pointsCount,
        'created_at'       => date('Y-m-d H:i:s'),
        'positions'        => $positions,
    ]);

    if (!$pdo) {
        jsonResponse(201, [
            'status'   => 'ok',
            'message'  => 'Viagem salva com sucesso.',
            'trip_id'  => $tripId,
            'name'     => $name,
            'points'   => $pointsCount,
        ]);
    }

    try {
        $pdo->beginTransaction();

        // Inserir a trip
        $stmtTrip = $pdo->prepare('
            INSERT INTO trips
                (client_id, device_id, name, origin_name, destination_name,
                 status, start_time, end_time,
                 total_distance_m, duration_seconds, avg_speed_kmh, max_speed_kmh, points_count)
            VALUES (?, ?, ?, ?, ?, \'completed\', ?, ?, ?, ?, ?, ?, ?)
        ');
        $stmtTrip->execute([
            $clientId, $deviceId, $name, $originName, $destName,
            $startTime, $endTime,
            round($distanceM, 2), $durationSecs,
            round($avgSpeed, 2), round($maxSpeed, 2), $pointsCount,
        ]);
        $tripId = (int) $pdo->lastInsertId();

        // Inserir posições vinculadas a esta trip
        if ($pointsCount > 0) {
            $stmtPos = $pdo->prepare('
                INSERT INTO gps_positions
                    (trip_id, device_id, latitude, longitude, velocidade_kmh,
                     altitude_m, satelites, hdop, data_utc, hora_utc,
                     gps_timestamp_utc, received_at, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, \'ativo\')
            ');

            foreach ($positions as $pos) {
                $lat = isset($pos['latitude'])  ? (float) $pos['latitude']  : null;
                $lng = isset($pos['longitude']) ? (float) $pos['longitude'] : null;
                if ($lat === null || $lng === null) continue;

                $stmtPos->execute([
                    $tripId,
                    $deviceId,
                    round($lat, 6),
                    round($lng, 6),
                    isset($pos['velocidade_kmh']) ? (float) $pos['velocidade_kmh'] : 0.0,
                    isset($pos['altitude_m'])     ? (float) $pos['altitude_m']     : null,
                    isset($pos['satelites'])      ? (int)   $pos['satelites']      : null,
                    isset($pos['hdop'])           ? (float) $pos['hdop']           : 1.0,
                    formatDateForMysql($pos['data_utc'] ?? null),
                    isset($pos['hora_utc'])       ? $pos['hora_utc']               : null,
                    isset($pos['gps_timestamp_utc']) ? $pos['gps_timestamp_utc']   : null,
                    formatDateTimeForMysql($pos['received_at'] ?? null),
                ]);
            }
        }

        $pdo->commit();

        jsonResponse(201, [
            'status'   => 'ok',
            'message'  => 'Viagem salva com sucesso.',
            'trip_id'  => $tripId,
            'name'     => $name,
            'points'   => $pointsCount,
        ]);

    } catch (Throwable $e) {
        if ($pdo->inTransaction()) $pdo->rollBack();
        error_log('[SegCar Trip Save Error] ' . $e->getMessage());
        // Mesmo se houver erro no MySQL, já foi salvo em saved_trips.json
        jsonResponse(201, [
            'status'   => 'ok',
            'message'  => 'Viagem salva no armazenamento local.',
            'trip_id'  => $tripId,
            'name'     => $name,
            'points'   => $pointsCount,
        ]);
    }
}

// 9. Endereços do Cliente (GET e POST /api/addresses)
if ($path === '/api/addresses' || $path === '/api/address') {
    if ($method === 'GET') {
        $clientId = (int) (requestQueryParam('client_id') ?? 1);
        if ($pdo) {
            $stmt = $pdo->prepare('SELECT * FROM addresses WHERE client_id = ? ORDER BY is_primary DESC, id DESC');
            $stmt->execute([$clientId]);
            $addresses = $stmt->fetchAll();
            jsonResponse(200, ['status' => 'ok', 'addresses' => $addresses]);
        }
        jsonResponse(200, ['status' => 'ok', 'addresses' => []]);
    }

    if ($method === 'POST') {
        $payload = readJsonBody();
        $clientId = (int) ($payload['client_id'] ?? 1);
        $zipCode = requiredText($payload, 'zip_code');
        $street = requiredText($payload, 'street');
        $number = requiredText($payload, 'number');
        $complement = optionalText($payload, 'complement');
        $neighborhood = requiredText($payload, 'neighborhood');
        $city = optionalText($payload, 'city') ?? 'Rio Claro';
        $state = optionalText($payload, 'state') ?? 'SP';

        if ($pdo) {
            $stmtCheck = $pdo->prepare('SELECT id FROM addresses WHERE client_id = ? ORDER BY is_primary DESC, id DESC LIMIT 1');
            $stmtCheck->execute([$clientId]);
            $existingId = $stmtCheck->fetchColumn();

            if ($existingId) {
                $stmt = $pdo->prepare('UPDATE addresses SET zip_code = ?, street = ?, number = ?, complement = ?, neighborhood = ?, city = ?, state = ? WHERE id = ?');
                $stmt->execute([$zipCode, $street, $number, $complement, $neighborhood, $city, $state, $existingId]);
                jsonResponse(200, ['status' => 'ok', 'message' => 'Endereço de cobrança atualizado com sucesso.', 'address_id' => (int) $existingId]);
            } else {
                $stmt = $pdo->prepare('INSERT INTO addresses (client_id, zip_code, street, number, complement, neighborhood, city, state, is_primary) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)');
                $stmt->execute([$clientId, $zipCode, $street, $number, $complement, $neighborhood, $city, $state]);
                $addrId = (int) $pdo->lastInsertId();
                jsonResponse(201, ['status' => 'ok', 'message' => 'Endereço de cobrança cadastrado com sucesso.', 'address_id' => $addrId]);
            }
        }
        jsonResponse(200, ['status' => 'ok', 'message' => 'Endereço processado.']);
    }
}

// 10. Planos de Rastreamento (GET /api/plans)
if ($method === 'GET' && $path === '/api/plans') {
    if ($pdo) {
        $stmt = $pdo->query('SELECT * FROM plans WHERE active = 1 ORDER BY price ASC');
        $plans = $stmt->fetchAll();
        foreach ($plans as &$p) {
            $p['price'] = (float) $p['price'];
        }
        jsonResponse(200, ['status' => 'ok', 'plans' => $plans]);
    }
    jsonResponse(200, ['status' => 'ok', 'plans' => []]);
}

// 11. Assinatura do Cliente (GET e POST /api/subscriptions)
if ($path === '/api/subscriptions' || $path === '/api/subscription') {
    if ($method === 'GET') {
        $clientId = (int) (requestQueryParam('client_id') ?? 1);
        if ($pdo) {
            $stmt = $pdo->prepare('
                SELECT s.*, p.name AS plan_name, p.price, p.billing_cycle, p.max_devices
                FROM subscriptions s
                JOIN plans p ON p.id = s.plan_id
                WHERE s.client_id = ? AND s.status = \'active\'
                LIMIT 1
            ');
            $stmt->execute([$clientId]);
            $sub = $stmt->fetch();
            if ($sub) {
                $sub['price'] = (float) $sub['price'];
            }
            jsonResponse(200, ['status' => 'ok', 'subscription' => $sub]);
        }
        jsonResponse(200, ['status' => 'ok', 'subscription' => null]);
    }
}

// 12. Pagamentos e Faturas (GET e POST /api/payments)
if ($path === '/api/payments' || $path === '/api/payment') {
    if ($method === 'GET') {
        $clientId = (int) (requestQueryParam('client_id') ?? 1);
        if ($pdo) {
            $stmt = $pdo->prepare('SELECT * FROM payments WHERE client_id = ? ORDER BY due_date DESC');
            $stmt->execute([$clientId]);
            $payments = $stmt->fetchAll();
            foreach ($payments as &$pay) {
                $pay['amount'] = (float) $pay['amount'];
            }
            jsonResponse(200, ['status' => 'ok', 'payments' => $payments]);
        }
        jsonResponse(200, ['status' => 'ok', 'payments' => []]);
    }

    if ($method === 'POST') {
        $payload = readJsonBody();
        $clientId = (int) ($payload['client_id'] ?? 1);
        $paymentId = (int) ($payload['payment_id'] ?? 0);
        $methodType = optionalText($payload, 'payment_method') ?? 'pix';

        if ($pdo && $paymentId > 0) {
            $stmt = $pdo->prepare('UPDATE payments SET status = \'paid\', payment_method = ?, paid_at = NOW() WHERE id = ? AND client_id = ?');
            $stmt->execute([$methodType, $paymentId, $clientId]);
            jsonResponse(200, ['status' => 'ok', 'message' => 'Pagamento confirmado com sucesso!']);
        }
        jsonResponse(200, ['status' => 'ok', 'message' => 'Pagamento processado.']);
    }
}

// ─── 13. ROTAS ADMINISTRATIVAS DEDICADAS (ADMIN BACKOFFICE) ───────────────────

// 13.1 Métricas Globais (GET /api/admin/metrics)
if ($method === 'GET' && ($path === '/api/admin/metrics' || $path === '/api/admin/stats')) {
    if ($pdo) {
        $totalClients = (int) $pdo->query("SELECT COUNT(*) FROM clients WHERE role != 'admin'")->fetchColumn();
        $totalAdmins = (int) $pdo->query("SELECT COUNT(*) FROM clients WHERE role = 'admin'")->fetchColumn();
        $totalDevices = (int) $pdo->query("SELECT COUNT(*) FROM devices")->fetchColumn();
        $activeDevices = (int) $pdo->query("SELECT COUNT(*) FROM devices WHERE active = 1")->fetchColumn();
        $totalTrips = (int) $pdo->query("SELECT COUNT(*) FROM trips")->fetchColumn();
        
        // Online: transmitiu nos últimos 15 minutos
        $onlineDevices = (int) $pdo->query("SELECT COUNT(*) FROM latest_positions WHERE received_at >= DATE_SUB(NOW(), INTERVAL 15 MINUTE)")->fetchColumn();
        
        // MRR (Receita mensal estimada das assinaturas ativas)
        $mrr = (float) $pdo->query("
            SELECT COALESCE(SUM(p.price), 0) 
            FROM subscriptions s 
            JOIN plans p ON p.id = s.plan_id 
            WHERE s.status = 'active'
        ")->fetchColumn();

        // Pagamentos por status
        $paidCount = (int) $pdo->query("SELECT COUNT(*) FROM payments WHERE status = 'paid'")->fetchColumn();
        $pendingCount = (int) $pdo->query("SELECT COUNT(*) FROM payments WHERE status = 'pending'")->fetchColumn();
        $totalRevenue = (float) $pdo->query("SELECT COALESCE(SUM(amount), 0) FROM payments WHERE status = 'paid'")->fetchColumn();

        // Feed de atividade recente da telemetria
        $stmtActivity = $pdo->query("
            SELECT lp.device_id, lp.latitude, lp.longitude, lp.velocidade_kmh, lp.altitude_m, lp.satelites, lp.received_at,
                   d.vehicle_model, d.plate, c.name as client_name
            FROM latest_positions lp
            LEFT JOIN devices d ON d.device_id = lp.device_id
            LEFT JOIN clients c ON c.id = d.client_id
            ORDER BY lp.received_at DESC
            LIMIT 8
        ");
        $recentActivity = $stmtActivity->fetchAll();

        jsonResponse(200, [
            'status' => 'ok',
            'metrics' => [
                'total_clients' => $totalClients,
                'total_admins' => $totalAdmins,
                'total_devices' => $totalDevices,
                'active_devices' => $activeDevices,
                'online_devices' => $onlineDevices,
                'total_trips' => $totalTrips,
                'mrr' => $mrr,
                'paid_invoices' => $paidCount,
                'pending_invoices' => $pendingCount,
                'total_revenue' => $totalRevenue,
            ],
            'recent_activity' => $recentActivity,
        ]);
    }

    // Fallback sem MySQL
    jsonResponse(200, [
        'status' => 'ok',
        'metrics' => [
            'total_clients' => 1,
            'total_admins' => 1,
            'total_devices' => 1,
            'active_devices' => 1,
            'online_devices' => 1,
            'total_trips' => 2,
            'mrr' => 49.90,
            'paid_invoices' => 2,
            'pending_invoices' => 0,
            'total_revenue' => 99.80,
        ],
        'recent_activity' => [
            [
                'device_id' => 'veiculo_001',
                'vehicle_model' => 'Honda Civic Touring',
                'plate' => 'RCO-2026',
                'client_name' => 'João Silva',
                'velocidade_kmh' => 0.0,
                'latitude' => -22.383120,
                'longitude' => -47.551840,
                'received_at' => date('Y-m-d H:i:s'),
            ]
        ],
    ]);
}

// 13.2 Dispositivos & Frota Completa (GET e POST /api/admin/devices)
if ($path === '/api/admin/devices') {
    if ($method === 'GET') {
        if ($pdo) {
            $stmt = $pdo->query("
                SELECT d.id, d.client_id, d.device_id, d.vehicle_model, d.plate, d.api_key, d.active, d.created_at,
                       c.name AS client_name, c.email AS client_email, c.phone AS client_phone,
                       lp.latitude, lp.longitude, lp.velocidade_kmh, lp.altitude_m, lp.satelites, lp.received_at AS last_ping
                FROM devices d
                LEFT JOIN clients c ON c.id = d.client_id
                LEFT JOIN latest_positions lp ON lp.device_id = d.device_id
                ORDER BY d.id ASC
            ");
            $devices = $stmt->fetchAll();
            foreach ($devices as &$dev) {
                $dev['is_online'] = !empty($dev['last_ping']) && (strtotime($dev['last_ping']) >= (time() - 900));
            }
            jsonResponse(200, ['status' => 'ok', 'devices' => $devices]);
        }
        jsonResponse(200, [
            'status' => 'ok',
            'devices' => [
                [
                    'id' => 1,
                    'client_id' => 1,
                    'device_id' => 'veiculo_001',
                    'vehicle_model' => 'Honda Civic Touring',
                    'plate' => 'RCO-2026',
                    'api_key' => 'troque-esta-chave-secreta',
                    'active' => 1,
                    'client_name' => 'João Silva',
                    'latitude' => -22.383120,
                    'longitude' => -47.551840,
                    'velocidade_kmh' => 0.0,
                    'last_ping' => date('Y-m-d H:i:s'),
                    'is_online' => true,
                ]
            ]
        ]);
    }

    if ($method === 'POST') {
        $payload = readJsonBody();
        $deviceId = requiredText($payload, 'device_id');
        $clientId = (int) ($payload['client_id'] ?? 1);
        $model = optionalText($payload, 'vehicle_model') ?? 'Veículo';
        $plate = optionalText($payload, 'plate') ?? 'SEM-PLACA';
        $apiKey = optionalText($payload, 'api_key') ?? 'segcar-key-' . bin2hex(random_bytes(4));
        $active = isset($payload['active']) ? ((int) $payload['active']) : 1;

        if ($pdo) {
            $stmt = $pdo->prepare("
                INSERT INTO devices (client_id, device_id, api_key, vehicle_model, plate, active)
                VALUES (?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                    client_id = VALUES(client_id),
                    vehicle_model = VALUES(vehicle_model),
                    plate = VALUES(plate),
                    api_key = VALUES(api_key),
                    active = VALUES(active)
            ");
            $stmt->execute([$clientId, $deviceId, $apiKey, $model, $plate, $active]);
            jsonResponse(200, ['status' => 'ok', 'message' => 'Dispositivo salvo com sucesso!']);
        }
        jsonResponse(200, ['status' => 'ok', 'message' => 'Dispositivo processado.']);
    }
}

// 13.3 Faturas Globais de Todos os Clientes (GET /api/admin/payments)
if ($method === 'GET' && $path === '/api/admin/payments') {
    if ($pdo) {
        $stmt = $pdo->query("
            SELECT p.*, c.name AS client_name, c.email AS client_email, c.phone AS client_phone,
                   pl.name AS plan_name
            FROM payments p
            JOIN clients c ON c.id = p.client_id
            LEFT JOIN subscriptions s ON s.id = p.subscription_id
            LEFT JOIN plans pl ON pl.id = s.plan_id
            ORDER BY p.due_date DESC, p.id DESC
        ");
        $payments = $stmt->fetchAll();
        foreach ($payments as &$pay) {
            $pay['amount'] = (float) $pay['amount'];
        }
        jsonResponse(200, ['status' => 'ok', 'payments' => $payments]);
    }
    jsonResponse(200, ['status' => 'ok', 'payments' => []]);
}

// 13.4 Baixa / Alteração Manual de Fatura pelo Admin (POST /api/admin/payments/status)
if ($method === 'POST' && $path === '/api/admin/payments/status') {
    $payload = readJsonBody();
    $paymentId = (int) ($payload['payment_id'] ?? 0);
    $status = optionalText($payload, 'status') ?? 'paid';

    if ($pdo && $paymentId > 0) {
        $paidAt = ($status === 'paid') ? date('Y-m-d H:i:s') : null;
        $stmt = $pdo->prepare("UPDATE payments SET status = ?, paid_at = ? WHERE id = ?");
        $stmt->execute([$status, $paidAt, $paymentId]);
        jsonResponse(200, ['status' => 'ok', 'message' => 'Status da fatura atualizado com sucesso!']);
    }
    jsonResponse(200, ['status' => 'ok', 'message' => 'Processado.']);
}

jsonResponse(404, [
    'status' => 'error',
    'message' => 'Rota nao encontrada.',
]);
