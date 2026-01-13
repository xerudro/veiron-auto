-- VEIRONAUTO Car Rental Database - Complete Initialization
-- Database: veironau1_to
-- MariaDB 10.6+ compatible
-- Created: 2026-01-13

-- =====================================================
-- USE DATABASE
-- =====================================================

USE veironau1_to;

-- =====================================================
-- DROP EXISTING TABLES (if reinstalling)
-- =====================================================

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS audit_log;
DROP TABLE IF EXISTS car_maintenance;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS booking_services;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS clients;
DROP TABLE IF EXISTS car_pricing_tiers;
DROP TABLE IF EXISTS cars;
DROP TABLE IF EXISTS currency_rates;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS system_settings;
DROP TABLE IF EXISTS contact_messages;

-- Drop views
DROP VIEW IF EXISTS active_bookings;
DROP VIEW IF EXISTS car_availability;
DROP VIEW IF EXISTS revenue_summary;
DROP VIEW IF EXISTS unread_contact_messages;

-- Drop procedures
DROP PROCEDURE IF EXISTS create_booking;
DROP PROCEDURE IF EXISTS update_currency_rate;

-- Drop triggers
DROP TRIGGER IF EXISTS audit_bookings_trigger;
DROP TRIGGER IF EXISTS audit_clients_trigger;

SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================
-- SYSTEM SETTINGS TABLE
-- =====================================================

CREATE TABLE system_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT,
    setting_type ENUM('string', 'integer', 'float', 'boolean', 'json') DEFAULT 'string',
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_setting_key (setting_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- USERS TABLE (Admin Authentication)
-- =====================================================

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role ENUM('admin', 'manager', 'staff') DEFAULT 'admin',
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    password_changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- CURRENCY RATES TABLE
-- =====================================================

CREATE TABLE currency_rates (
    id INT PRIMARY KEY AUTO_INCREMENT,
    from_currency VARCHAR(3) NOT NULL DEFAULT 'EUR',
    to_currency VARCHAR(3) NOT NULL DEFAULT 'RON',
    rate DECIMAL(10,4) NOT NULL,
    effective_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_from_to_currency (from_currency, to_currency),
    INDEX idx_effective_date (effective_date),
    INDEX idx_is_active (is_active),
    UNIQUE KEY unique_active_rate (from_currency, to_currency, is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- CARS TABLE (Fleet Inventory)
-- =====================================================

CREATE TABLE cars (
    id INT PRIMARY KEY AUTO_INCREMENT,
    car_id VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    category ENUM('economy', 'compact', 'sedan', 'suv', 'premium', 'multi_passenger') NOT NULL,
    transmission ENUM('manual', 'automatic') NOT NULL,
    fuel_type ENUM('petrol', 'diesel', 'hybrid', 'electric') DEFAULT 'petrol',
    passengers INT NOT NULL DEFAULT 5,
    luggage INT NOT NULL DEFAULT 2,
    image_path VARCHAR(255),
    base_price_eur DECIMAL(8,2) NOT NULL,
    insurance_premium_eur DECIMAL(8,2) DEFAULT 0,
    insurance_full_eur DECIMAL(8,2) DEFAULT 0,
    warranty_amount_eur DECIMAL(8,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_car_id (car_id),
    INDEX idx_category (category),
    INDEX idx_transmission (transmission),
    INDEX idx_is_active (is_active),
    INDEX idx_sort_order (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- CAR PRICING TIERS TABLE
-- =====================================================

CREATE TABLE car_pricing_tiers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    car_id INT NOT NULL,
    tier_name VARCHAR(50) NOT NULL,
    min_days INT NOT NULL,
    max_days INT,
    price_per_day_eur DECIMAL(8,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE,
    INDEX idx_car_id (car_id),
    INDEX idx_tier_name (tier_name),
    UNIQUE KEY unique_car_tier (car_id, tier_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- CLIENTS TABLE (Customer Database)
-- =====================================================

CREATE TABLE clients (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    phone_country_code VARCHAR(5) DEFAULT '+40',
    date_of_birth DATE,
    drivers_license_number VARCHAR(50),
    drivers_license_expiry DATE,
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100) DEFAULT 'Romania',
    notes TEXT,
    total_bookings INT DEFAULT 0,
    total_spent_eur DECIMAL(10,2) DEFAULT 0,
    is_vip BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_email (email),
    INDEX idx_phone (phone),
    INDEX idx_last_name (last_name),
    INDEX idx_is_vip (is_vip),
    INDEX idx_total_bookings (total_bookings),
    FULLTEXT idx_full_name (first_name, last_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- BOOKINGS TABLE (Rental Reservations)
-- =====================================================

CREATE TABLE bookings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    booking_number VARCHAR(20) NOT NULL UNIQUE,
    client_id INT,
    car_id INT NOT NULL,
    pickup_location VARCHAR(255) NOT NULL,
    dropoff_location VARCHAR(255) NOT NULL,
    pickup_date DATE NOT NULL,
    pickup_time TIME NOT NULL,
    dropoff_date DATE NOT NULL,
    dropoff_time TIME NOT NULL,
    duration_days INT NOT NULL,
    status ENUM('pending', 'confirmed', 'active', 'completed', 'cancelled', 'no_show') DEFAULT 'pending',

    -- Pricing
    base_rate_eur DECIMAL(8,2) NOT NULL,
    insurance_type ENUM('none', 'premium', 'full') DEFAULT 'none',
    insurance_cost_eur DECIMAL(8,2) DEFAULT 0,
    additional_services_cost_eur DECIMAL(8,2) DEFAULT 0,
    total_cost_eur DECIMAL(8,2) NOT NULL,
    total_cost_ron DECIMAL(8,2) NOT NULL,

    -- Payment
    payment_status ENUM('pending', 'paid', 'partial', 'refunded') DEFAULT 'pending',
    payment_method VARCHAR(50),
    payment_date TIMESTAMP NULL,

    -- Booking source
    booking_source ENUM('online', 'phone', 'walk_in', 'admin') DEFAULT 'online',
    booking_reference VARCHAR(100),

    -- Admin fields
    notes TEXT,
    created_by INT,
    confirmed_by INT,
    cancelled_by INT,
    cancellation_reason TEXT,
    cancellation_date TIMESTAMP NULL,

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL,
    FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE RESTRICT,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (confirmed_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (cancelled_by) REFERENCES users(id) ON DELETE SET NULL,

    INDEX idx_booking_number (booking_number),
    INDEX idx_client_id (client_id),
    INDEX idx_car_id (car_id),
    INDEX idx_status (status),
    INDEX idx_pickup_date (pickup_date),
    INDEX idx_dropoff_date (dropoff_date),
    INDEX idx_payment_status (payment_status),
    INDEX idx_booking_source (booking_source),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- BOOKING SERVICES TABLE
-- =====================================================

CREATE TABLE booking_services (
    id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT NOT NULL,
    service_type VARCHAR(50) NOT NULL,
    service_name VARCHAR(100) NOT NULL,
    quantity INT DEFAULT 1,
    unit_price_eur DECIMAL(8,2) NOT NULL,
    total_price_eur DECIMAL(8,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    INDEX idx_booking_id (booking_id),
    INDEX idx_service_type (service_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- CONTACT MESSAGES TABLE
-- =====================================================

CREATE TABLE contact_messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(255),
    message TEXT NOT NULL,

    -- Status tracking
    status ENUM('new', 'read', 'replied', 'archived', 'spam') DEFAULT 'new',
    replied_at TIMESTAMP NULL,
    replied_by INT,

    -- Metadata
    ip_address VARCHAR(45),
    user_agent TEXT,
    language VARCHAR(2) DEFAULT 'ro',
    source_page VARCHAR(255),

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (replied_by) REFERENCES users(id) ON DELETE SET NULL,

    INDEX idx_email (email),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    FULLTEXT idx_message_content (subject, message)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- NOTIFICATIONS TABLE (Email/SMS/WhatsApp Log)
-- =====================================================

CREATE TABLE notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT,
    contact_message_id INT,
    notification_type ENUM('email', 'whatsapp', 'sms') NOT NULL,
    notification_category ENUM('booking_confirmation', 'booking_notification', 'contact_message', 'other') DEFAULT 'other',
    recipient VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    status ENUM('pending', 'sent', 'failed', 'delivered', 'read') DEFAULT 'pending',
    sent_at TIMESTAMP NULL,
    delivered_at TIMESTAMP NULL,
    read_at TIMESTAMP NULL,
    error_message TEXT,
    provider_response JSON,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (contact_message_id) REFERENCES contact_messages(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_booking_id (booking_id),
    INDEX idx_contact_message_id (contact_message_id),
    INDEX idx_notification_type (notification_type),
    INDEX idx_notification_category (notification_category),
    INDEX idx_status (status),
    INDEX idx_sent_at (sent_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- CAR MAINTENANCE LOG
-- =====================================================

CREATE TABLE car_maintenance (
    id INT PRIMARY KEY AUTO_INCREMENT,
    car_id INT NOT NULL,
    maintenance_type ENUM('service', 'repair', 'inspection', 'insurance', 'other') NOT NULL,
    description TEXT NOT NULL,
    cost_eur DECIMAL(8,2),
    mileage INT,
    next_service_date DATE,
    performed_by VARCHAR(100),
    performed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_car_id (car_id),
    INDEX idx_maintenance_type (maintenance_type),
    INDEX idx_next_service_date (next_service_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- AUDIT LOG TABLE
-- =====================================================

CREATE TABLE audit_log (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(50),
    record_id INT,
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_action (action),
    INDEX idx_table_name (table_name),
    INDEX idx_record_id (record_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- VIEWS
-- =====================================================

-- Active bookings view
CREATE VIEW active_bookings AS
SELECT
    b.*,
    c.name as car_name,
    c.category as car_category,
    cl.first_name,
    cl.last_name,
    cl.email,
    cl.phone
FROM bookings b
JOIN cars c ON b.car_id = c.id
LEFT JOIN clients cl ON b.client_id = cl.id
WHERE b.status IN ('confirmed', 'active')
AND b.dropoff_date >= CURDATE();

-- Car availability view
CREATE VIEW car_availability AS
SELECT
    c.*,
    COUNT(b.id) as active_bookings,
    MIN(b.dropoff_date) as next_available_date
FROM cars c
LEFT JOIN bookings b ON c.id = b.car_id
    AND b.status IN ('confirmed', 'active')
    AND b.dropoff_date >= CURDATE()
WHERE c.is_active = TRUE
GROUP BY c.id;

-- Revenue summary view
CREATE VIEW revenue_summary AS
SELECT
    DATE_FORMAT(created_at, '%Y-%m') as month,
    COUNT(*) as total_bookings,
    SUM(total_cost_eur) as total_revenue_eur,
    AVG(total_cost_eur) as avg_booking_value,
    COUNT(CASE WHEN payment_status = 'paid' THEN 1 END) as paid_bookings
FROM bookings
WHERE status != 'cancelled'
GROUP BY DATE_FORMAT(created_at, '%Y-%m')
ORDER BY month DESC;

-- Unread contact messages view
CREATE VIEW unread_contact_messages AS
SELECT
    id,
    name,
    email,
    phone,
    subject,
    LEFT(message, 100) as message_preview,
    created_at
FROM contact_messages
WHERE status = 'new'
ORDER BY created_at DESC;

-- =====================================================
-- INITIAL DATA
-- =====================================================

-- System settings
INSERT INTO system_settings (setting_key, setting_value, setting_type, description) VALUES
('company_name', 'VEIRONAUTO', 'string', 'Company name'),
('company_email', 'contact@veironauto.ro', 'string', 'Primary email'),
('company_phone', '+40 123 456 789', 'string', 'Primary phone'),
('whatsapp_number', '+40 123 456 789', 'string', 'WhatsApp number'),
('timezone', 'Europe/Bucharest', 'string', 'System timezone'),
('language', 'ro', 'string', 'Default language');

-- Currency rate
INSERT INTO currency_rates (from_currency, to_currency, rate, effective_date) VALUES
('EUR', 'RON', 5.0700, CURDATE());

-- Default admin user (password: admin123 - CHANGE THIS!)
INSERT INTO users (username, email, password_hash, full_name, role) VALUES
('admin', 'admin@veironauto.ro', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrator', 'admin');

-- =====================================================
-- DONE!
-- =====================================================

SELECT 'Database initialization complete!' as status;
