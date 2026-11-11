<?php

declare(strict_types=1);

return [
    'timezone' => 'America/Sao_Paulo',
    'db' => [
        'host' => '127.0.0.1',
        'port' => 3306,
        'dbname' => 'segcar_db',
        'user' => 'root',
        'password' => '',
        'charset' => 'utf8mb4',
    ],
    'storage' => [
        'history_file' => __DIR__ . '/storage/gps_logs.jsonl',
        'latest_file' => __DIR__ . '/storage/latest_positions.json',
    ],
    'devices' => [
        'veiculo_001' => 'troque-esta-chave-secreta',
    ],
];
