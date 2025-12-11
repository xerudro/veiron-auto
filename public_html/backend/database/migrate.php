<?php
/**
 * Database Migration Script for VEIRONAUTO
 * This script initializes the database with the complete schema
 */

require_once __DIR__ . '/config.php';

// Set error reporting for migration
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "VEIRONAUTO Database Migration Script\n";
echo "===================================\n\n";

try {
    // Test connection
    echo "Testing database connection...\n";
    if (!testDBConnection()) {
        throw new Exception("Database connection failed. Please check your configuration.");
    }
    echo "✓ Database connection successful\n\n";

    // Read schema file
    $schemaFile = __DIR__ . '/schema.sql';
    if (!file_exists($schemaFile)) {
        throw new Exception("Schema file not found: " . $schemaFile);
    }

    echo "Reading schema file...\n";
    $schema = file_get_contents($schemaFile);
    if ($schema === false) {
        throw new Exception("Failed to read schema file");
    }
    echo "✓ Schema file loaded (" . strlen($schema) . " characters)\n\n";

    // Split schema into individual statements
    $statements = array_filter(array_map('trim', explode(';', $schema)));

    $pdo = getDBConnection();
    $pdo->beginTransaction();

    echo "Executing schema migration...\n";
    $executedCount = 0;

    foreach ($statements as $statement) {
        if (empty($statement)) continue;

        try {
            $pdo->exec($statement);
            $executedCount++;
        } catch (PDOException $e) {
            // Check if it's a duplicate key error (table already exists)
            if (strpos($e->getMessage(), 'already exists') !== false ||
                strpos($e->getMessage(), 'Duplicate entry') !== false) {
                echo "⚠ Warning: " . substr($statement, 0, 50) . "... already exists, skipping\n";
                continue;
            }

            throw new Exception("SQL Error in statement: " . substr($statement, 0, 100) . "...\n" . $e->getMessage());
        }
    }

    $pdo->commit();
    echo "✓ Migration completed successfully\n";
    echo "✓ Executed $executedCount SQL statements\n\n";

    // Verify tables were created
    echo "Verifying table creation...\n";
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

    $createdTables = 0;
    foreach ($tables as $table) {
        $stmt = $pdo->query("SHOW TABLES LIKE '$table'");
        if ($stmt->rowCount() > 0) {
            $createdTables++;
            echo "✓ Table '$table' created\n";
        } else {
            echo "✗ Table '$table' missing\n";
        }
    }

    echo "\n✓ Verification complete: $createdTables/" . count($tables) . " tables created\n\n";

    // Insert default data if tables are empty
    echo "Checking for default data...\n";

    // Check if admin user exists
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM users");
    $userCount = $stmt->fetch()['count'];

    if ($userCount == 0) {
        echo "Inserting default admin user...\n";
        $adminPassword = password_hash('admin123', PASSWORD_DEFAULT);
        $pdo->exec("INSERT INTO users (username, email, password_hash, role, status, created_at, updated_at)
                   VALUES ('admin', 'admin@veironauto.ro', '$adminPassword', 'admin', 'active', NOW(), NOW())");
        echo "✓ Default admin user created (username: admin, password: admin123)\n";
        echo "⚠ IMPORTANT: Change the default password immediately after first login!\n";
    } else {
        echo "✓ Users table already has data\n";
    }

    // Check if system settings exist
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM system_settings");
    $settingsCount = $stmt->fetch()['count'];

    if ($settingsCount == 0) {
        echo "Inserting default system settings...\n";
        $pdo->exec("INSERT INTO system_settings (setting_key, setting_value, setting_type, description, created_at, updated_at) VALUES
                   ('site_name', 'VEIRONAUTO', 'string', 'Site name', NOW(), NOW()),
                   ('site_email', 'contact@veironauto.ro', 'string', 'Contact email', NOW(), NOW()),
                   ('currency_primary', 'EUR', 'string', 'Primary currency', NOW(), NOW()),
                   ('currency_secondary', 'RON', 'string', 'Secondary currency', NOW(), NOW()),
                   ('whatsapp_enabled', '1', 'boolean', 'Enable WhatsApp notifications', NOW(), NOW()),
                   ('email_notifications', '1', 'boolean', 'Enable email notifications', NOW(), NOW())");
        echo "✓ Default system settings inserted\n";
    } else {
        echo "✓ System settings already exist\n";
    }

    echo "\n🎉 Database migration completed successfully!\n";
    echo "Next steps:\n";
    echo "1. Update database/config.php with your actual database credentials\n";
    echo "2. Change the default admin password\n";
    echo "3. Proceed to Phase 2: Backend API Development\n";

} catch (Exception $e) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }

    echo "\n❌ Migration failed: " . $e->getMessage() . "\n";
    echo "Please check your database configuration and try again.\n";
    exit(1);
}
?>