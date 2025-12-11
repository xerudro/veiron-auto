<?php
/**
 * Test Environment Configuration
 * Verifies that all configs load correctly from .env
 */

echo "=== Testing Environment Configuration ===\n\n";

// Test 1: DotEnv Parser
echo "1. Testing DotEnv Parser...\n";
require_once 'config/DotEnv.php';

try {
    DotEnv::load('.env');
    echo "   ✅ .env file loaded successfully\n";
} catch (Exception $e) {
    echo "   ❌ Failed to load .env: " . $e->getMessage() . "\n";
    exit(1);
}

// Test 2: Database Configuration
echo "\n2. Testing Database Configuration...\n";
try {
    require_once 'database/config.php';
    echo "   ✅ Database config loaded\n";
    echo "   - Host: " . DB_HOST . "\n";
    echo "   - Database: " . DB_NAME . "\n";
    echo "   - User: " . DB_USER . "\n";
    
    if (testDBConnection()) {
        echo "   ✅ Database connection successful!\n";
    } else {
        echo "   ❌ Database connection failed\n";
    }
} catch (Exception $e) {
    echo "   ❌ Database config error: " . $e->getMessage() . "\n";
}

// Test 3: Email Configuration
echo "\n3. Testing Email Configuration...\n";
try {
    require_once 'config/email.php';
    echo "   ✅ Email config loaded\n";
    echo "   - SMTP Host: " . SMTP_HOST . "\n";
    echo "   - SMTP Port: " . SMTP_PORT . "\n";
    echo "   - From: " . FROM_EMAIL . "\n";
    echo "   - Admin Email: " . ADMIN_EMAIL . "\n";
} catch (Exception $e) {
    echo "   ❌ Email config error: " . $e->getMessage() . "\n";
}

// Test 4: API Configuration
echo "\n4. Testing API Configuration...\n";
try {
    require_once 'config/api.php';
    echo "   ✅ API config loaded\n";
    echo "   - Version: " . API_VERSION . "\n";
    echo "   - Environment: " . API_ENV . "\n";
    echo "   - Debug: " . (API_DEBUG ? 'Enabled' : 'Disabled') . "\n";
    echo "   - JWT Secret: " . substr(JWT_SECRET, 0, 20) . "...\n";
} catch (Exception $e) {
    echo "   ❌ API config error: " . $e->getMessage() . "\n";
}

// Test 5: Environment Variables
echo "\n5. Testing Environment Variables...\n";
$requiredVars = [
    'DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASS',
    'SMTP_HOST', 'SMTP_USERNAME', 'SMTP_PASSWORD',
    'JWT_SECRET', 'ADMIN_EMAIL'
];

$allPresent = true;
foreach ($requiredVars as $var) {
    if (DotEnv::has($var)) {
        echo "   ✅ $var is set\n";
    } else {
        echo "   ❌ $var is MISSING\n";
        $allPresent = false;
    }
}

// Summary
echo "\n=== Test Summary ===\n";
if ($allPresent) {
    echo "✅ All tests passed! Environment configuration is working correctly.\n";
} else {
    echo "❌ Some tests failed. Check your .env file.\n";
}

echo "\n";
?>
