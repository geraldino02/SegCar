<#
  SegCar Serial Bridge
  Le a porta COM do Arduino e envia os dados JSON para a API PHP.
  
  USO:
    .\serial_bridge.ps1
    .\serial_bridge.ps1 -ComPort COM5
    .\serial_bridge.ps1 -ComPort COM3 -ApiUrl http://127.0.0.1:8080 -ApiKey minha-chave
#>

param(
    [string]$ComPort  = "",
    [int]$BaudRate    = 9600,
    [string]$ApiUrl   = "http://localhost/segcar/sketch_jul12a/api/public/index.php",
    [string]$ApiKey   = "troque-esta-chave-secreta"
)

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "  =====================================" -ForegroundColor Cyan
Write-Host "    SegCar Serial Bridge" -ForegroundColor Cyan
Write-Host "  =====================================" -ForegroundColor Cyan
Write-Host ""

# Detectar portas COM disponíveis
$availablePorts = [System.IO.Ports.SerialPort]::GetPortNames()

if (-not $ComPort) {
    if ($availablePorts.Count -eq 1) {
        $ComPort = $availablePorts[0]
        Write-Host "  [i] Porta detectada automaticamente: $ComPort" -ForegroundColor Yellow
    } elseif ($availablePorts.Count -gt 1) {
        $ComPort = $availablePorts[0]
        Write-Host "  [i] Portas disponíveis: $($availablePorts -join ', '). Usando $ComPort" -ForegroundColor Yellow
    } else {
        Write-Host "  [!] Nenhuma porta COM ativa foi encontrada no Windows." -ForegroundColor Red
        Write-Host "      1. Conecte o cabo USB do Arduino no computador." -ForegroundColor Yellow
        Write-Host "      2. Se estiver testando sem placa, abra o simulador:" -ForegroundColor Cyan
        Write-Host "         http://localhost/segcar/mock_gps.html" -ForegroundColor Cyan
        Write-Host ""
        exit 1
    }
}

$cleanUrl = $ApiUrl.TrimEnd('/')
$endpoint = if ($cleanUrl -like "*api/gps*") { $cleanUrl } else { "$cleanUrl/api/gps" }

Write-Host "  Porta:  $ComPort @ ${BaudRate}bps" -ForegroundColor Gray
Write-Host "  API:    $endpoint" -ForegroundColor Gray
Write-Host ""
Write-Host "  [!] Feche o Monitor Serial da Arduino IDE antes de rodar!" -ForegroundColor Yellow
Write-Host ""

# --- Abrir porta serial ---
try {
    $port = New-Object System.IO.Ports.SerialPort $ComPort, $BaudRate, "None", 8, "One"
    $port.ReadTimeout  = 5000
    $port.DtrEnable    = $true
    $port.RtsEnable    = $true
    $port.NewLine      = "`n"
    $port.Open()
    Write-Host "  [OK] Porta $ComPort aberta com sucesso!" -ForegroundColor Green
} catch {
    Write-Host "  [ERRO] Nao foi possivel abrir $ComPort" -ForegroundColor Red
    Write-Host "         $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "  Portas COM detectadas no momento: $(if ($availablePorts) { $availablePorts -join ', ' } else { 'Nenhuma' })" -ForegroundColor Yellow
    Write-Host "  Dicas:" -ForegroundColor Yellow
    Write-Host "    - Verifique se o cabo USB do Arduino esta conectado" -ForegroundColor Yellow
    Write-Host "    - Feche o Monitor Serial da Arduino IDE (ele bloqueia a porta)" -ForegroundColor Yellow
    Write-Host "    - Veja qual porta aparece na Arduino IDE em: Ferramentas > Porta" -ForegroundColor Yellow
    exit 1
}

Write-Host "  [..] Lendo dados do Arduino... (Ctrl+C para parar)" -ForegroundColor Gray
Write-Host ""

$sentCount   = 0
$errorCount  = 0
$calibCount  = 0

try {
    while ($true) {
        try {
            $line = $port.ReadLine().Trim()
        } catch [System.TimeoutException] {
            continue
        }

        if ([string]::IsNullOrWhiteSpace($line)) { continue }

        # Ignorar linhas que nao sao JSON
        if (-not $line.StartsWith("{")) {
            # Mostrar mensagens de texto do Arduino em cinza
            Write-Host "  [SERIAL] $line" -ForegroundColor DarkGray
            continue
        }

        # Tentar parsear JSON
        try {
            $data = $line | ConvertFrom-Json
        } catch {
            Write-Host "  [WARN] JSON invalido: $line" -ForegroundColor DarkYellow
            continue
        }

        $deviceId = $data.device_id
        $timestamp = Get-Date -Format "HH:mm:ss"

        # Verificar se e estado de calibracao (sem latitude)
        if ($data.status -eq "aguardando_fix") {
            $calibCount++
            $sats = if ($null -ne $data.satelites) { $data.satelites } else { "0" }
            
            try {
                $headers = @{
                    "Content-Type" = "application/json"
                    "X-API-Key"    = $ApiKey
                }

                $response = Invoke-RestMethod `
                    -Method Post `
                    -Uri $endpoint `
                    -Headers $headers `
                    -Body $line `
                    -TimeoutSec 5

                Write-Host "  [$timestamp] " -NoNewline -ForegroundColor DarkGray
                Write-Host "CALIBRANDO" -NoNewline -ForegroundColor Yellow
                Write-Host " | Satelites: $sats | HDOP: $($data.hdop) (#$calibCount)" -ForegroundColor DarkYellow
            } catch {
                $errorCount++
                Write-Host "  [$timestamp] " -NoNewline -ForegroundColor DarkGray
                Write-Host "ERRO API CALIB" -NoNewline -ForegroundColor Red
                Write-Host " | $($_.Exception.Message)" -ForegroundColor DarkRed
            }
            continue
        }

        # Enviar para a API
        try {
            $headers = @{
                "Content-Type" = "application/json"
                "X-API-Key"    = $ApiKey
            }

            $response = Invoke-RestMethod `
                -Method Post `
                -Uri $endpoint `
                -Headers $headers `
                -Body $line `
                -TimeoutSec 5

            $sentCount++
            $lat = if ($null -ne $data.latitude)  { [math]::Round($data.latitude, 4) }  else { "?" }
            $lng = if ($null -ne $data.longitude) { [math]::Round($data.longitude, 4) } else { "?" }
            $spd = if ($null -ne $data.velocidade_kmh) { "$([math]::Round($data.velocidade_kmh, 1)) km/h" } else { "n/d" }

            Write-Host "  [$timestamp] " -NoNewline -ForegroundColor DarkGray
            Write-Host "ENVIADO #$sentCount" -NoNewline -ForegroundColor Green
            Write-Host " | $lat, $lng | $spd | Sat: $($data.satelites)" -ForegroundColor Cyan

        } catch {
            $errorCount++
            $errMsg = $_.Exception.Message
            if ($null -ne $_.Exception.Response) {
                try {
                    $stream = $_.Exception.Response.GetResponseStream()
                    $reader = New-Object System.IO.StreamReader($stream)
                    $body = $reader.ReadToEnd()
                    $jsonErr = $body | ConvertFrom-Json
                    if ($null -ne $jsonErr.message) {
                        $errMsg = $jsonErr.message
                    } else {
                        $errMsg = $body
                    }
                } catch {}
            }
            Write-Host "  [$timestamp] " -NoNewline -ForegroundColor DarkGray
            Write-Host "ERRO API" -NoNewline -ForegroundColor Red
            Write-Host " | $errMsg" -ForegroundColor DarkRed
        }
    }
} finally {
    Write-Host ""
    Write-Host "  ────────────────────────────────────" -ForegroundColor DarkGray
    Write-Host "  Enviados: $sentCount | Erros: $errorCount | Calibracoes: $calibCount" -ForegroundColor Gray
    
    if ($port.IsOpen) {
        $port.Close()
        Write-Host "  [OK] Porta $ComPort fechada." -ForegroundColor Green
    }
}
