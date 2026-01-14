<?php
/**
 * Contact Form Diagnostic Script
 * Run this in browser to identify issues
 *
 * URL: https://veironauto.com/backend/diagnose-contact.php
 * DELETE THIS FILE AFTER DEBUGGING!
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: text/html; charset=utf-8');

echo "<!DOCTYPE html>\n<html><head><meta charset='utf-8'><title>Contact Form Diagnostics</title>";
echo "<style>
body { font-family: 'Courier New', monospace; padding: 20px; background: #1e1e1e; color: #d4d4d4; }
.success { color: #4ec9b0; }
.error { color: #f48771; }
.warning { color: #dcdcaa; }
.info { color: #569cd6; }
h1, h2 { color: #4ec9b0; }
pre { background: #2d2d30; padding: 10px; border-left: 3px solid #4ec9b0; overflow-x: auto; }
</style></head><body>";

echo "<h1>🔍 Contact Form Diagnostics</h1>\n";
echo "<pre>\n";

$errors = [];
$checks = [];

// ============================================
// Check 1: PHP Extensions
// ============================================
echo "<h2>1. PHP Extensions</h2>\n";

$required_ext = ['pdo', 'pdo_mysql', 'json', 'openssl', 'mbstring'];
foreach ($required_ext as $ext) {
    if (extension_loaded($ext)) {
        echo "<span class='success'>✓ $ext loaded</span>\n";
        $checks[] = $ext;
    } else {
        echo "<span class='error'>✗ $ext NOT loaded</span>\n";
        $errors[] = "Missing PHP extension: $ext";
    }
}

// ============================================
// Check 2: Required Files
// ============================================
echo "\n<h2>2. Required Files</h2>\n";

$files = [
    '.env' => __DIR__ . '/.env',
    'Database.php' => __DIR__ . '/libs/Database.php',
    'EmailService.php' => __DIR__ . '/libs/EmailService.php',
    'email.php' => __DIR__ . '/config/email.php',
    'DotEnv.php' => __DIR__ . '/config/DotEnv.php',
    'PHPMailer.php' => __DIR__ . '/vendor/phpmailer/phpmailer/src/PHPMailer.php',
];

foreach ($files as $name => $path) {
    if (file_exists($path)) {
        echo "<span class='success'>✓ $name exists</span>\n";
    } else {
        echo "<span class='error'>✗ $name NOT found at: $path</span>\n";
        $errors[] = "Missing file: $name";
    }
}

// ============================================
// Check 3: Database Connection
// ============================================
echo "\n<h2>3. Database Connection</h2>\n";

try {
    require_once __DIR__ . '/libs/Database.php';
    $db = Database::getInstance();
    echo "<span class='success'>✓ Database connected successfully</span>\n";

    // Check tables
    $tables = $db->query("SHOW TABLES LIKE 'contact_messages'");
    if (!empty($tables)) {
        echo "<span class='success'>✓ contact_messages table exists</span>\n";
    } else {
        echo "<span class='error'>✗ contact_messages table NOT found</span>\n";
        $errors[] = "contact_messages table missing";
    }

    $tables = $db->query("SHOW TABLES LIKE 'notifications'");
    if (!empty($tables)) {
        echo "<span class='success'>✓ notifications table exists</span>\n";
    } else {
        echo "<span class='error'>✗ notifications table NOT found</span>\n";
        $errors[] = "notifications table missing";
    }

} catch (Exception $e) {
    echo "<span class='error'>✗ Database connection FAILED: " . htmlspecialchars($e->getMessage()) . "</span>\n";
    $errors[] = "Database: " . $e->getMessage();
}

// ============================================
// Check 4: Email Configuration
// ============================================
echo "\n<h2>4. Email Configuration</h2>\n";

try {
    require_once __DIR__ . '/config/email.php';

    echo "<span class='info'>SMTP Host: " . SMTP_HOST . "</span>\n";
    echo "<span class='info'>SMTP Port: " . SMTP_PORT . "</span>\n";
    echo "<span class='info'>SMTP Username: " . SMTP_USERNAME . "</span>\n";
    echo "<span class='info'>SMTP Encryption: " . SMTP_ENCRYPTION . "</span>\n";
    echo "<span class='info'>From Email: " . FROM_EMAIL . "</span>\n";
    echo "<span class='info'>Admin Email: " . ADMIN_EMAIL . "</span>\n";

    if (empty(SMTP_HOST)) {
        $errors[] = "SMTP_HOST is empty";
    }
    if (empty(ADMIN_EMAIL)) {
        $errors[] = "ADMIN_EMAIL is empty";
    }

} catch (Exception $e) {
    echo "<span class='error'>✗ Email config error: " . htmlspecialchars($e->getMessage()) . "</span>\n";
    $errors[] = "Email config: " . $e->getMessage();
}

// ============================================
// Check 5: EmailService Instantiation
// ============================================
echo "\n<h2>5. EmailService Instantiation</h2>\n";

try {
    require_once __DIR__ . '/libs/EmailService.php';
    $emailService = new EmailService();
    echo "<span class='success'>✓ EmailService instantiated successfully</span>\n";
} catch (Exception $e) {
    echo "<span class='error'>✗ EmailService FAILED: " . htmlspecialchars($e->getMessage()) . "</span>\n";
    $errors[] = "EmailService: " . $e->getMessage();
}

// ============================================
// Check 6: SMTP Connection Test
// ============================================
echo "\n<h2>6. SMTP Connection Test</h2>\n";

try {
    $connection = @fsockopen(SMTP_HOST, SMTP_PORT, $errno, $errstr, 10);
    if ($connection) {
        echo "<span class='success'>✓ Can connect to SMTP server " . SMTP_HOST . ":" . SMTP_PORT . "</span>\n";
        fclose($connection);
    } else {
        echo "<span class='error'>✗ Cannot connect to SMTP: $errstr ($errno)</span>\n";
        $errors[] = "SMTP connection failed: $errstr";
    }
} catch (Exception $e) {
    echo "<span class='error'>✗ SMTP test error: " . htmlspecialchars($e->getMessage()) . "</span>\n";
}

// ============================================
// Check 7: Logs Directory
// ============================================
echo "\n<h2>7. Logs Directory</h2>\n";

$logsDir = __DIR__ . '/logs';
if (is_dir($logsDir)) {
    echo "<span class='success'>✓ Logs directory exists</span>\n";
    if (is_writable($logsDir)) {
        echo "<span class='success'>✓ Logs directory is writable</span>\n";
    } else {
        echo "<span class='error'>✗ Logs directory is NOT writable</span>\n";
        $errors[] = "Logs directory not writable";
    }
} else {
    echo "<span class='warning'>⚠ Logs directory does not exist (will be created automatically)</span>\n";
}

// Check if log file exists and show recent entries
$logFile = __DIR__ . '/logs/contact-api.log';
if (file_exists($logFile)) {
    echo "\n<span class='info'>Recent log entries:</span>\n";
    $lines = file($logFile);
    $recentLines = array_slice($lines, -10);
    foreach ($recentLines as $line) {
        echo "<span class='info'>  " . htmlspecialchars(trim($line)) . "</span>\n";
    }
}

// ============================================
// Summary
// ============================================
echo "\n<h2>Summary</h2>\n";

if (empty($errors)) {
    echo "<span class='success'>✅ All checks passed! Contact form should work.</span>\n";
} else {
    echo "<span class='error'>❌ Found " . count($errors) . " issue(s):</span>\n";
    foreach ($errors as $err) {
        echo "<span class='error'>  • $err</span>\n";
    }
}

echo "\n<span class='warning'>⚠️ DELETE THIS FILE (diagnose-contact.php) AFTER DEBUGGING!</span>\n";

echo "</pre>\n";
echo "</body></html>";
?>
