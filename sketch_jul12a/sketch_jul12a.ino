#include <SoftwareSerial.h>
#include <TinyGPS++.h>

// =============================================================================
// SegCar - Firmware do Rastreador Veicular (GPS Real / Modo Normal)
// Leitura direta da antena GPS (NEO-6M / GT-U7) e envio via USB Serial
// Compatível com serial_bridge.ps1, API REST SegCar e Dashboard
// =============================================================================

// ─── CONFIGURAÇÃO DE PINOS DO GPS ────────────────────────────────────────────
// Arduino Uno / Nano:
// - GPS_RX_PIN (Pino 10): Conecta no TX do módulo GPS
// - GPS_TX_PIN (Pino 11): Conecta no RX do módulo GPS
static const int GPS_RX_PIN = 10;
static const int GPS_TX_PIN = 11;
static const uint32_t GPS_BAUDRATE = 9600;

// ─── IDENTIFICAÇÃO E INTERVALO ───────────────────────────────────────────────
const char* DEVICE_ID = "veiculo_001";
const unsigned long INTERVALO_ENVIO_MS = 2000; // Envia a cada 2 segundos

SoftwareSerial gpsSerial(GPS_RX_PIN, GPS_TX_PIN);
TinyGPSPlus gps;

unsigned long ultimoEnvio = 0;

void printDoisDigitos(int valor) {
  if (valor < 10) Serial.print('0');
  Serial.print(valor);
}

void setup() {
  Serial.begin(9600); // Envio via USB ao computador (serial_bridge.ps1)
  gpsSerial.begin(GPS_BAUDRATE);

  delay(1000);
  Serial.println(F("[GPS] SegCar - Rastreador Inicializado!"));
  Serial.println(F("[GPS] Modo Normal: Antena GPS real ativa (sem coordenadas fixas)."));
  Serial.println(F("[GPS] Aguardando sinal dos satelites para iniciar percurso..."));
}

void loop() {
  // Alimenta o parser da TinyGPSPlus com os dados que chegam da porta do GPS
  while (gpsSerial.available() > 0) {
    gps.encode(gpsSerial.read());
  }

  unsigned long agora = millis();
  if (agora - ultimoEnvio >= INTERVALO_ENVIO_MS) {
    ultimoEnvio = agora;
    enviarTelemetria();
  }
}

void enviarTelemetria() {
  // Verifica se a antena do GPS tem fix válido e recente (sinal recebido nos últimos 5s)
  bool temFixReal = gps.location.isValid() && (gps.location.age() < 5000);

  if (temFixReal) {
    // ═════════════════════════════════════════════════════════════════════════
    // 1. DADOS REAIS DA ANTENA GPS (Em movimento ou parado no local real)
    // ═════════════════════════════════════════════════════════════════════════
    double lat = gps.location.lat();
    double lng = gps.location.lng();
    double vel = gps.speed.isValid() ? gps.speed.kmph() : 0.0;
    double alt = gps.altitude.isValid() ? gps.altitude.meters() : 0.0;
    int sat = gps.satellites.isValid() ? gps.satellites.value() : 0;
    double hdop = gps.hdop.isValid() ? (gps.hdop.value() / 100.0) : 1.0;

    Serial.print(F("{\"device_id\":\""));
    Serial.print(DEVICE_ID);
    Serial.print(F("\",\"latitude\":"));
    Serial.print(lat, 6);
    Serial.print(F(",\"longitude\":"));
    Serial.print(lng, 6);
    Serial.print(F(",\"velocidade_kmh\":"));
    Serial.print(vel, 1);
    Serial.print(F(",\"altitude_m\":"));
    Serial.print(alt, 1);
    Serial.print(F(",\"satelites\":"));
    Serial.print(sat);
    Serial.print(F(",\"hdop\":"));
    Serial.print(hdop, 2);

    // Data e Hora UTC dos Satélites
    if (gps.date.isValid() && gps.date.year() >= 2024 && gps.time.isValid()) {
      Serial.print(F(",\"data_utc\":\""));
      printDoisDigitos(gps.date.day());
      Serial.print('/');
      printDoisDigitos(gps.date.month());
      Serial.print('/');
      Serial.print(gps.date.year());
      Serial.print(F("\",\"hora_utc\":\""));
      printDoisDigitos(gps.time.hour());
      Serial.print(':');
      printDoisDigitos(gps.time.minute());
      Serial.print(':');
      printDoisDigitos(gps.time.second());
      Serial.print(F("\""));
    } else {
      Serial.print(F(",\"data_utc\":null,\"hora_utc\":null"));
    }

    Serial.println(F(",\"status\":\"ativo\"}"));

  } else {
    // ═════════════════════════════════════════════════════════════════════════
    // 2. AGUARDANDO SINAL / CALIBRANDO (Sem sinal de satélite no momento)
    // ═════════════════════════════════════════════════════════════════════════
    int sat = gps.satellites.isValid() ? gps.satellites.value() : 0;
    double hdop = gps.hdop.isValid() ? (gps.hdop.value() / 100.0) : 99.9;

    Serial.print(F("{\"device_id\":\""));
    Serial.print(DEVICE_ID);
    Serial.print(F("\",\"status\":\"aguardando_fix\",\"satelites\":"));
    Serial.print(sat);
    Serial.print(F(",\"hdop\":"));
    Serial.print(hdop, 2);
    Serial.println(F("}"));
  }
}
