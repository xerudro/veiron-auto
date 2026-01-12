<?php
/**
 * Debug Email Configuration
 * Verifică dacă configurația email este corectă
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h1>Debug Email Configuration</h1>";
echo "<hr>";

// Step 1: Check if DotEnv exists
echo "<h2>1. Verificare DotEnv.php</h2>";
$dotenvPath = __DIR__ . '/../config/DotEnv.php';
if (file_exists($dotenvPath)) {
    echo "<p style='color: green;'>✓ DotEnv.php există: $dotenvPath</p>";
    require_once $dotenvPath;
} else {
    echo "<p style='color: red;'>✗ DotEnv.php NU există: $dotenvPath</p>";
    die();
}

// Step 2: Check if .env exists
echo "<h2>2. Verificare .env</h2>";
$envPath = __DIR__ . '/../.env';
if (file_exists($envPath)) {
    echo "<p style='color: green;'>✓ .env există: $envPath</p>";

    // Load .env
    try {
        DotEnv::load($envPath);
        echo "<p style='color: green;'>✓ .env încărcat cu succes</p>";
    } catch (Exception $e) {
        echo "<p style='color: red;'>✗ Eroare la încărcarea .env: " . $e->getMessage() . "</p>";
        die();
    }
} else {
    echo "<p style='color: red;'>✗ .env NU există: $envPath</p>";
    die();
}

// Step 3: Check environment variables
echo "<h2>3. Verificare Variabile Mediu</h2>";
$requiredVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USERNAME', 'SMTP_PASSWORD', 'SMTP_FROM_EMAIL', 'ADMIN_EMAIL'];
$allVarsOk = true;

foreach ($requiredVars as $var) {
    $value = DotEnv::get($var);
    if ($value) {
        // Mask sensitive data
        if (in_array($var, ['SMTP_PASSWORD'])) {
            $displayValue = str_repeat('*', strlen($value));
        } else {
            $displayValue = $value;
        }
        echo "<p style='color: green;'>✓ $var: $displayValue</p>";
    } else {
        echo "<p style='color: red;'>✗ $var: NU este setat</p>";
        $allVarsOk = false;
    }
}

if (!$allVarsOk) {
    echo "<p style='color: red; font-weight: bold;'>Eroare: Unele variabile de mediu lipsesc!</p>";
    die();
}

// Step 4: Check email.php config
echo "<h2>4. Verificare email.php</h2>";
$emailConfigPath = __DIR__ . '/../config/email.php';
if (file_exists($emailConfigPath)) {
    echo "<p style='color: green;'>✓ email.php există: $emailConfigPath</p>";

    try {
        require_once $emailConfigPath;
        echo "<p style='color: green;'>✓ email.php încărcat cu succes</p>";

        // Check constants
        echo "<h3>Constante definite:</h3>";
        $constants = ['SMTP_HOST', 'SMTP_PORT', 'ADMIN_EMAIL', 'FROM_EMAIL'];
        foreach ($constants as $const) {
            if (defined($const)) {
                $value = constant($const);
                if ($const === 'ADMIN_EMAIL' || $const === 'FROM_EMAIL' || $const === 'SMTP_HOST') {
                    echo "<p style='color: green;'>✓ $const: $value</p>";
                } else {
                    echo "<p style='color: green;'>✓ $const: $value</p>";
                }
            } else {
                echo "<p style='color: red;'>✗ $const: NU este definit</p>";
            }
        }

    } catch (Exception $e) {
        echo "<p style='color: red;'>✗ Eroare la încărcarea email.php: " . $e->getMessage() . "</p>";
        die();
    }
} else {
    echo "<p style='color: red;'>✗ email.php NU există: $emailConfigPath</p>";
    die();
}

// Step 5: Check PHPMailer
echo "<h2>5. Verificare PHPMailer</h2>";
$phpmailerPath = __DIR__ . '/../../backend/vendor/phpmailer/phpmailer/src/PHPMailer.php';
if (file_exists($phpmailerPath)) {
    echo "<p style='color: green;'>✓ PHPMailer există: $phpmailerPath</p>";
} else {
    echo "<p style='color: red;'>✗ PHPMailer NU există: $phpmailerPath</p>";
    die();
}

// Step 6: Check EmailService
echo "<h2>6. Verificare EmailService.php</h2>";
$emailServicePath = __DIR__ . '/../libs/EmailService.php';
if (file_exists($emailServicePath)) {
    echo "<p style='color: green;'>✓ EmailService.php există: $emailServicePath</p>";

    try {
        require_once $emailServicePath;
        echo "<p style='color: green;'>✓ EmailService.php încărcat cu succes</p>";

        // Try to instantiate
        $emailService = new EmailService();
        echo "<p style='color: green;'>✓ EmailService instanțiat cu succes</p>";

    } catch (Exception $e) {
        echo "<p style='color: red;'>✗ Eroare la instantierea EmailService: " . $e->getMessage() . "</p>";
        echo "<pre>" . $e->getTraceAsString() . "</pre>";
        die();
    }
} else {
    echo "<p style='color: red;'>✗ EmailService.php NU există: $emailServicePath</p>";
    die();
}

echo "<hr>";
echo "<h2 style='color: green;'>✓ Toate verificările au trecut! Sistemul este configurat corect.</h2>";
echo "<p><a href='test-contact.php'>Testează trimiterea unui email →</a></p>";
?>
