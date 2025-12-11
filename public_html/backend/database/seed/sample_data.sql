-- VEIRONAUTO Sample Seed Data
-- This file contains sample data for testing the database setup
-- Run this after the main schema migration

USE veironauto_db;

-- Sample currency rates
INSERT INTO currency_rates (from_currency, to_currency, rate, source, created_at, updated_at) VALUES
('EUR', 'RON', 4.97, 'manual', NOW(), NOW()),
('RON', 'EUR', 0.2012, 'manual', NOW(), NOW());

-- Sample cars
INSERT INTO cars (make, model, year, license_plate, category, seats, doors, transmission, fuel_type, mileage, status, features, created_at, updated_at) VALUES
('Audi', 'A3 TFSI', 2023, 'VN-001-AUD', 'compact', 5, 5, 'automatic', 'petrol', 15000, 'available', 'GPS, Air conditioning, Bluetooth', NOW(), NOW()),
('BMW', 'X3 Hybrid', 2023, 'VN-002-BMW', 'suv', 5, 5, 'automatic', 'hybrid', 12000, 'available', 'Leather seats, Sunroof, Parking sensors', NOW(), NOW()),
('Mercedes', 'GLC', 2023, 'VN-003-MER', 'suv', 5, 5, 'automatic', 'diesel', 18000, 'available', 'Premium sound system, Heated seats', NOW(), NOW()),
('Toyota', 'RAV4', 2023, 'VN-004-Toy', 'suv', 5, 5, 'automatic', 'hybrid', 10000, 'available', 'All-wheel drive, Apple CarPlay', NOW(), NOW()),
('Renault', 'Koleos', 2023, 'VN-005-REN', 'suv', 5, 5, 'automatic', 'petrol', 20000, 'maintenance', 'Panoramic roof, Cruise control', NOW(), NOW());

-- Sample pricing tiers
INSERT INTO car_pricing_tiers (car_id, tier_name, min_days, max_days, price_per_day_eur, price_per_day_ron, created_at, updated_at) VALUES
(1, 'standard', 1, 6, 35.00, 174.00, NOW(), NOW()),
(1, 'weekly', 7, 29, 30.00, 149.00, NOW(), NOW()),
(1, 'monthly', 30, 365, 25.00, 124.00, NOW(), NOW()),
(2, 'standard', 1, 6, 55.00, 273.00, NOW(), NOW()),
(2, 'weekly', 7, 29, 48.00, 238.00, NOW(), NOW()),
(2, 'monthly', 30, 365, 42.00, 209.00, NOW(), NOW()),
(3, 'standard', 1, 6, 65.00, 323.00, NOW(), NOW()),
(3, 'weekly', 7, 29, 58.00, 288.00, NOW(), NOW()),
(3, 'monthly', 30, 365, 52.00, 258.00, NOW(), NOW()),
(4, 'standard', 1, 6, 45.00, 224.00, NOW(), NOW()),
(4, 'weekly', 7, 29, 40.00, 199.00, NOW(), NOW()),
(4, 'monthly', 30, 365, 35.00, 174.00, NOW(), NOW()),
(5, 'standard', 1, 6, 40.00, 199.00, NOW(), NOW()),
(5, 'weekly', 7, 29, 35.00, 174.00, NOW(), NOW()),
(5, 'monthly', 30, 365, 30.00, 149.00, NOW(), NOW());

-- Sample clients
INSERT INTO clients (first_name, last_name, email, phone, date_of_birth, license_number, license_expiry, address, city, country, created_at, updated_at) VALUES
('Ion', 'Popescu', 'ion.popescu@email.com', '+40712345678', '1985-05-15', 'RO123456789', '2028-05-15', 'Strada Victoriei 10', 'Bucharest', 'Romania', NOW(), NOW()),
('Maria', 'Ionescu', 'maria.ionescu@email.com', '+40723456789', '1990-08-22', 'RO234567890', '2029-08-22', 'Calea București 25', 'Bucharest', 'Romania', NOW(), NOW()),
('Andrei', 'Dumitrescu', 'andrei.dumitrescu@email.com', '+40734567890', '1982-12-10', 'RO345678901', '2027-12-10', 'Strada Lipscani 5', 'Bucharest', 'Romania', NOW(), NOW()),
('Elena', 'Stanescu', 'elena.stanescu@email.com', '+40745678901', '1995-03-08', 'RO456789012', '2030-03-08', 'Șoseaua Pavel Dimitrie Kiseleff 15', 'Bucharest', 'Romania', NOW(), NOW()),
('Mihai', 'Georgescu', 'mihai.georgescu@email.com', '+40756789012', '1978-11-30', 'RO567890123', '2026-11-30', 'Calea Victoriei 50', 'Bucharest', 'Romania', NOW(), NOW());

-- Sample booking (past booking)
INSERT INTO bookings (client_id, car_id, start_date, end_date, pickup_location, dropoff_location, total_days, base_price_eur, base_price_ron, discount_percentage, discount_amount_eur, discount_amount_ron, total_price_eur, total_price_ron, currency_used, status, payment_status, payment_method, notes, created_at, updated_at) VALUES
(1, 1, '2024-01-15', '2024-01-20', 'Bucharest Airport', 'Bucharest Airport', 5, 175.00, 869.75, 0.00, 0.00, 0.00, 175.00, 869.75, 'EUR', 'completed', 'paid', 'card', 'Business trip rental', NOW(), NOW());

-- Sample booking services for the above booking
INSERT INTO booking_services (booking_id, service_name, service_type, quantity, unit_price_eur, unit_price_ron, total_price_eur, total_price_ron, created_at, updated_at) VALUES
(1, 'GPS Navigation', 'equipment', 1, 5.00, 24.85, 5.00, 24.85, NOW(), NOW()),
(1, 'Child Seat', 'equipment', 1, 10.00, 49.70, 10.00, 49.70, NOW(), NOW());

-- Sample maintenance record
INSERT INTO car_maintenance (car_id, maintenance_type, description, cost_eur, cost_ron, performed_by, next_service_date, status, notes, created_at, updated_at) VALUES
(5, 'service', 'Regular maintenance service', 150.00, 745.50, 'AutoService SRL', '2024-12-01', 'completed', 'Oil change, filters, brake check', NOW(), NOW());

-- Sample notifications
INSERT INTO notifications (booking_id, notification_type, recipient, subject, message, channel, status, sent_at, created_at, updated_at) VALUES
(1, 'booking_confirmation', 'ion.popescu@email.com', 'Booking Confirmation - VEIRONAUTO', 'Your booking has been confirmed. Car: Audi A3 TFSI, Period: 2024-01-15 to 2024-01-20', 'email', 'sent', NOW(), NOW(), NOW()),
(1, 'pickup_reminder', '+40712345678', 'Pickup Reminder', 'Reminder: Your car rental pickup is tomorrow at Bucharest Airport. Car: Audi A3 TFSI', 'whatsapp', 'sent', NOW(), NOW(), NOW());

-- Sample audit log entries
INSERT INTO audit_log (user_id, action, table_name, record_id, old_values, new_values, ip_address, user_agent, created_at) VALUES
(1, 'INSERT', 'clients', 1, NULL, '{"first_name":"Ion","last_name":"Popescu","email":"ion.popescu@email.com"}', '127.0.0.1', 'Migration Script', NOW()),
(1, 'INSERT', 'bookings', 1, NULL, '{"client_id":1,"car_id":1,"start_date":"2024-01-15","end_date":"2024-01-20"}', '127.0.0.1', 'Migration Script', NOW()),
(1, 'UPDATE', 'cars', 5, '{"status":"available"}', '{"status":"maintenance"}', '127.0.0.1', 'Migration Script', NOW());

COMMIT;

-- Display summary
SELECT 'Sample data inserted successfully!' as status;