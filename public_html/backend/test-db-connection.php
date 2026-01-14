<?php
/**
 * Database Connection Test Script
 * Use this to verify database credentials are correct
 *
 * IMPORTANT: Delete this file after testing for security!
 */

header('Content-Type: application/json');

// Load configuration from .env file
$envFile = __DIR__ . '/.env';
$config = [
    'host' => 'localhost',
    'database' => 'veironau1_newsite',
    'username' => 'root',
    'password' => '',
    'charset' => 'utf8mb4'
];

echo "=== Veiron Auto Database Connection Test ===\n\n";

// Check if .env file exists
echo "1. Checking .env file...\n";
if (file_exists($envFile)) {
    echo "   ✓ .env file found at: $envFile\n";

    // Read .env file
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0 || strpos($line, '=') === false) {
            continue;
        }

        list($key, $value) = explode('=', $line, 2);
        $key = trim($key);
        $value = trim($value, '"\'');

        switch ($key) {
            case 'DB_HOST':
                $config['host'] = $value;
                break;
            case 'DB_NAME':
                $config['database'] = $value;
                break;
            case 'DB_USER':
                $config['username'] = $value;
                break;
            case 'DB_PASS':
                $config['password'] = $value;
                break;
            case 'DB_CHARSET':
                $config['charset'] = $value;
                break;
        }
    }
    echo "   ✓ Configuration loaded from .env\n";
} else {
    echo "   ✗ .env file NOT FOUND!\n";
    echo "   Expected location: $envFile\n";
    echo "   Using default values...\n";
}

echo "\n2. Configuration:\n";
echo "   Host: " . $config['host'] . "\n";
echo "   Database: " . $config['database'] . "\n";
echo "   Username: " . $config['username'] . "\n";
echo "   Password: " . (empty($config['password']) ? '(empty)' : str_repeat('*', strlen($config['password']))) . "\n";
echo "   Charset: " . $config['charset'] . "\n";

echo "\n3. Testing connection...\n";

try {
    $dsn = "mysql:host={$config['host']};dbname={$config['database']};charset={$config['charset']}";
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ];

    $pdo = new PDO($dsn, $config['username'], $config['password'], $options);

    echo "   ✓ Connection successful!\n";

    // Test query
    echo "\n4. Testing database access...\n";
    $stmt = $pdo->query("SELECT DATABASE() as db, NOW() as time");
    $result = $stmt->fetch();

    echo "   ✓ Database: " . $result['db'] . "\n";
    echo "   ✓ Server time: " . $result['time'] . "\n";

    // Check if tables exist
    echo "\n5. Checking tables...\n";
    $tables = $pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);

    if (count($tables) > 0) {
        echo "   ✓ Found " . count($tables) . " tables:\n";
        foreach ($tables as $table) {
            echo "     - $table\n";
        }
    } else {
        echo "   ⚠ No tables found in database\n";
    }

    echo "\n=== TEST PASSED ===\n";
    echo "✓ Database connection is working correctly!\n";
    echo "\nIMPORTANT: Delete this file (test-db-connection.php) for security!\n";

} catch (PDOException $e) {
    echo "   ✗ Connection FAILED!\n";
    echo "\n=== ERROR DETAILS ===\n";
    echo "Error: " . $e->getMessage() . "\n";
    echo "Code: " . $e->getCode() . "\n";

    echo "\n=== TROUBLESHOOTING ===\n";

    if (strpos($e->getMessage(), 'Access denied') !== false) {
        echo "✗ Access Denied Error\n";
        echo "  Problem: Username or password is incorrect\n";
        echo "  Solution:\n";
        echo "  1. Check your database credentials in cPanel\n";
        echo "  2. Update backend/.env file with correct credentials\n";
        echo "  3. Make sure user has permissions for this database\n";
    } elseif (strpos($e->getMessage(), 'Unknown database') !== false) {
        echo "✗ Unknown Database Error\n";
        echo "  Problem: Database does not exist\n";
        echo "  Solution:\n";
        echo "  1. Create database in cPanel > MySQL Databases\n";
        echo "  2. Update DB_NAME in backend/.env\n";
    } elseif (strpos($e->getMessage(), "Can't connect") !== false) {
        echo "✗ Connection Error\n";
        echo "  Problem: Cannot connect to MySQL server\n";
        echo "  Solution:\n";
        echo "  1. Check if MySQL is running\n";
        echo "  2. Verify DB_HOST in backend/.env (usually 'localhost')\n";
        echo "  3. Check firewall settings\n";
    } else {
        echo "✗ Other Error\n";
        echo "  Contact your hosting provider for assistance\n";
    }

    echo "\n=== NEXT STEPS ===\n";
    echo "1. Fix the issue above\n";
    echo "2. Refresh this page to test again\n";
    echo "3. Delete this file when connection works\n";
}
?>
