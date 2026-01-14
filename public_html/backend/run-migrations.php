<?php
/**
 * Database Migration Runner
 * Runs all pending migrations in order
 *
 * IMPORTANT: This should only be run on the production server via browser
 * Access: https://veironauto.com/backend/run-migrations.php
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: text/html; charset=utf-8');

echo "<!DOCTYPE html>\n<html><head><meta charset='utf-8'><title>Database Migrations</title>";
echo "<style>
body { font-family: 'Courier New', monospace; padding: 20px; background: #1e1e1e; color: #d4d4d4; }
.success { color: #4ec9b0; }
.error { color: #f48771; }
.warning { color: #dcdcaa; }
.info { color: #569cd6; }
h1 { color: #4ec9b0; }
pre { background: #2d2d30; padding: 10px; border-left: 3px solid #4ec9b0; overflow-x: auto; }
</style></head><body>";

echo "<h1>🚀 Veiron Auto Database Migrations</h1>\n";
echo "<pre>\n";

try {
    // Load database configuration from .env
    $envFile = __DIR__ . '/.env';

    if (!file_exists($envFile)) {
        throw new Exception(".env file not found at: $envFile");
    }

    echo "<span class='info'>✓ Loading configuration from .env...</span>\n";

    $config = [];
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0 || strpos($line, '=') === false) {
            continue;
        }

        list($key, $value) = explode('=', $line, 2);
        $key = trim($key);
        $value = trim($value, '"\'');

        if ($key === 'DB_HOST') $config['host'] = $value;
        if ($key === 'DB_NAME') $config['database'] = $value;
        if ($key === 'DB_USER') $config['username'] = $value;
        if ($key === 'DB_PASS') $config['password'] = $value;
        if ($key === 'DB_CHARSET') $config['charset'] = $value;
    }

    echo "<span class='info'>✓ Configuration loaded</span>\n";
    echo "   Host: {$config['host']}\n";
    echo "   Database: {$config['database']}\n";
    echo "   Username: {$config['username']}\n\n";

    // Connect to database
    echo "<span class='info'>→ Connecting to database...</span>\n";

    $dsn = "mysql:host={$config['host']};charset={$config['charset']}";
    $pdo = new PDO($dsn, $config['username'], $config['password'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);

    echo "<span class='success'>✓ Connected successfully!</span>\n\n";

    // Create database if it doesn't exist
    echo "<span class='info'>→ Ensuring database exists...</span>\n";
    $pdo->exec("CREATE DATABASE IF NOT EXISTS {$config['database']} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    $pdo->exec("USE {$config['database']}");
    echo "<span class='success'>✓ Database ready</span>\n\n";

    // List of migrations to run in order
    $migrations = [
        '002_create_contact_messages_table.sql',
        '003_update_notifications_for_contacts.sql'
    ];

    $migrationsDir = __DIR__ . '/database/migrations/';

    echo "<h2>Running Migrations</h2>\n";
    echo str_repeat('=', 60) . "\n\n";

    foreach ($migrations as $migrationFile) {
        $filePath = $migrationsDir . $migrationFile;

        if (!file_exists($filePath)) {
            echo "<span class='warning'>⚠ Migration not found: $migrationFile</span>\n";
            continue;
        }

        echo "<span class='info'>→ Running: $migrationFile</span>\n";

        try {
            $sql = file_get_contents($filePath);

            // Split by semicolons, but keep delimiter statements together
            $statements = [];
            $currentStatement = '';
            $inDelimiter = false;

            foreach (explode("\n", $sql) as $line) {
                $trimmed = trim($line);

                // Handle DELIMITER statements
                if (stripos($trimmed, 'DELIMITER') === 0) {
                    $inDelimiter = !$inDelimiter;
                    continue;
                }

                $currentStatement .= $line . "\n";

                // Check if statement is complete
                if (!$inDelimiter && substr($trimmed, -1) === ';') {
                    $statement = trim($currentStatement);
                    if (!empty($statement) && strpos($statement, '--') !== 0) {
                        $statements[] = $statement;
                    }
                    $currentStatement = '';
                }
            }

            // Add last statement if any
            if (!empty(trim($currentStatement))) {
                $statements[] = trim($currentStatement);
            }

            // Execute each statement
            $pdo->beginTransaction();

            foreach ($statements as $statement) {
                if (empty(trim($statement))) continue;

                // Skip comments
                if (strpos(trim($statement), '--') === 0) continue;

                try {
                    $pdo->exec($statement);
                } catch (PDOException $e) {
                    // Ignore "already exists" errors
                    if (strpos($e->getMessage(), 'already exists') === false &&
                        strpos($e->getMessage(), 'Duplicate') === false) {
                        throw $e;
                    }
                }
            }

            $pdo->commit();

            echo "<span class='success'>  ✓ Success!</span>\n\n";

        } catch (Exception $e) {
            $pdo->rollBack();
            echo "<span class='error'>  ✗ Error: " . htmlspecialchars($e->getMessage()) . "</span>\n\n";
        }
    }

    echo str_repeat('=', 60) . "\n";
    echo "<span class='success'>✅ All migrations completed!</span>\n\n";

    // Show current tables
    echo "<h2>Current Database Tables</h2>\n";
    echo str_repeat('=', 60) . "\n";

    $tables = $pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);

    foreach ($tables as $table) {
        echo "  • $table\n";
    }

    echo "\n" . str_repeat('=', 60) . "\n";
    echo "<span class='success'>🎉 Database is ready!</span>\n";
    echo "\n<span class='warning'>⚠️  IMPORTANT: Delete this file (run-migrations.php) for security!</span>\n";

} catch (Exception $e) {
    echo "<span class='error'>❌ FATAL ERROR:</span>\n";
    echo "<span class='error'>" . htmlspecialchars($e->getMessage()) . "</span>\n";
    echo "\n<span class='error'>Stack trace:</span>\n";
    echo "<span class='error'>" . htmlspecialchars($e->getTraceAsString()) . "</span>\n";
}

echo "</pre>\n";
echo "</body></html>";
?>
