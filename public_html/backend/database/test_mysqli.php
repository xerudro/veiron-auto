<?php
/**
 * Simple MySQLi Database Connection Test
 * Alternative test using mysqli instead of PDO
 */

// Database connection settings
$host = '95.217.111.248';
$dbname = 'veironau1_newsite';
$user = 'veironau1_admin';
$pass = 'Veironauto2025!';

echo "VEIRONAUTO MySQLi Database Connection Test\n";
echo "==========================================\n\n";

echo "Testing database connection...\n";

try {
    // Create connection
    $conn = new mysqli($host, $user, $pass, $dbname);

    // Check connection
    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }

    echo "✓ MySQLi connection established\n";

    // Test query execution
    echo "Testing query execution...\n";
    $result = $conn->query("SELECT VERSION() as version");
    if ($result) {
        $row = $result->fetch_assoc();
        echo "✓ Database version: " . $row['version'] . "\n";
        $result->free();
    } else {
        throw new Exception("Query failed: " . $conn->error);
    }

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
        $result = $conn->query("SHOW TABLES LIKE '$table'");
        if ($result && $result->num_rows > 0) {
            $existingTables++;
            echo "✓ Table '$table' exists\n";
        } else {
            echo "✗ Table '$table' missing\n";
        }
        if ($result) $result->free();
    }

    echo "\n✓ Tables check: $existingTables/" . count($tables) . " tables found\n";

    // Test data operations
    echo "Testing data operations...\n";

    // Insert test record
    $testKey = 'test_' . uniqid();
    $stmt = $conn->prepare("INSERT INTO system_settings (setting_key, setting_value, setting_type, description, created_at, updated_at)
                          VALUES (?, ?, ?, ?, NOW(), NOW())");
    $stmt->bind_param("ssss", $testKey, $testValue, $testType, $testDesc);
    $testValue = 'test_value';
    $testType = 'string';
    $testDesc = 'Connection test';

    if ($stmt->execute()) {
        echo "✓ Insert operation successful\n";
        $stmt->close();

        // Read test record
        $stmt = $conn->prepare("SELECT setting_value FROM system_settings WHERE setting_key = ?");
        $stmt->bind_param("s", $testKey);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($result && $result->num_rows > 0) {
            echo "✓ Read operation successful\n";
        }
        $stmt->close();

        // Delete test record
        $stmt = $conn->prepare("DELETE FROM system_settings WHERE setting_key = ?");
        $stmt->bind_param("s", $testKey);
        $stmt->execute();
        echo "✓ Delete operation successful\n";
        $stmt->close();

    } else {
        echo "✗ Insert operation failed: " . $conn->error . "\n";
    }

    $conn->close();

    echo "\n🎉 All MySQLi database tests passed!\n";
    echo "Database is ready for the application.\n";

} catch (Exception $e) {
    echo "\n❌ Database test failed: " . $e->getMessage() . "\n";
    echo "Please check your database configuration and try again.\n";
    exit(1);
}
?>