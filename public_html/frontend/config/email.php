<?php
/**
 * Email Configuration for VEIRONAUTO
 * Loads email/SMTP credentials from .env file
 */

// Load environment variables
require_once __DIR__ . '/DotEnv.php';
DotEnv::load(__DIR__ . '/../.env');

// SMTP Configuration (from .env)
define('SMTP_HOST', DotEnv::get('SMTP_HOST'));
define('SMTP_PORT', DotEnv::get('SMTP_PORT', 465));
define('SMTP_USERNAME', DotEnv::get('SMTP_USERNAME'));
define('SMTP_PASSWORD', DotEnv::get('SMTP_PASSWORD'));
define('SMTP_ENCRYPTION', DotEnv::get('SMTP_ENCRYPTION', 'ssl'));

// Email Settings (from .env)
define('FROM_EMAIL', DotEnv::get('SMTP_FROM_EMAIL'));
define('FROM_NAME', DotEnv::get('SMTP_FROM_NAME', 'VEIRONAUTO Car Rental'));
define('ADMIN_EMAIL', DotEnv::get('ADMIN_EMAIL'));

// Email Templates
define('BOOKING_NOTIFICATION_SUBJECT', 'New Booking Notification - VEIRONAUTO');
define('BOOKING_CONFIRMATION_SUBJECT', 'Booking Confirmation - VEIRONAUTO');

// Debug Settings (0 = off, 1 = client, 2 = server, 3 = detailed)
define('SMTP_DEBUG', DotEnv::get('SMTP_DEBUG', 0));

// Email Service Configuration Class
class EmailConfig {
    /**
     * Get SMTP settings
     */
    public static function getSMTPSettings() {
        return [
            'host' => SMTP_HOST,
            'port' => SMTP_PORT,
            'username' => SMTP_USERNAME,
            'password' => SMTP_PASSWORD,
            'encryption' => SMTP_ENCRYPTION,
            'debug' => SMTP_DEBUG
        ];
    }

    /**
     * Get sender settings
     */
    public static function getFromSettings() {
        return [
            'email' => FROM_EMAIL,
            'name' => FROM_NAME
        ];
    }

    /**
     * Get admin email for notifications
     */
    public static function getAdminEmail() {
        return ADMIN_EMAIL;
    }
}
?>
