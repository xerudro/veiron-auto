-- Sync cars table with frontend JavaScript data
-- Run this script to fix the booking API car validation error
-- Usage: mysql -u root -p veironau1_to < sync_cars_with_frontend.sql
--
-- This script syncs the cars table with the frontend JavaScript data.
-- All 42 cars from booking-en.js are included with matching IDs and names.

USE veironau1_to;

-- First, clear existing sample cars that don't match frontend
-- (Be careful - this removes existing cars!)
-- TRUNCATE TABLE cars;

-- Insert/Update all cars from frontend booking-en.js
-- Using INSERT ... ON DUPLICATE KEY UPDATE to avoid conflicts

-- Disable foreign key checks temporarily
SET FOREIGN_KEY_CHECKS = 0;

-- Clear existing cars to avoid conflicts with hardcoded IDs
DELETE FROM cars;

-- Reset auto-increment
ALTER TABLE cars AUTO_INCREMENT = 1;

-- Insert all frontend cars with explicit IDs
INSERT INTO cars (id, car_id, name, category, transmission, fuel_type, passengers, luggage, image_path, base_price_eur, warranty_amount_eur, is_active, sort_order) VALUES
(1, 'audi-q3', 'Audi Q3', 'suv', 'automatic', 'petrol', 5, 4, 'assets/images/cars/audi-q3/audi-q3-2011-veiron-auto-rent.png', 70.00, 1500.00, TRUE, 1),
(2, 'mazda-6', 'Mazda 6', 'sedan', 'manual', 'petrol', 5, 3, 'assets/images/cars/mazda-6-hatchback/mazda-6-rent-a-car.png', 40.00, 1000.00, TRUE, 2),
(3, 'audi-a6', 'Audi A6', 'premium', 'automatic', 'diesel', 5, 3, 'assets/images/cars/audi-a6/audi-a6-veiron-auto-satu-mare.png', 60.00, 2000.00, TRUE, 3),
(5, 'mercedes-e-class', 'Mercedes E-Class (2013)', 'premium', 'automatic', 'diesel', 5, 3, 'assets/images/cars/mercedes-e-class/mercedes-e-class-luxury-satu-mare.png', 50.00, 2000.00, TRUE, 5),
(6, 'renault-koleos', 'Renault Koleos', 'suv', 'automatic', 'diesel', 5, 4, 'assets/images/cars/renault-koleos/renault-koleos-satu-mare-ieftin.png', 70.00, 1500.00, TRUE, 6),
(7, 'toyota-rav4', 'Toyota RAV4', 'suv', 'automatic', 'hybrid', 5, 4, 'assets/images/cars/toyota-rav4/toyota-rav4-suv-rent-a-car.png', 80.00, 1500.00, TRUE, 7),
(8, 'renault-traffic-8plus1', 'Renault Traffic 8+1', 'multi_passenger', 'automatic', 'diesel', 9, 6, 'assets/images/cars/renault-traffic-8plus1/renault-trafic-pasageri-pret-avantajos.png', 80.00, 2000.00, TRUE, 8),
(10, 'skoda-scala', 'Skoda Scala', 'compact', 'automatic', 'petrol', 5, 3, 'assets/images/cars/skoda-scala/skoda-scala-automatic-satu-mare.png', 45.00, 1000.00, TRUE, 10),
(11, 'mercedes-glc', 'Mercedes GLC Line Plus', 'suv', 'automatic', 'diesel', 5, 4, 'assets/images/cars/mercedes-glc/mercedes-glc-luxury-suv-veiron-auto.png', 110.00, 1500.00, TRUE, 11),
(12, 'mitsubishi-outlander', 'Mitsubishi Outlander', 'suv', 'automatic', 'diesel', 5, 4, 'assets/images/cars/mitsubishi-outlander/mitsubishi_outlander_suv_rent_a_car_satu_mare.png', 68.00, 1500.00, TRUE, 12),
(13, 'skoda-kamiq', 'Skoda Kamiq', 'suv', 'automatic', 'petrol', 5, 3, 'assets/images/cars/skoda-kamiq/skoda_kamiq_suv_4x4_satu_mare.png', 60.00, 1250.00, TRUE, 13),
(15, 'seat-alhambra-automatic', 'Seat Alhambra Automatic', 'multi_passenger', 'automatic', 'diesel', 7, 5, 'assets/images/cars/seat-alhambra/seat_alhambra_7_locuri_inchiriere.png', 55.00, 1000.00, TRUE, 15),
(16, 'seat-alhambra-manual', 'Seat Alhambra Manual', 'multi_passenger', 'manual', 'diesel', 7, 5, 'assets/images/cars/seat-alhambra/seat_alhambra_7_locuri_inchiriere.png', 50.00, 1000.00, TRUE, 16),
(17, 'seat-exeo', 'Seat Exeo', 'sedan', 'manual', 'diesel', 5, 3, 'assets/images/cars/seat-exeo/seat_exeo_manual_inchiriere_auto.png', 37.00, 750.00, TRUE, 17),
(18, 'seat-exeo-combi', 'Seat Exeo Combi', 'sedan', 'manual', 'diesel', 5, 4, 'assets/images/cars/seat-exeo-combi/seat_exeo_combi_masina_ieftina_veiron_auto.png', 37.00, 750.00, TRUE, 18),
(19, 'audi-a3', 'Audi A3', 'compact', 'automatic', 'petrol', 5, 3, 'assets/images/cars/audi-a3-tfsi/audi-a3-inchirieri-auto-satu-mare.png', 40.00, 1000.00, TRUE, 19),
(20, 'audi-a4', 'Audi A4', 'sedan', 'manual', 'diesel', 5, 3, 'assets/images/cars/audi-a4/audi-a4-inchrieri-auto-satu-mare.png', 50.00, 1000.00, TRUE, 20),
(21, 'audi-q5', 'Audi Q5', 'suv', 'automatic', 'diesel', 5, 4, 'assets/images/cars/audi-q5/audi-q5-luxury-automata.png', 100.00, 2000.00, TRUE, 21),
(22, 'bmw-x1', 'BMW X1', 'suv', 'automatic', 'diesel', 5, 4, 'assets/images/cars/bmw-x1-2025/bmw-x1-suv-satu-mare-veiron.png', 90.00, 1500.00, TRUE, 22),
(24, 'bmw-5-series-sedan', 'BMW 5 Series Sedan', 'premium', 'automatic', 'diesel', 5, 3, 'assets/images/cars/bmw-seria5-sedan/bmw-seria5-sedan-luxury.png', 80.00, 2000.00, TRUE, 24),
(25, 'bmw-5-series-touring-automatic', 'BMW 5 Series Touring Automatic', 'premium', 'automatic', 'diesel', 5, 4, 'assets/images/cars/bmw-seria5-touring/bmw-seria5-touring-satu-mare.png', 60.00, 1500.00, TRUE, 25),
(26, 'bmw-5-series-touring-manual', 'BMW 5 Series Touring Manual', 'premium', 'manual', 'diesel', 5, 4, 'assets/images/cars/bmw-seria5-touring/bmw-seria5-touring-satu-mare.png', 50.00, 1250.00, TRUE, 26),
(27, 'honda-accord', 'Honda Accord', 'sedan', 'automatic', 'petrol', 5, 3, 'assets/images/cars/honda-accord-automat/honda-accord-automat-veiron-auto.png', 40.00, 750.00, TRUE, 27),
(28, 'mercedes-gle', 'Mercedes GLE (2017)', 'suv', 'automatic', 'diesel', 5, 4, 'assets/images/cars/mercedes-gle/mercedes-gle-suv-satu-mare.png', 90.00, 2000.00, TRUE, 28),
(29, 'ssangyong-actyon', 'SSANGYONG KGM ACTYON', 'suv', 'automatic', 'petrol', 5, 4, 'assets/images/cars/ssangyong-actyon/kgm-actyon-benzina-gold-auriu-inchiriere-satu-mare.png', 80.00, 300.00, TRUE, 29),
(30, 'ssangyong-korando', 'SSANGYONG KGM KORANDO', 'suv', 'automatic', 'petrol', 5, 3, 'assets/images/cars/ssangyong-korando/ssangyong-kgm-korando-daune-auto-satu-mare.png', 60.00, 300.00, TRUE, 30),
(31, 'toyota-avensis-combi', 'TOYOTA AVENSIS COMBI', 'sedan', 'automatic', 'petrol', 5, 3, 'assets/images/cars/toyota-avensis-combi/toyota-avensis-combi-solutionare-daune-auto-satu-mare.png', 40.00, 300.00, TRUE, 31),
(32, 'vw-passat-cc', 'VW Passat CC Automat', 'sedan', 'automatic', 'petrol', 5, 4, 'assets/images/cars/vw-passat-cc-r-line/inchiriere-vw-pasat-cc-scaune-incalzite-satu-mare.png', 50.00, 300.00, TRUE, 32),
(33, 'vw-touareg', 'VW Touareg Automatic', 'suv', 'automatic', 'petrol', 5, 5, 'assets/images/cars/vw-touareg/vw-touareg-4x4-veiron-auto-satu-mare.png', 70.00, 400.00, TRUE, 33),
(34, 'vw-touran', 'VW Touran - 7 seats', 'multi_passenger', 'automatic', 'petrol', 7, 5, 'assets/images/cars/vw-touran/veiron-rent-vw-touran-inchirieri-auto.png', 50.00, 1000.00, TRUE, 34),
(35, 'skoda-kodiaq-5', 'Skoda Kodiaq - 5 Seats', 'suv', 'automatic', 'diesel', 5, 5, 'assets/images/cars/skoda-kodiaq/skoda-kodiak-7-locuri-rent-a-car-airport-satu-mare-veiron.png', 75.00, 300.00, TRUE, 35),
(36, 'skoda-kodiaq-7', 'Skoda Kodiaq - 7 Seats', 'suv', 'automatic', 'diesel', 7, 3, 'assets/images/cars/skoda-kodiaq/skoda-kodiak-7-locuri-rent-a-car-airport-satu-mare-veiron.png', 80.00, 300.00, TRUE, 36),
(37, 'skoda-octavia-combi', 'Skoda Octavia Combi Automatic', 'compact', 'automatic', 'petrol', 5, 4, 'assets/images/cars/skoda-octavia-combi/inchirieri-skoda-octavia-combi-pret-avantajos.png', 36.00, 250.00, TRUE, 37),
(38, 'skoda-octavia-sedan', 'Skoda Octavia Sedan Automatic', 'sedan', 'automatic', 'petrol', 5, 3, 'assets/images/cars/skoda-octavia-sedan/skoda-octavia-sedan-rent-a-car-cluj-napoca-veiron.png', 40.00, 200.00, TRUE, 38),
(39, 'skoda-superb', 'Skoda Superb Automatic', 'sedan', 'automatic', 'diesel', 5, 4, 'assets/images/cars/skoda-superb/skoda-suberb-inchirieri-satu-mare-ieftin.png', 60.00, 250.00, TRUE, 39),
(40, 'volvo-xc40', 'Volvo XC40 Automatic', 'suv', 'automatic', 'petrol', 5, 4, 'assets/images/cars/volvo-xc40/volvo-xc40-automat-inchirieri-aeroport-budapesta-satumare.png', 70.00, 300.00, TRUE, 40),
(41, 'vw-caravelle', 'VW Caravelle (8+1 Seats)', 'multi_passenger', 'automatic', 'diesel', 9, 6, 'assets/images/cars/vw-caravelle/vw-caravelle-van-inchirieri-family-satu-mare.png', 95.00, 400.00, TRUE, 41),
(42, 'vw-golf-manual', 'VW Golf Manual', 'compact', 'manual', 'diesel', 5, 3, 'assets/images/cars/vw-golf-4/inchirieri-auto-ieftine-satu-mare-vw-golf-4.png', 38.00, 150.00, TRUE, 42),
(43, 'vw-passat-combi', 'VW Passat Combi Automatic', 'compact', 'automatic', 'diesel', 5, 4, 'assets/images/cars/vw-passat-combi/vw-passat-combi-2012-inchirieri-auto-ieftine.png', 40.00, 200.00, TRUE, 43),
(44, 'vw-polo-automatic', 'VW Polo Automatic', 'compact', 'automatic', 'petrol', 5, 2, 'assets/images/cars/vw-polo/vw-polo-inchirieri-ieftine-masini-satu-mare.png', 40.00, 150.00, TRUE, 44),
(45, 'vw-polo-manual', 'VW Polo Manual', 'compact', 'manual', 'petrol', 5, 2, 'assets/images/cars/vw-polo/vw-polo-inchirieri-ieftine-masini-satu-mare.png', 40.00, 150.00, TRUE, 45),
(46, 'vw-tiguan', 'VW Tiguan Automatic', 'suv', 'automatic', 'diesel', 5, 4, 'assets/images/cars/vw-tiguan/vw-tiguan-veiron-auto-satu-mare.png', 50.00, 200.00, TRUE, 46);

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- Verify the insert
SELECT COUNT(*) AS total_cars FROM cars;
SELECT id, name, category FROM cars ORDER BY id;

-- Success message
SELECT 'Cars synchronized successfully with frontend data!' AS status;
