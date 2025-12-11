<?php
/**
 * Database Connection Test Script
 * Quick verification that database setup is working
 */

require_once __DIR__ . '/config.php';

echo "VEIRONAUTO Database Connection Test\n";
echo "===================================\n\n";

try {
    // Test basic connection
    echo "Testing database connection...\n";
    $pdo = getDBConnection();
    echo "✓ Connection established\n";

    // Test query execution
    echo "Testing query execution...\n";
    $stmt = $pdo->query("SELECT VERSION() as version");
    $result = $stmt->fetch();
    echo "✓ Database version: " . $result['version'] . "\n";

    // Check if our tables exist
    echo "Checking VEIRONAUTO tables...\n";
    $tables = [
        'system_settings',
        'users',
        'currency_rates',
        'cars',
        'car_pricing_tiers',
        'clients',
        'bookings',
        'booking_services',
        'notifications',
        'car_maintenance',
        'audit_log'
    ];

    $existingTables = 0;
    foreach ($tables as $table) {
        $stmt = $pdo->query("SHOW TABLES LIKE '$table'");
        if ($stmt->rowCount() > 0) {
            $existingTables++;
            echo "✓ Table '$table' exists\n";
        } else {
            echo "✗ Table '$table' missing\n";
        }
    }

    echo "\n✓ Tables check: $existingTables/" . count($tables) . " tables found\n";

    // Test data insertion (temporary test record)
    echo "Testing data operations...\n";
    $testId = uniqid('test_');

    // Insert test record
    $stmt = $pdo->prepare("INSERT INTO system_settings (setting_key, setting_value, setting_type, description, created_at, updated_at)
                          VALUES (?, ?, ?, ?, NOW(), NOW())");
    $stmt->execute([$testId, 'test_value', 'string', 'Connection test']);
    echo "✓ Insert operation successful\n";

    // Read test record
    $stmt = $pdo->prepare("SELECT setting_value FROM system_settings WHERE setting_key = ?");
    $stmt->execute([$testId]);
    $result = $stmt->fetch();
    if ($result && $result['setting_value'] === 'test_value') {
        echo "✓ Read operation successful\n";
    }

    // Delete test record
    $stmt = $pdo->prepare("DELETE FROM system_settings WHERE setting_key = ?");
    $stmt->execute([$testId]);
    echo "✓ Delete operation successful\n";

    echo "\n🎉 All database tests passed!\n";
    echo "Database is ready for Phase 2 development.\n";

} catch (Exception $e) {
    echo "\n❌ Database test failed: " . $e->getMessage() . "\n";
    echo "Please check your database setup and try again.\n";
    exit(1);
}
?>