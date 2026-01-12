<?php
/**
 * Email Service Class for VEIRONAUTO
 * Handles sending emails using PHPMailer
 */

require_once __DIR__ . '/../../backend/vendor/phpmailer/phpmailer/src/PHPMailer.php';
require_once __DIR__ . '/../../backend/vendor/phpmailer/phpmailer/src/SMTP.php';
require_once __DIR__ . '/../../backend/vendor/phpmailer/phpmailer/src/Exception.php';
require_once __DIR__ . '/../config/email.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

class EmailService {
    private $mailer;

    public function __construct() {
        $this->mailer = new PHPMailer(true);

        // Check for required extensions
        if (!extension_loaded('openssl') && SMTP_ENCRYPTION !== '') {
            throw new Exception('OpenSSL extension is required for secure SMTP connections. For testing, use SMTP_ENCRYPTION = "" and a local mail server.');
        }

        // SMTP configuration
        $smtpConfig = EmailConfig::getSMTPSettings();

        if (!empty($smtpConfig['host']) && $smtpConfig['host'] !== 'localhost') {
            $this->mailer->isSMTP();
        } else {
            // Use PHP mail() function for localhost testing
            $this->mailer->isMail();
        }

        $this->mailer->Host = $smtpConfig['host'];
        $this->mailer->SMTPAuth = !empty($smtpConfig['username']);
        $this->mailer->Username = $smtpConfig['username'];
        $this->mailer->Password = $smtpConfig['password'];

        if (!empty($smtpConfig['encryption'])) {
            $this->mailer->SMTPSecure = $smtpConfig['encryption'];
        }

        $this->mailer->Port = $smtpConfig['port'];
        $this->mailer->SMTPDebug = $smtpConfig['debug'];

        // Default sender
        $fromConfig = EmailConfig::getFromSettings();
        $this->mailer->setFrom($fromConfig['email'], $fromConfig['name']);

        // Character encoding
        $this->mailer->CharSet = 'UTF-8';
        $this->mailer->Encoding = 'base64';
    }

    /**
     * Send booking notification to admin
     */
    public function sendBookingNotification($bookingData) {
        try {
            // Reset mailer for new email
            $this->resetMailer();

            // Add recipient
            $this->mailer->addAddress(ADMIN_EMAIL, 'VEIRONAUTO Admin');

            // Email content
            $this->mailer->isHTML(true);
            $this->mailer->Subject = BOOKING_NOTIFICATION_SUBJECT;
            $this->mailer->Body = $this->generateBookingNotificationHTML($bookingData);
            $this->mailer->AltBody = $this->generateBookingNotificationText($bookingData);

            // Send email
            $this->mailer->send();

            return [
                'success' => true,
                'message' => 'Booking notification sent successfully'
            ];

        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Failed to send booking notification: ' . $this->mailer->ErrorInfo
            ];
        }
    }

    /**
     * Send booking confirmation to client
     */
    public function sendBookingConfirmation($bookingData, $clientEmail, $language = 'ro') {
        try {
            // Reset mailer for new email
            $this->resetMailer();

            // Add recipient
            $this->mailer->addAddress($clientEmail, $bookingData['client_name'] ?? 'Valued Customer');

            // Email content based on language
            $this->mailer->isHTML(true);
            $this->mailer->Subject = $language === 'en'
                ? 'Booking Confirmation - VEIRONAUTO'
                : 'Confirmare Rezervare - VEIRONAUTO';
            $this->mailer->Body = $this->generateBookingConfirmationHTML($bookingData, $language);
            $this->mailer->AltBody = $this->generateBookingConfirmationText($bookingData, $language);

            // Send email
            $this->mailer->send();

            return [
                'success' => true,
                'message' => 'Booking confirmation sent successfully'
            ];

        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Failed to send booking confirmation: ' . $this->mailer->ErrorInfo
            ];
        }
    }

    /**
     * Send contact form message to admin
     */
    public function sendContactMessage($contactData) {
        try {
            // Reset mailer for new email
            $this->resetMailer();

            // Add recipient
            $this->mailer->addAddress(ADMIN_EMAIL, 'VEIRONAUTO Admin');

            // Set reply-to as the sender's email
            if (!empty($contactData['email'])) {
                $this->mailer->addReplyTo($contactData['email'], $contactData['name']);
            }

            // Email content
            $this->mailer->isHTML(true);
            $this->mailer->Subject = 'New Contact Form Message - VEIRONAUTO';
            $this->mailer->Body = $this->generateContactMessageHTML($contactData);
            $this->mailer->AltBody = $this->generateContactMessageText($contactData);

            // Send email
            $this->mailer->send();

            return [
                'success' => true,
                'message' => 'Contact message sent successfully'
            ];

        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Failed to send contact message: ' . $this->mailer->ErrorInfo
            ];
        }
    }

    /**
     * Reset mailer for new email
     */
    private function resetMailer() {
        $this->mailer->clearAddresses();
        $this->mailer->clearCCs();
        $this->mailer->clearBCCs();
        $this->mailer->clearReplyTo();
        $this->mailer->clearAttachments();
    }

    /**
     * Generate HTML booking notification for admin (always in Romanian)
     */
    private function generateBookingNotificationHTML($data) {
        $html = "
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4; }
                .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
                .header { background-color: #007bff; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { padding: 20px; }
                .booking-details { background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0; }
                .booking-details table { width: 100%; border-collapse: collapse; }
                .booking-details th, .booking-details td { padding: 8px; text-align: left; border-bottom: 1px solid #dee2e6; }
                .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h1>🚗 Notificare Rezervare Nouă</h1>
                    <p>VEIRONAUTO Închirieri Auto</p>
                </div>
                <div class='content'>
                    <h2>A fost creată o rezervare nouă!</h2>
                    <div class='booking-details'>
                        <h3>Detalii Rezervare:</h3>
                        <table>
                            <tr><th>Număr Rezervare:</th><td>{$data['booking_number']}</td></tr>
                            <tr><th>Client:</th><td>{$data['client_name']} ({$data['client_email']})</td></tr>
                            <tr><th>Telefon:</th><td>{$data['client_phone']}</td></tr>
                            <tr><th>Mașină:</th><td>{$data['car_name']}</td></tr>
                            <tr><th>Ridicare:</th><td>{$data['pickup_location']} pe {$data['pickup_date']} la ora {$data['pickup_time']}</td></tr>
                            <tr><th>Returnare:</th><td>{$data['dropoff_location']} pe {$data['dropoff_date']} la ora {$data['dropoff_time']}</td></tr>
                            <tr><th>Durată:</th><td>{$data['duration_days']} zile</td></tr>
                            <tr><th>Cost Total:</th><td>€{$data['total_cost_eur']} ({$data['total_cost_ron']} RON)</td></tr>
                            <tr><th>Status:</th><td>{$data['status']}</td></tr>
                            <tr><th>Status Plată:</th><td>{$data['payment_status']}</td></tr>
                        </table>
                    </div>
                    <p>Vă rugăm să revizuiți și să confirmați această rezervare în panoul de administrare.</p>
                </div>
                <div class='footer'>
                    <p>Aceasta este o notificare automată de la sistemul VEIRONAUTO</p>
                    <p>Generată pe " . date('Y-m-d H:i:s') . "</p>
                </div>
            </div>
        </body>
        </html>";

        return $html;
    }

    /**
     * Generate text booking notification for admin (always in Romanian)
     */
    private function generateBookingNotificationText($data) {
        return "
VEIRONAUTO - Notificare Rezervare Nouă

A fost creată o rezervare nouă!

Detalii Rezervare:
- Număr Rezervare: {$data['booking_number']}
- Client: {$data['client_name']} ({$data['client_email']})
- Telefon: {$data['client_phone']}
- Mașină: {$data['car_name']}
- Ridicare: {$data['pickup_location']} pe {$data['pickup_date']} la ora {$data['pickup_time']}
- Returnare: {$data['dropoff_location']} pe {$data['dropoff_date']} la ora {$data['dropoff_time']}
- Durată: {$data['duration_days']} zile
- Cost Total: €{$data['total_cost_eur']} ({$data['total_cost_ron']} RON)
- Status: {$data['status']}
- Status Plată: {$data['payment_status']}

Vă rugăm să revizuiți și să confirmați această rezervare în panoul de administrare.

Aceasta este o notificare automată de la sistemul VEIRONAUTO
Generată pe " . date('Y-m-d H:i:s');
    }

    /**
     * Generate HTML booking confirmation for client
     */
    private function generateBookingConfirmationHTML($data, $language = 'ro') {
        if ($language === 'en') {
            return $this->generateBookingConfirmationHTML_EN($data);
        }
        return $this->generateBookingConfirmationHTML_RO($data);
    }

    /**
     * Generate HTML booking confirmation for client (Romanian)
     */
    private function generateBookingConfirmationHTML_RO($data) {
        $html = "
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4; }
                .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
                .header { background-color: #28a745; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { padding: 20px; }
                .booking-details { background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0; }
                .booking-details table { width: 100%; border-collapse: collapse; }
                .booking-details th, .booking-details td { padding: 8px; text-align: left; border-bottom: 1px solid #dee2e6; }
                .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
                .contact-info { background-color: #e9ecef; padding: 15px; border-radius: 5px; margin: 15px 0; }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h1>✅ Rezervare Confirmată!</h1>
                    <p>VEIRONAUTO Închirieri Auto</p>
                </div>
                <div class='content'>
                    <h2>Stimat/ă {$data['client_name']},</h2>
                    <p>Rezervarea dumneavoastră a fost confirmată! Iată detaliile:</p>
                    <div class='booking-details'>
                        <h3>Detalii Rezervare:</h3>
                        <table>
                            <tr><th>Număr Rezervare:</th><td>{$data['booking_number']}</td></tr>
                            <tr><th>Mașină:</th><td>{$data['car_name']}</td></tr>
                            <tr><th>Ridicare:</th><td>{$data['pickup_location']} pe {$data['pickup_date']} la ora {$data['pickup_time']}</td></tr>
                            <tr><th>Returnare:</th><td>{$data['dropoff_location']} pe {$data['dropoff_date']} la ora {$data['dropoff_time']}</td></tr>
                            <tr><th>Durată:</th><td>{$data['duration_days']} zile</td></tr>
                            <tr><th>Cost Total:</th><td>€{$data['total_cost_eur']} ({$data['total_cost_ron']} RON)</td></tr>
                            <tr><th>Status:</th><td>{$data['status']}</td></tr>
                        </table>
                    </div>
                    <div class='contact-info'>
                        <h3>Informații de Contact:</h3>
                        <p><strong>Telefon:</strong> +40 123 456 789</p>
                        <p><strong>Email:</strong> contact@veironauto.ro</p>
                        <p><strong>Adresă:</strong> Satu Mare, România</p>
                    </div>
                    <p>Dacă aveți întrebări, nu ezitați să ne contactați.</p>
                    <p>Vă mulțumim că ați ales VEIRONAUTO!</p>
                </div>
                <div class='footer'>
                    <p>Acesta este un mesaj automat de confirmare de la VEIRONAUTO</p>
                    <p>Generat pe " . date('Y-m-d H:i:s') . "</p>
                </div>
            </div>
        </body>
        </html>";

        return $html;
    }

    /**
     * Generate HTML booking confirmation for client (English)
     */
    private function generateBookingConfirmationHTML_EN($data) {
        $html = "
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4; }
                .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
                .header { background-color: #28a745; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { padding: 20px; }
                .booking-details { background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0; }
                .booking-details table { width: 100%; border-collapse: collapse; }
                .booking-details th, .booking-details td { padding: 8px; text-align: left; border-bottom: 1px solid #dee2e6; }
                .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
                .contact-info { background-color: #e9ecef; padding: 15px; border-radius: 5px; margin: 15px 0; }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h1>✅ Booking Confirmed!</h1>
                    <p>VEIRONAUTO Car Rental</p>
                </div>
                <div class='content'>
                    <h2>Dear {$data['client_name']},</h2>
                    <p>Your booking has been confirmed! Here are the details:</p>
                    <div class='booking-details'>
                        <h3>Booking Details:</h3>
                        <table>
                            <tr><th>Booking Number:</th><td>{$data['booking_number']}</td></tr>
                            <tr><th>Car:</th><td>{$data['car_name']}</td></tr>
                            <tr><th>Pickup:</th><td>{$data['pickup_location']} on {$data['pickup_date']} at {$data['pickup_time']}</td></tr>
                            <tr><th>Dropoff:</th><td>{$data['dropoff_location']} on {$data['dropoff_date']} at {$data['dropoff_time']}</td></tr>
                            <tr><th>Duration:</th><td>{$data['duration_days']} days</td></tr>
                            <tr><th>Total Cost:</th><td>€{$data['total_cost_eur']} ({$data['total_cost_ron']} RON)</td></tr>
                            <tr><th>Status:</th><td>{$data['status']}</td></tr>
                        </table>
                    </div>
                    <div class='contact-info'>
                        <h3>Contact Information:</h3>
                        <p><strong>Phone:</strong> +40 123 456 789</p>
                        <p><strong>Email:</strong> contact@veironauto.ro</p>
                        <p><strong>Address:</strong> Satu Mare, Romania</p>
                    </div>
                    <p>If you have any questions, please don't hesitate to contact us.</p>
                    <p>Thank you for choosing VEIRONAUTO!</p>
                </div>
                <div class='footer'>
                    <p>This is an automated confirmation from VEIRONAUTO Car Rental System</p>
                    <p>Generated on " . date('Y-m-d H:i:s') . "</p>
                </div>
            </div>
        </body>
        </html>";

        return $html;
    }

    /**
     * Generate text booking confirmation for client
     */
    private function generateBookingConfirmationText($data, $language = 'ro') {
        if ($language === 'en') {
            return "
VEIRONAUTO - Booking Confirmation

Dear {$data['client_name']},

Your booking has been confirmed! Here are the details:

Booking Details:
- Booking Number: {$data['booking_number']}
- Car: {$data['car_name']}
- Pickup: {$data['pickup_location']} on {$data['pickup_date']} at {$data['pickup_time']}
- Dropoff: {$data['dropoff_location']} on {$data['dropoff_date']} at {$data['dropoff_time']}
- Duration: {$data['duration_days']} days
- Total Cost: €{$data['total_cost_eur']} ({$data['total_cost_ron']} RON)
- Status: {$data['status']}

Contact Information:
- Phone: +40 123 456 789
- Email: contact@veironauto.ro
- Address: Satu Mare, Romania

If you have any questions, please don't hesitate to contact us.

Thank you for choosing VEIRONAUTO!

This is an automated confirmation from VEIRONAUTO Car Rental System
Generated on " . date('Y-m-d H:i:s');
        }

        return "
VEIRONAUTO - Confirmare Rezervare

Stimat/ă {$data['client_name']},

Rezervarea dumneavoastră a fost confirmată! Iată detaliile:

Detalii Rezervare:
- Număr Rezervare: {$data['booking_number']}
- Mașină: {$data['car_name']}
- Ridicare: {$data['pickup_location']} pe {$data['pickup_date']} la ora {$data['pickup_time']}
- Returnare: {$data['dropoff_location']} pe {$data['dropoff_date']} la ora {$data['dropoff_time']}
- Durată: {$data['duration_days']} zile
- Cost Total: €{$data['total_cost_eur']} ({$data['total_cost_ron']} RON)
- Status: {$data['status']}

Informații de Contact:
- Telefon: +40 123 456 789
- Email: contact@veironauto.ro
- Adresă: Satu Mare, România

Dacă aveți întrebări, nu ezitați să ne contactați.

Vă mulțumim că ați ales VEIRONAUTO!

Acesta este un mesaj automat de confirmare de la VEIRONAUTO
Generat pe " . date('Y-m-d H:i:s');
    }

    /**
     * Generate HTML contact message for admin
     */
    private function generateContactMessageHTML($data) {
        $html = "
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4; }
                .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
                .header { background-color: #17a2b8; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { padding: 20px; }
                .message-details { background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0; }
                .message-details table { width: 100%; border-collapse: collapse; }
                .message-details th, .message-details td { padding: 8px; text-align: left; border-bottom: 1px solid #dee2e6; }
                .message-content { background-color: #fff; border: 1px solid #dee2e6; padding: 15px; border-radius: 5px; margin: 15px 0; }
                .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h1>📧 New Contact Form Message</h1>
                    <p>VEIRONAUTO Car Rental System</p>
                </div>
                <div class='content'>
                    <h2>You have received a new message!</h2>
                    <div class='message-details'>
                        <h3>Contact Information:</h3>
                        <table>
                            <tr><th>Name:</th><td>{$data['name']}</td></tr>
                            <tr><th>Email:</th><td><a href='mailto:{$data['email']}'>{$data['email']}</a></td></tr>
                            <tr><th>Phone:</th><td>{$data['phone']}</td></tr>";

        if (!empty($data['subject'])) {
            $html .= "<tr><th>Subject:</th><td>{$data['subject']}</td></tr>";
        }

        $html .= "
                        </table>
                    </div>
                    <div class='message-content'>
                        <h3>Message:</h3>
                        <p>" . nl2br(htmlspecialchars($data['message'])) . "</p>
                    </div>
                    <p><strong>Reply to this email to respond directly to the sender.</strong></p>
                </div>
                <div class='footer'>
                    <p>This is an automated notification from VEIRONAUTO Car Rental System</p>
                    <p>Received on " . date('Y-m-d H:i:s') . "</p>
                </div>
            </div>
        </body>
        </html>";

        return $html;
    }

    /**
     * Generate text contact message for admin
     */
    private function generateContactMessageText($data) {
        $text = "
VEIRONAUTO - New Contact Form Message

You have received a new message!

Contact Information:
- Name: {$data['name']}
- Email: {$data['email']}
- Phone: {$data['phone']}";

        if (!empty($data['subject'])) {
            $text .= "\n- Subject: {$data['subject']}";
        }

        $text .= "

Message:
{$data['message']}

Reply to this email to respond directly to the sender.

This is an automated notification from VEIRONAUTO Car Rental System
Received on " . date('Y-m-d H:i:s');

        return $text;
    }
}
?>
