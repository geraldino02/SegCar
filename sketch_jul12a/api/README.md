# API GPS

Esta API recebe os dados do GPS em JSON e salva tudo localmente para voce testar sem modulo 4G.

## Rotas

- `GET /health` verifica se a API esta no ar.
- `GET /api/latest` retorna a ultima posicao de cada dispositivo.
- `GET /api/latest?device_id=veiculo_001` retorna a ultima posicao de um dispositivo especifico.
- `GET /api/history?device_id=veiculo_001` retorna o historico do dispositivo.
- `GET /api/history?device_id=veiculo_001&limit=10` limita a quantidade de registros retornados.
- `POST /api/gps` recebe latitude, longitude, velocidade e horario.

## Como rodar

Na pasta do projeto, inicie o servidor com:

```powershell
php -S 127.0.0.1:8080 -t api/public
```

Depois abra no navegador ou no Postman:

- `http://127.0.0.1:8080/health`
- `http://127.0.0.1:8080/api/latest`
- `http://127.0.0.1:8080/api/history?device_id=veiculo_001`

## Como testar o recebimento

Exemplo com PowerShell:

```powershell
$body = Get-Content -Raw -LiteralPath 'api/exemplo_payload.json'
Invoke-RestMethod -Method Post -Uri 'http://127.0.0.1:8080/api/gps' -Headers @{ 'X-API-Key' = 'troque-esta-chave-secreta' } -ContentType 'application/json' -Body $body
```

## JSON esperado

```json
{
  "device_id": "veiculo_001",
  "latitude": -23.55052,
  "longitude": -46.633308,
  "velocidade_kmh": 42.5,
  "altitude_m": 760.2,
  "satelites": 8,
  "data_utc": "12/07/2026",
  "hora_utc": "14:32:10"
}
```

## Onde os dados ficam salvos

- Historico completo: `api/storage/gps_logs.jsonl`
- Ultima posicao por dispositivo: `api/storage/latest_positions.json`

## Seguranca simples

A API exige o cabecalho `X-API-Key`.
A chave do dispositivo fica em `api/config.php`.
Troque a chave antes de usar em producao.

## Banco para a proxima etapa

O arquivo `api/database/schema.sql` ja deixa um modelo MySQL pronto para quando voce quiser sair do arquivo local e salvar direto em banco.
