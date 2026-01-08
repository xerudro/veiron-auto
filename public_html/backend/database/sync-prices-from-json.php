<?php
/**
 * Sync Prices from JSON to Database
 * This script updates car prices in the database from the JSON pricing file
 */

require_once __DIR__ . '/config.php';

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "VEIRONAUTO Price Synchronization Script\n";
echo "========================================\n\n";

try {
    // Load JSON pricing data
    $jsonFile = __DIR__ . '/../../frontend/assets/json/car-pricing-data.json';

    if (!file_exists($jsonFile)) {
        throw new Exception("JSON pricing file not found: $jsonFile");
    }

    echo "Loading pricing data from JSON...\n";
    $jsonData = json_decode(file_get_contents($jsonFile), true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception("Failed to parse JSON: " . json_last_error_msg());
    }

    if (!isset($jsonData['cars']) || !is_array($jsonData['cars'])) {
        throw new Exception("Invalid JSON structure: 'cars' array not found");
    }

    echo "✓ Loaded " . count($jsonData['cars']) . " cars from JSON\n\n";

    // Connect to database
    $pdo = getDBConnection();
    $pdo->beginTransaction();

    echo "Starting database synchronization...\n\n";

    $updated = 0;
    $created = 0;
    $skipped = 0;
    $errors = 0;

    foreach ($jsonData['cars'] as $carData) {
        try {
            $carId = $carData['id'];
            $name = $carData['name'];

            echo "Processing: $name ($carId)...\n";

            // Check if car exists in database
            $stmt = $pdo->prepare("SELECT id FROM cars WHERE car_id = ?");
            $stmt->execute([$carId]);
            $existingCar = $stmt->fetch(PDO::FETCH_ASSOC);

            // Determine base price (tier1)
            $basePrice = isset($carData['pricing']['tier1']) ? $carData['pricing']['tier1'] : 0;
            $deposit = isset($carData['deposit']) ? $carData['deposit'] : 0;

            // Get insurance prices
            $insurancePremium = isset($carData['insurance']['premium']['dailyRate']) ? $carData['insurance']['premium']['dailyRate'] : 0;
            $insuranceFull = isset($carData['insurance']['comprehensive']['dailyRate']) ? $carData['insurance']['comprehensive']['dailyRate'] : 0;

            // Get transmission
            $transmission = isset($carData['transmission']) ? $carData['transmission'] : 'automatic';
            if ($transmission === 'automat') $transmission = 'automatic';
            if ($transmission === 'manual') $transmission = 'manual';

            // Get seats
            $seats = isset($carData['seats']) ? $carData['seats'] : 5;

            // Get year
            $year = isset($carData['year']) ? $carData['year'] : null;

            if ($existingCar) {
                // Update existing car
                $updateStmt = $pdo->prepare("
                    UPDATE cars
                    SET name = ?,
                        transmission = ?,
                        passengers = ?,
                        base_price_eur = ?,
                        insurance_premium_eur = ?,
                        insurance_full_eur = ?,
                        warranty_amount_eur = ?,
                        updated_at = NOW()
                    WHERE car_id = ?
                ");

                $updateStmt->execute([
                    $name,
                    $transmission,
                    $seats,
                    $basePrice,
                    $insurancePremium,
                    $insuranceFull,
                    $deposit,
                    $carId
                ]);

                $dbCarId = $existingCar['id'];
                echo "  ✓ Updated car record\n";
                $updated++;
            } else {
                // Create new car
                $insertStmt = $pdo->prepare("
                    INSERT INTO cars (
                        car_id, name, category, transmission, passengers,
                        base_price_eur, insurance_premium_eur, insurance_full_eur,
                        warranty_amount_eur, is_active, created_at, updated_at
                    ) VALUES (?, ?, 'economy', ?, ?, ?, ?, ?, ?, 1, NOW(), NOW())
                ");

                $insertStmt->execute([
                    $carId,
                    $name,
                    $transmission,
                    $seats,
                    $basePrice,
                    $insurancePremium,
                    $insuranceFull,
                    $deposit
                ]);

                $dbCarId = $pdo->lastInsertId();
                echo "  ✓ Created new car record\n";
                $created++;
            }

            // Update pricing tiers
            if (isset($carData['pricing'])) {
                // Delete existing tiers
                $deleteStmt = $pdo->prepare("DELETE FROM car_pricing_tiers WHERE car_id = ?");
                $deleteStmt->execute([$dbCarId]);

                // Insert new tiers
                $tierMapping = [
                    'tier1' => ['name' => '1-3_days', 'min' => 1, 'max' => 3],
                    'tier2' => ['name' => '4-7_days', 'min' => 4, 'max' => 7],
                    'tier3' => ['name' => '8-14_days', 'min' => 8, 'max' => 14],
                    'tier4' => ['name' => '15-30_days', 'min' => 15, 'max' => 30]
                ];

                $insertTierStmt = $pdo->prepare("
                    INSERT INTO car_pricing_tiers (
                        car_id, tier_name, min_days, max_days, price_per_day_eur,
                        created_at, updated_at
                    ) VALUES (?, ?, ?, ?, ?, NOW(), NOW())
                ");

                foreach ($tierMapping as $tierKey => $tierInfo) {
                    if (isset($carData['pricing'][$tierKey])) {
                        $price = $carData['pricing'][$tierKey];
                        $insertTierStmt->execute([
                            $dbCarId,
                            $tierInfo['name'],
                            $tierInfo['min'],
                            $tierInfo['max'],
                            $price
                        ]);
                    }
                }

                echo "  ✓ Updated pricing tiers\n";
            }

            echo "  ✓ Complete\n\n";

        } catch (Exception $e) {
            echo "  ✗ Error: " . $e->getMessage() . "\n\n";
            $errors++;
        }
    }

    $pdo->commit();

    echo "\n========================================\n";
    echo "Synchronization Complete!\n\n";
    echo "Summary:\n";
    echo "  Created:  $created cars\n";
    echo "  Updated:  $updated cars\n";
    echo "  Errors:   $errors\n";
    echo "  Total:    " . count($jsonData['cars']) . " cars processed\n\n";

    if ($errors > 0) {
        echo "⚠ Some errors occurred. Please review the output above.\n";
    } else {
        echo "✓ All prices synchronized successfully!\n";
    }

} catch (Exception $e) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }

    echo "\n❌ Synchronization failed: " . $e->getMessage() . "\n";
    exit(1);
}
?>
