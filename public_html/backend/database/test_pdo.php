<?php
/**
 * Simple PDO Database Connection Test
 */

// Database connection settings
$host = '95.217.111.248';
$dbname = 'veironau1_newsite';
$user = 'veironau1_admin';
$pass = 'Veironauto2025!';

echo "VEIRONAUTO PDO Database Connection Test\n";
echo "=======================================\n\n";

echo "Testing database connection...\n";

try {
    $dsn = "mysql:host=$host;dbname=$dbname;charset=utf8mb4";
    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);

    echo "✓ PDO connection established\n";

    // Test query
    $stmt = $pdo->query("SELECT VERSION() as version");
    $result = $stmt->fetch();
    echo "✓ Database version: " . $result['version'] . "\n";

    echo "\n🎉 PDO connection test successful!\n";

} catch (PDOException $e) {
    echo "\n❌ PDO connection failed: " . $e->getMessage() . "\n";
    exit(1);
}
?>