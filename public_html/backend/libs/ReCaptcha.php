<?php
/**
 * ReCaptcha v3 Validation Class
 * Veiron Auto - Închirieri Auto Satu Mare
 */

require_once __DIR__ . '/../config/DotEnv.php';
DotEnv::load(__DIR__ . '/../.env');

class ReCaptcha {
    private $secretKey;
    private $scoreThreshold;
    private $verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';

    public function __construct() {
        $this->secretKey = DotEnv::get('RECAPTCHA_SECRET_KEY');
        $this->scoreThreshold = floatval(DotEnv::get('RECAPTCHA_SCORE_THRESHOLD', 0.5));
    }

    /**
     * Verify reCAPTCHA token
     *
     * @param string $token The reCAPTCHA response token from the client
     * @param string $expectedAction Optional expected action name to verify
     * @return array ['success' => bool, 'score' => float, 'error' => string|null]
     */
    public function verify($token, $expectedAction = null) {
        if (empty($token)) {
            return [
                'success' => false,
                'score' => 0,
                'error' => 'reCAPTCHA token is missing'
            ];
        }

        if (empty($this->secretKey)) {
            // If no secret key configured, log warning but allow request
            error_log('ReCaptcha: Secret key not configured');
            return [
                'success' => true,
                'score' => 1,
                'error' => null
            ];
        }

        // Prepare POST data
        $postData = [
            'secret' => $this->secretKey,
            'response' => $token
        ];

        // Add remote IP if available
        if (!empty($_SERVER['REMOTE_ADDR'])) {
            $postData['remoteip'] = $_SERVER['REMOTE_ADDR'];
        }

        // Make request to Google
        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL => $this->verifyUrl,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => http_build_query($postData),
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 10,
            CURLOPT_SSL_VERIFYPEER => true
        ]);

        $response = curl_exec($ch);
        $curlError = curl_error($ch);
        curl_close($ch);

        if ($response === false) {
            error_log('ReCaptcha: cURL error - ' . $curlError);
            return [
                'success' => false,
                'score' => 0,
                'error' => 'Failed to verify reCAPTCHA: ' . $curlError
            ];
        }

        $result = json_decode($response, true);

        if (!$result) {
            error_log('ReCaptcha: Invalid JSON response');
            return [
                'success' => false,
                'score' => 0,
                'error' => 'Invalid reCAPTCHA response'
            ];
        }

        // Check if verification was successful
        if (empty($result['success'])) {
            $errorCodes = isset($result['error-codes']) ? implode(', ', $result['error-codes']) : 'unknown';
            error_log('ReCaptcha: Verification failed - ' . $errorCodes);
            return [
                'success' => false,
                'score' => 0,
                'error' => 'reCAPTCHA verification failed: ' . $errorCodes
            ];
        }

        // Get score (v3 specific)
        $score = isset($result['score']) ? floatval($result['score']) : 1;

        // Verify action if expected
        if ($expectedAction !== null && isset($result['action'])) {
            if ($result['action'] !== $expectedAction) {
                error_log('ReCaptcha: Action mismatch - expected: ' . $expectedAction . ', got: ' . $result['action']);
                return [
                    'success' => false,
                    'score' => $score,
                    'error' => 'reCAPTCHA action mismatch'
                ];
            }
        }

        // Check score against threshold
        if ($score < $this->scoreThreshold) {
            error_log('ReCaptcha: Score too low - ' . $score . ' < ' . $this->scoreThreshold);
            return [
                'success' => false,
                'score' => $score,
                'error' => 'reCAPTCHA score too low (possible bot)'
            ];
        }

        return [
            'success' => true,
            'score' => $score,
            'error' => null,
            'action' => isset($result['action']) ? $result['action'] : null
        ];
    }

    /**
     * Get the site key for frontend use
     */
    public static function getSiteKey() {
        return DotEnv::get('RECAPTCHA_SITE_KEY');
    }

    /**
     * Get the score threshold
     */
    public function getScoreThreshold() {
        return $this->scoreThreshold;
    }
}
?>
