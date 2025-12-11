-- VEIRONAUTO Car Rental Database Schema
-- MariaDB 10.6+ compatible
-- Created: December 10, 2025
-- @format mysql

-- =====================================================
-- DATABASE CREATION
-- =====================================================

CREATE DATABASE IF NOT EXISTS veironau1_newsite
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE veironau1_newsite;

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
);

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
);

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
);

-- =====================================================
-- CARS TABLE (Fleet Inventory)
-- =====================================================

CREATE TABLE cars (
    id INT PRIMARY KEY AUTO_INCREMENT,
    car_id VARCHAR(50) NOT NULL UNIQUE, -- e.g., 'audi-a3-automat'
    name VARCHAR(100) NOT NULL,
    category ENUM('economy', 'compact', 'sedan', 'suv', 'premium', 'multi_passenger') NOT NULL,
    transmission ENUM('manual', 'automatic') NOT NULL,
    fuel_type ENUM('petrol', 'diesel', 'hybrid', 'electric') DEFAULT 'petrol',
    passengers INT NOT NULL DEFAULT 5,
    luggage INT NOT NULL DEFAULT 2,
    image_path VARCHAR(255),
    base_price_eur DECIMAL(8,2) NOT NULL, -- Base daily rate in EUR
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
);

-- =====================================================
-- CAR PRICING TIERS TABLE
-- =====================================================

CREATE TABLE car_pricing_tiers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    car_id INT NOT NULL,
    tier_name VARCHAR(50) NOT NULL, -- e.g., '1-3_days', '4-7_days', '8-14_days'
    min_days INT NOT NULL,
    max_days INT,
    price_per_day_eur DECIMAL(8,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE,
    INDEX idx_car_id (car_id),
    INDEX idx_tier_name (tier_name),
    UNIQUE KEY unique_car_tier (car_id, tier_name)
);

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
);

-- =====================================================
-- BOOKINGS TABLE (Rental Reservations)
-- =====================================================

CREATE TABLE bookings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    booking_number VARCHAR(20) NOT NULL UNIQUE, -- e.g., 'BK20251210001'
    client_id INT,
    car_id INT NOT NULL,
    pickup_location VARCHAR(255) NOT NULL,
    dropoff_location VARCHAR(255) NOT NULL,
    pickup_date DATE NOT NULL,
    pickup_time TIME NOT NULL,
    dropoff_date DATE NOT NULL,
    dropoff_time TIME NOT NULL,
    duration_days INT NOT NULL, -- Calculated field
    status ENUM('pending', 'confirmed', 'active', 'completed', 'cancelled', 'no_show') DEFAULT 'pending',

    -- Pricing
    base_rate_eur DECIMAL(8,2) NOT NULL,
    insurance_type ENUM('none', 'premium', 'full') DEFAULT 'none',
    insurance_cost_eur DECIMAL(8,2) DEFAULT 0,
    additional_services_cost_eur DECIMAL(8,2) DEFAULT 0,
    total_cost_eur DECIMAL(8,2) NOT NULL,
    total_cost_ron DECIMAL(8,2) NOT NULL, -- Calculated at booking time

    -- Payment
    payment_status ENUM('pending', 'paid', 'partial', 'refunded') DEFAULT 'pending',
    payment_method VARCHAR(50),
    payment_date TIMESTAMP NULL,

    -- Booking source
    booking_source ENUM('online', 'phone', 'walk_in', 'admin') DEFAULT 'online',
    booking_reference VARCHAR(100), -- External reference if applicable

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
);

-- =====================================================
-- BOOKING SERVICES TABLE (Additional Services)
-- =====================================================

CREATE TABLE booking_services (
    id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT NOT NULL,
    service_type VARCHAR(50) NOT NULL, -- e.g., 'gps', 'child_seat', 'additional_driver'
    service_name VARCHAR(100) NOT NULL,
    quantity INT DEFAULT 1,
    unit_price_eur DECIMAL(8,2) NOT NULL,
    total_price_eur DECIMAL(8,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    INDEX idx_booking_id (booking_id),
    INDEX idx_service_type (service_type)
);

-- =====================================================
-- NOTIFICATIONS TABLE (Email/WhatsApp Log)
-- =====================================================

CREATE TABLE notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT,
    notification_type ENUM('email', 'whatsapp', 'sms') NOT NULL,
    recipient VARCHAR(255) NOT NULL, -- email or phone number
    subject VARCHAR(255),
    message TEXT NOT NULL,
    status ENUM('pending', 'sent', 'failed', 'delivered', 'read') DEFAULT 'pending',
    sent_at TIMESTAMP NULL,
    delivered_at TIMESTAMP NULL,
    read_at TIMESTAMP NULL,
    error_message TEXT,
    provider_response JSON, -- Store API response from WhatsApp/email provider
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_booking_id (booking_id),
    INDEX idx_notification_type (notification_type),
    INDEX idx_status (status),
    INDEX idx_sent_at (sent_at)
);

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
);

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
);

-- =====================================================
-- TRIGGERS FOR AUDIT LOG
-- =====================================================

DELIMITER //

-- Audit trigger for bookings table
CREATE TRIGGER audit_bookings_trigger AFTER UPDATE ON bookings
FOR EACH ROW
BEGIN
    INSERT INTO audit_log (user_id, action, table_name, record_id, old_values, new_values)
    VALUES (
        @current_user_id,
        CASE
            WHEN OLD.status != NEW.status THEN CONCAT('status_change_', OLD.status, '_to_', NEW.status)
            ELSE 'update'
        END,
        'bookings',
        NEW.id,
        JSON_OBJECT(
            'status', OLD.status,
            'total_cost_eur', OLD.total_cost_eur,
            'payment_status', OLD.payment_status,
            'notes', OLD.notes
        ),
        JSON_OBJECT(
            'status', NEW.status,
            'total_cost_eur', NEW.total_cost_eur,
            'payment_status', NEW.payment_status,
            'notes', NEW.notes
        )
    );
END//

-- Audit trigger for clients table
CREATE TRIGGER audit_clients_trigger AFTER UPDATE ON clients
FOR EACH ROW
BEGIN
    INSERT INTO audit_log (user_id, action, table_name, record_id, old_values, new_values)
    VALUES (
        @current_user_id,
        'update',
        'clients',
        NEW.id,
        JSON_OBJECT(
            'first_name', OLD.first_name,
            'last_name', OLD.last_name,
            'email', OLD.email,
            'phone', OLD.phone
        ),
        JSON_OBJECT(
            'first_name', NEW.first_name,
            'last_name', NEW.last_name,
            'email', NEW.email,
            'phone', NEW.phone
        )
    );
END//

DELIMITER ;


-- =====================================================
-- VIEWS FOR COMMON QUERIES
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

-- =====================================================
-- STORED PROCEDURES
-- =====================================================

DELIMITER //

-- Procedure to create a new booking
CREATE PROCEDURE create_booking(
    IN p_client_id INT,
    IN p_car_id INT,
    IN p_pickup_location VARCHAR(255),
    IN p_dropoff_location VARCHAR(255),
    IN p_pickup_date DATE,
    IN p_pickup_time TIME,
    IN p_dropoff_date DATE,
    IN p_dropoff_time TIME,
    IN p_insurance_type VARCHAR(20),
    IN p_booking_source VARCHAR(20),
    IN p_created_by INT,
    OUT p_booking_id INT,
    OUT p_booking_number VARCHAR(20)
)
BEGIN
    DECLARE v_duration_days INT;
    DECLARE v_base_rate DECIMAL(8,2);
    DECLARE v_insurance_cost DECIMAL(8,2) DEFAULT 0;
    DECLARE v_total_cost DECIMAL(8,2);
    DECLARE v_current_rate DECIMAL(10,4);

    -- Calculate duration
    SET v_duration_days = DATEDIFF(p_dropoff_date, p_pickup_date) + 1;

    -- Get base rate for the car
    SELECT base_price_eur INTO v_base_rate FROM cars WHERE id = p_car_id;

    -- Get insurance cost
    IF p_insurance_type = 'premium' THEN
        SELECT insurance_premium_eur INTO v_insurance_cost FROM cars WHERE id = p_car_id;
    ELSEIF p_insurance_type = 'full' THEN
        SELECT insurance_full_eur INTO v_insurance_cost FROM cars WHERE id = p_car_id;
    END IF;

    -- Get current EUR to RON rate
    SELECT rate INTO v_current_rate FROM currency_rates
    WHERE from_currency = 'EUR' AND to_currency = 'RON' AND is_active = TRUE
    ORDER BY effective_date DESC LIMIT 1;

    -- Calculate total cost
    SET v_total_cost = (v_base_rate * v_duration_days) + v_insurance_cost;

    -- Generate booking number
    SET p_booking_number = CONCAT('BK', DATE_FORMAT(NOW(), '%Y%m%d'),
                                 LPAD((SELECT COUNT(*) + 1 FROM bookings
                                      WHERE DATE(created_at) = CURDATE()), 3, '0'));

    -- Insert booking
    INSERT INTO bookings (
        booking_number, client_id, car_id, pickup_location, dropoff_location,
        pickup_date, pickup_time, dropoff_date, dropoff_time, duration_days,
        base_rate_eur, insurance_type, insurance_cost_eur, total_cost_eur,
        total_cost_ron, booking_source, created_by
    ) VALUES (
        p_booking_number, p_client_id, p_car_id, p_pickup_location, p_dropoff_location,
        p_pickup_date, p_pickup_time, p_dropoff_date, p_dropoff_time, v_duration_days,
        v_base_rate, p_insurance_type, v_insurance_cost, v_total_cost,
        (v_total_cost * v_current_rate), p_booking_source, p_created_by
    );

    SET p_booking_id = LAST_INSERT_ID();
END//

-- Procedure to update currency rate
CREATE PROCEDURE update_currency_rate(
    IN p_rate DECIMAL(10,4),
    IN p_created_by INT
)
BEGIN
    -- Deactivate current active rate
    UPDATE currency_rates
    SET is_active = FALSE
    WHERE from_currency = 'EUR' AND to_currency = 'RON' AND is_active = TRUE;

    -- Insert new rate
    INSERT INTO currency_rates (from_currency, to_currency, rate, effective_date, created_by)
    VALUES ('EUR', 'RON', p_rate, CURDATE(), p_created_by);
END//

DELIMITER ;


-- =====================================================
-- INITIAL DATA INSERTS
-- =====================================================

-- Insert default system settings
INSERT INTO system_settings (setting_key, setting_value, setting_type, description) VALUES
('company_name', 'VEIRONAUTO', 'string', 'Company name displayed in emails and notifications'),
('company_email', 'contact@veironauto.ro', 'string', 'Primary company email for notifications'),
('company_phone', '+40 123 456 789', 'string', 'Primary company phone number'),
('whatsapp_number', '+40 123 456 789', 'string', 'WhatsApp business number'),
('currency_rate_auto_update', 'true', 'boolean', 'Automatically update EUR/RON rate daily'),
('booking_confirmation_email', 'true', 'boolean', 'Send email confirmation for new bookings'),
('booking_whatsapp_notification', 'true', 'boolean', 'Send WhatsApp notification for new bookings'),
('admin_email_notifications', 'true', 'boolean', 'Send email notifications to admins for new bookings'),
('timezone', 'Europe/Bucharest', 'string', 'System timezone'),
('date_format', 'd.m.Y', 'string', 'Date format for display'),
('language', 'ro', 'string', 'Default system language');

-- Insert default currency rate (EUR to RON)
INSERT INTO currency_rates (from_currency, to_currency, rate, effective_date) VALUES
('EUR', 'RON', 5.0700, CURDATE());

-- Insert default admin user (password: admin123 - CHANGE THIS!)
INSERT INTO users (username, email, password_hash, full_name, role) VALUES
('admin', 'admin@veironauto.ro', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrator', 'admin');

-- =====================================================
-- PERMISSIONS AND GRANTS
-- =====================================================

-- Note: These grants should be executed by the database administrator
-- GRANT ALL PRIVILEGES ON veironau1_newsite.* TO 'veironau1_admin'@'localhost' IDENTIFIED BY 'secure_password_here';
-- FLUSH PRIVILEGES;