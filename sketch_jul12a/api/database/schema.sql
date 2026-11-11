-- =============================================================================
-- SegCar - Schema do Banco de Dados MySQL Completo e Escalável
-- Inclui: Clientes, Endereços, Dispositivos, Telemetria, Planos, Assinaturas e Pagamentos
-- Rotas seguindo as ruas reais de Rio Claro-SP
-- =============================================================================

CREATE DATABASE IF NOT EXISTS segcar_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE segcar_db;

-- 1. Clientes
CREATE TABLE IF NOT EXISTS clients (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NULL,
    phone VARCHAR(30) NULL,
    cpf VARCHAR(14) NULL UNIQUE,
    birth_date DATE NULL,
    age INT NULL,
    password_hash VARCHAR(255) NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'client',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Endereços dos Clientes
CREATE TABLE IF NOT EXISTS addresses (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    client_id BIGINT UNSIGNED NOT NULL,
    zip_code VARCHAR(10) NOT NULL,
    street VARCHAR(150) NOT NULL,
    number VARCHAR(20) NOT NULL,
    complement VARCHAR(100) NULL,
    neighborhood VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL DEFAULT 'Rio Claro',
    state VARCHAR(2) NOT NULL DEFAULT 'SP',
    is_primary TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Dispositivos / Veículos
CREATE TABLE IF NOT EXISTS devices (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    client_id BIGINT UNSIGNED NOT NULL,
    device_id VARCHAR(50) NOT NULL UNIQUE,
    api_key VARCHAR(128) NOT NULL,
    vehicle_model VARCHAR(100) NULL,
    plate VARCHAR(20) NULL,
    active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Viagens / Rotas Salvas
CREATE TABLE IF NOT EXISTS trips (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    client_id BIGINT UNSIGNED NOT NULL,
    device_id VARCHAR(50) NOT NULL,
    name VARCHAR(150) NOT NULL,
    origin_name VARCHAR(100) NULL,
    destination_name VARCHAR(100) NULL,
    status ENUM('in_progress', 'completed') NOT NULL DEFAULT 'completed',
    start_time DATETIME NOT NULL,
    end_time DATETIME NULL,
    total_distance_m DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    duration_seconds INT UNSIGNED NOT NULL DEFAULT 0,
    avg_speed_kmh DECIMAL(8, 2) NOT NULL DEFAULT 0.00,
    max_speed_kmh DECIMAL(8, 2) NOT NULL DEFAULT 0.00,
    points_count INT UNSIGNED NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    INDEX idx_trip_device (device_id, start_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Posições GPS / Histórico de Telemetria
CREATE TABLE IF NOT EXISTS gps_positions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    trip_id BIGINT UNSIGNED NULL,
    device_id VARCHAR(50) NOT NULL,
    latitude DECIMAL(10, 6) NOT NULL,
    longitude DECIMAL(10, 6) NOT NULL,
    velocidade_kmh DECIMAL(8, 2) NULL DEFAULT 0.00,
    altitude_m DECIMAL(8, 2) NULL DEFAULT 0.00,
    satelites SMALLINT UNSIGNED NULL DEFAULT 0,
    hdop DECIMAL(4, 2) NULL DEFAULT 1.0,
    data_utc DATE NULL,
    hora_utc TIME NULL,
    gps_timestamp_utc DATETIME NULL,
    received_at DATETIME NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'ativo',
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE SET NULL,
    INDEX idx_device_received (device_id, received_at DESC),
    INDEX idx_trip_positions (trip_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Cache de Última Posição Conhecida (Otimização de Alta Escala)
CREATE TABLE IF NOT EXISTS latest_positions (
    device_id VARCHAR(50) PRIMARY KEY,
    trip_id BIGINT UNSIGNED NULL,
    latitude DECIMAL(10, 6) NOT NULL,
    longitude DECIMAL(10, 6) NOT NULL,
    velocidade_kmh DECIMAL(8, 2) NULL DEFAULT 0.00,
    altitude_m DECIMAL(8, 2) NULL DEFAULT 0.00,
    satelites SMALLINT UNSIGNED NULL DEFAULT 0,
    hdop DECIMAL(4, 2) NULL DEFAULT 1.0,
    data_utc DATE NULL,
    hora_utc TIME NULL,
    gps_timestamp_utc DATETIME NULL,
    received_at DATETIME NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'ativo',
    INDEX idx_latest_received (received_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Planos de Rastreamento / Assinatura
CREATE TABLE IF NOT EXISTS plans (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT NULL,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    billing_cycle ENUM('monthly', 'yearly') NOT NULL DEFAULT 'monthly',
    max_devices INT UNSIGNED NOT NULL DEFAULT 1,
    active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. Assinaturas dos Clientes
CREATE TABLE IF NOT EXISTS subscriptions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    client_id BIGINT UNSIGNED NOT NULL,
    plan_id BIGINT UNSIGNED NOT NULL,
    status ENUM('active', 'pending', 'past_due', 'canceled') NOT NULL DEFAULT 'active',
    due_day TINYINT UNSIGNED NOT NULL DEFAULT 10,
    starts_at DATE NOT NULL,
    expires_at DATE NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. Pagamentos / Faturas
CREATE TABLE IF NOT EXISTS payments (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    subscription_id BIGINT UNSIGNED NULL,
    client_id BIGINT UNSIGNED NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method ENUM('pix', 'credit_card', 'boleto') NOT NULL DEFAULT 'pix',
    status ENUM('paid', 'pending', 'failed', 'refunded') NOT NULL DEFAULT 'pending',
    transaction_id VARCHAR(100) NULL,
    pix_code TEXT NULL,
    boleto_url VARCHAR(255) NULL,
    due_date DATE NOT NULL,
    paid_at DATETIME NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================================================
-- SEED DE DADOS: Clientes, Endereço, Planos, Assinatura e Rotas
-- =============================================================================

INSERT IGNORE INTO clients (id, name, email, phone, cpf, birth_date, age, password_hash, role)
VALUES 
(1, 'João Silva', 'joao.silva@email.com', '(19) 98765-4321', '123.456.789-00', '1990-01-01', 36, '$2y$12$ErM.ze8RORcXbrlai6PXl.DWZTUthj4UG7qoqWMY6/LqLrAy8TQ86', 'client'),
(2, 'Administrador SegCar', 'admin@segcar.com', '(19) 99999-9999', '000.000.000-00', '1985-01-01', 41, '$2y$12$5ALo/Uj/VuAUzGVx7GCYf.JnLiqaQPTFpoBFBbFkPIhpXpeUsuqLy', 'admin');

INSERT INTO addresses (id, client_id, zip_code, street, number, complement, neighborhood, city, state, is_primary)
VALUES (1, 1, '13500-000', 'Avenida Visconde de Rio Claro', '1500', 'Apto 42', 'Centro', 'Rio Claro', 'SP', 1)
ON DUPLICATE KEY UPDATE street = VALUES(street), zip_code = VALUES(zip_code);

INSERT INTO devices (id, client_id, device_id, api_key, vehicle_model, plate, active)
VALUES (1, 1, 'veiculo_001', 'troque-esta-chave-secreta', 'Honda Civic Touring', 'RCO-2026', 1)
ON DUPLICATE KEY UPDATE vehicle_model = VALUES(vehicle_model), plate = VALUES(plate), api_key = VALUES(api_key);

INSERT INTO plans (id, name, description, price, billing_cycle, max_devices, active)
VALUES 
(1, 'SegCar Básico', 'Rastreamento em tempo real com histórico de 30 dias', 49.90, 'monthly', 1, 1),
(2, 'SegCar Frota Pro', 'Rastreamento ilimitado, relatórios e bloqueio remoto', 99.90, 'monthly', 5, 1)
ON DUPLICATE KEY UPDATE price = VALUES(price);

INSERT INTO subscriptions (id, client_id, plan_id, status, due_day, starts_at, expires_at)
VALUES (1, 1, 1, 'active', 10, '2026-01-01', '2026-12-31')
ON DUPLICATE KEY UPDATE status = VALUES(status);

INSERT INTO payments (id, subscription_id, client_id, amount, payment_method, status, transaction_id, due_date, paid_at)
VALUES 
(1, 1, 1, 49.90, 'pix', 'paid', 'PIX-2026-0801-001', '2026-08-10', '2026-08-05 10:15:00'),
(2, 1, 1, 49.90, 'pix', 'paid', 'PIX-2026-0901-002', '2026-09-10', '2026-09-02 14:20:00')
ON DUPLICATE KEY UPDATE status = VALUES(status);

DELETE FROM gps_positions WHERE device_id = 'veiculo_001';
DELETE FROM trips WHERE device_id = 'veiculo_001';

-- -----------------------------------------------------------------------------
-- ROTA 1: Jardim Floridiana para Centro (Av. Brasil e Av. Visconde de Rio Claro)
-- -----------------------------------------------------------------------------
INSERT INTO trips (id, client_id, device_id, name, origin_name, destination_name, status, start_time, end_time, total_distance_m, duration_seconds, avg_speed_kmh, max_speed_kmh, points_count)
VALUES (1, 1, 'veiculo_001', 'Floridiana para Centro (Mercado)', 'Jardim Floridiana', 'Mercado Municipal', 'completed', '2026-08-18 08:10:00', '2026-08-18 08:22:00', 3920.00, 720, 32.7, 49.2, 17);

INSERT INTO gps_positions (trip_id, device_id, latitude, longitude, velocidade_kmh, altitude_m, satelites, hdop, data_utc, hora_utc, gps_timestamp_utc, received_at, status) VALUES
(1, 'veiculo_001', -22.382845, -47.554312, 0.0, 615.0, 10, 0.9, '2026-08-18', '11:10:00', '2026-08-18 11:10:00', '2026-08-18 08:10:00', 'ativo'),
(1, 'veiculo_001', -22.384210, -47.554480, 22.0, 614.0, 10, 0.9, '2026-08-18', '11:10:45', '2026-08-18 11:10:45', '2026-08-18 08:10:45', 'ativo'),
(1, 'veiculo_001', -22.386500, -47.554800, 35.0, 613.0, 11, 0.8, '2026-08-18', '11:11:30', '2026-08-18 11:11:30', '2026-08-18 08:11:30', 'ativo'),
(1, 'veiculo_001', -22.389200, -47.555250, 42.0, 612.0, 11, 0.8, '2026-08-18', '11:12:15', '2026-08-18 11:12:15', '2026-08-18 08:12:15', 'ativo'),
(1, 'veiculo_001', -22.392100, -47.555700, 45.5, 610.0, 12, 0.8, '2026-08-18', '11:13:00', '2026-08-18 11:13:00', '2026-08-18 08:13:00', 'ativo'),
(1, 'veiculo_001', -22.394800, -47.556100, 48.0, 609.0, 12, 0.8, '2026-08-18', '11:13:45', '2026-08-18 11:13:45', '2026-08-18 08:13:45', 'ativo'),
(1, 'veiculo_001', -22.397500, -47.556500, 49.2, 608.0, 12, 0.8, '2026-08-18', '11:14:30', '2026-08-18 11:14:30', '2026-08-18 08:14:30', 'ativo'),
(1, 'veiculo_001', -22.400200, -47.556900, 44.0, 607.0, 11, 0.8, '2026-08-18', '11:15:15', '2026-08-18 11:15:15', '2026-08-18 08:15:15', 'ativo'),
(1, 'veiculo_001', -22.403100, -47.557350, 40.0, 607.0, 11, 0.8, '2026-08-18', '11:16:00', '2026-08-18 11:16:00', '2026-08-18 08:16:00', 'ativo'),
(1, 'veiculo_001', -22.406200, -47.557800, 36.0, 608.0, 11, 0.8, '2026-08-18', '11:16:45', '2026-08-18 11:16:45', '2026-08-18 08:16:45', 'ativo'),
(1, 'veiculo_001', -22.409500, -47.558300, 28.0, 609.0, 10, 0.9, '2026-08-18', '11:17:30', '2026-08-18 11:17:30', '2026-08-18 08:17:30', 'ativo'),
(1, 'veiculo_001', -22.410350, -47.559400, 25.0, 610.0, 10, 0.9, '2026-08-18', '11:18:15', '2026-08-18 11:18:15', '2026-08-18 08:18:15', 'ativo'),
(1, 'veiculo_001', -22.410400, -47.561500, 32.0, 611.0, 10, 0.9, '2026-08-18', '11:19:00', '2026-08-18 11:19:00', '2026-08-18 08:19:00', 'ativo'),
(1, 'veiculo_001', -22.410480, -47.563800, 24.0, 613.0, 9, 1.0, '2026-08-18', '11:19:45', '2026-08-18 11:19:45', '2026-08-18 08:19:45', 'ativo'),
(1, 'veiculo_001', -22.411600, -47.563920, 18.0, 613.0, 9, 1.0, '2026-08-18', '11:20:30', '2026-08-18 11:20:30', '2026-08-18 08:20:30', 'ativo'),
(1, 'veiculo_001', -22.412450, -47.564050, 6.0, 614.0, 10, 0.9, '2026-08-18', '11:21:15', '2026-08-18 11:21:15', '2026-08-18 08:21:15', 'ativo'),
(1, 'veiculo_001', -22.412460, -47.564070, 0.0, 614.0, 10, 0.9, '2026-08-18', '11:22:00', '2026-08-18 11:22:00', '2026-08-18 08:22:00', 'ativo');

-- Alimentar cache da última posição conhecida
INSERT INTO latest_positions (device_id, trip_id, latitude, longitude, velocidade_kmh, altitude_m, satelites, hdop, data_utc, hora_utc, gps_timestamp_utc, received_at, status)
VALUES ('veiculo_001', 1, -22.412460, -47.564070, 0.0, 614.0, 10, 0.9, '2026-08-18', '11:22:00', '2026-08-18 11:22:00', '2026-08-18 08:22:00', 'ativo')
ON DUPLICATE KEY UPDATE latitude = VALUES(latitude), longitude = VALUES(longitude), velocidade_kmh = VALUES(velocidade_kmh), received_at = VALUES(received_at);
