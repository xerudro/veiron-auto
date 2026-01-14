<?php
/**
 * Simple Email Test for Veiron Auto
 * Tests the email configuration with mail.veironauto.com
 */

echo "=== Veiron Auto Email Test ===\n\n";

// Load PHPMailer
require_once __DIR__ . '/vendor/phpmailer/phpmailer/src/PHPMailer.php';
require_once __DIR__ . '/vendor/phpmailer/phpmailer/src/SMTP.php';
require_once __DIR__ . '/vendor/phpmailer/phpmailer/src/Exception.php';
require_once __DIR__ . '/config/email.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Check OpenSSL extension
echo "1. Checking OpenSSL extension...\n";
if (extension_loaded('openssl')) {
    echo "   ✅ OpenSSL is available\n\n";
} else {
    echo "   ❌ OpenSSL is NOT available\n";
    echo "   WARNING: You need to enable OpenSSL in php.ini\n";
    echo "   Uncomment: extension=openssl\n\n";
}

// Check email configuration
echo "2. Email Configuration:\n";
echo "   Host: " . SMTP_HOST . "\n";
echo "   Port: " . SMTP_PORT . "\n";
echo "   Username: " . SMTP_USERNAME . "\n";
echo "   Encryption: " . SMTP_ENCRYPTION . "\n";
echo "   From: " . FROM_EMAIL . " (" . FROM_NAME . ")\n";
echo "   Admin Email: " . ADMIN_EMAIL . "\n\n";

// Test sending email
echo "3. Testing email sending...\n";

try {
    $mail = new PHPMailer(true);

    // Server settings
    $mail->SMTPDebug = 2; // Enable verbose debug output
    $mail->isSMTP();
    $mail->Host = SMTP_HOST;
    $mail->SMTPAuth = true;
    $mail->Username = SMTP_USERNAME;
    $mail->Password = SMTP_PASSWORD;
    $mail->SMTPSecure = SMTP_ENCRYPTION;
    $mail->Port = SMTP_PORT;

    // Recipients
    $mail->setFrom(FROM_EMAIL, FROM_NAME);
    $mail->addAddress(ADMIN_EMAIL, 'Veiron Auto Admin');

    // Content
    $mail->isHTML(true);
    $mail->CharSet = 'UTF-8';
    $mail->Subject = 'Test Email from Veiron Auto System';
    $mail->Body = '<html><body>
        <h2>🚗 Test Email</h2>
        <p>This is a test email from the Veiron Auto car rental system.</p>
        <p><strong>Server:</strong> ' . SMTP_HOST . '</p>
        <p><strong>Time:</strong> ' . date('Y-m-d H:i:s') . '</p>
        <p>If you received this email, your email system is working correctly! ✅</p>
        </body></html>';
    $mail->AltBody = 'This is a test email from Veiron Auto. If you received this, your email system is working correctly!';

    // Send email
    $mail->send();

    echo "\n\n✅ SUCCESS! Email sent successfully!\n";
    echo "   Check your inbox at: " . ADMIN_EMAIL . "\n";

} catch (Exception $e) {
    echo "\n\n❌ FAILED! Could not send email.\n";
    echo "   Error: {$mail->ErrorInfo}\n\n";
    
    echo "Troubleshooting tips:\n";
    echo "1. Check if OpenSSL is enabled in php.ini\n";
    echo "2. Verify SMTP credentials are correct\n";
    echo "3. Check if port 465 is not blocked by firewall\n";
    echo "4. Verify the email account test@veironauto.com exists\n";
    echo "5. Check server logs for more details\n";
}

echo "\n=== Test Complete ===\n";
?>
