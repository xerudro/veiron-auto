<?php
/**
 * Auth Class - JWT Authentication System
 * Handles user authentication and token management
 */

require_once __DIR__ . '/../../config/api.php';
require_once __DIR__ . '/../../database/config.php';

class Auth {
    
    /**
     * Generate JWT token
     */
    public static function generateToken($user) {
        $header = [
            'alg' => JWT_ALGORITHM,
            'typ' => 'JWT'
        ];
        
        $payload = [
            'sub' => $user['id'],
            'name' => $user['full_name'],
            'email' => $user['email'],
            'role' => $user['role'],
            'iat' => time(),
            'exp' => time() + JWT_EXPIRATION
        ];
        
        $headerEncoded = self::base64UrlEncode(json_encode($header));
        $payloadEncoded = self::base64UrlEncode(json_encode($payload));
        
        $signature = hash_hmac(
            'sha256',
            $headerEncoded . '.' . $payloadEncoded,
            JWT_SECRET,
            true
        );
        $signatureEncoded = self::base64UrlEncode($signature);
        
        return $headerEncoded . '.' . $payloadEncoded . '.' . $signatureEncoded;
    }
    
    /**
     * Validate JWT token
     */
    public static function validateToken($token) {
        if (empty($token)) {
            return false;
        }
        
        // Check if token is blacklisted
        if (self::isTokenBlacklisted($token)) {
            return false;
        }
        
        $parts = explode('.', $token);
        
        if (count($parts) !== 3) {
            return false;
        }
        
        list($headerEncoded, $payloadEncoded, $signatureEncoded) = $parts;
        
        // Verify signature
        $signature = hash_hmac(
            'sha256',
            $headerEncoded . '.' . $payloadEncoded,
            JWT_SECRET,
            true
        );
        $signatureCheck = self::base64UrlEncode($signature);
        
        if ($signatureCheck !== $signatureEncoded) {
            return false;
        }
        
        // Decode payload
        $payload = json_decode(self::base64UrlDecode($payloadEncoded), true);
        
        if (!$payload) {
            return false;
        }
        
        // Check expiration
        if (isset($payload['exp']) && $payload['exp'] < time()) {
            return false;
        }
        
        return $payload;
    }
    
    /**
     * Extract token from request
     */
    public static function extractToken(Request $request) {
        $authHeader = $request->header('AUTHORIZATION');
        
        if (empty($authHeader)) {
            return null;
        }
        
        // Bearer token format: "Bearer <token>"
        if (preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
            return $matches[1];
        }
        
        return null;
    }
    
    /**
     * Authenticate user with credentials
     */
    public static function authenticate($email, $password) {
        try {
            $pdo = getDBConnection();
            
            $stmt = $pdo->prepare("
                SELECT id, username, email, password_hash, full_name, role, is_active
                FROM users
                WHERE email = ? AND is_active = 1
                LIMIT 1
            ");
            $stmt->execute([$email]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$user) {
                return false;
            }
            
            // Verify password
            if (!password_verify($password, $user['password_hash'])) {
                return false;
            }
            
            // Update last login
            $updateStmt = $pdo->prepare("
                UPDATE users
                SET last_login = NOW()
                WHERE id = ?
            ");
            $updateStmt->execute([$user['id']]);
            
            // Remove password hash from return data
            unset($user['password_hash']);
            
            return $user;
            
        } catch (PDOException $e) {
            error_log('Auth error: ' . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Get authenticated user from request
     * @param Request $request
     * @return array|null - User data or null if not authenticated
     */
    public static function user(Request $request) {
        $token = self::extractToken($request);

        if (!$token) {
            return null;
        }

        $payload = self::validateToken($token);

        if (!$payload) {
            return null;
        }

        // Check if token is blacklisted
        if (self::isTokenBlacklisted($token)) {
            return null;
        }

        // Return user data from payload
        return $payload['user'] ?? null;
    }

    /**
     * Check if user has required role
     */
    public static function hasRole($user, $requiredRole) {
        if (!isset($user['role'])) {
            return false;
        }

        $roleHierarchy = [
            'staff' => 1,
            'manager' => 2,
            'admin' => 3
        ];

        $userRoleLevel = $roleHierarchy[$user['role']] ?? 0;
        $requiredRoleLevel = $roleHierarchy[$requiredRole] ?? 0;

        return $userRoleLevel >= $requiredRoleLevel;
    }
    
    /**
     * Blacklist token (for logout)
     */
    public static function blacklistToken($token, $expiresAt) {
        try {
            $pdo = getDBConnection();
            
            $stmt = $pdo->prepare("
                INSERT INTO jwt_blacklist (token, expires_at)
                VALUES (?, ?)
            ");
            $stmt->execute([$token, date('Y-m-d H:i:s', $expiresAt)]);
            
            return true;
            
        } catch (PDOException $e) {
            error_log('Blacklist error: ' . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Check if token is blacklisted
     */
    public static function isTokenBlacklisted($token) {
        try {
            $pdo = getDBConnection();
            
            $stmt = $pdo->prepare("
                SELECT COUNT(*) as count
                FROM jwt_blacklist
                WHERE token = ? AND expires_at > NOW()
            ");
            $stmt->execute([$token]);
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            
            return $result['count'] > 0;
            
        } catch (PDOException $e) {
            error_log('Blacklist check error: ' . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Clean up expired blacklisted tokens
     */
    public static function cleanupBlacklist() {
        try {
            $pdo = getDBConnection();
            
            $stmt = $pdo->prepare("
                DELETE FROM jwt_blacklist
                WHERE expires_at < NOW()
            ");
            $stmt->execute();
            
            return true;
            
        } catch (PDOException $e) {
            error_log('Blacklist cleanup error: ' . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Base64 URL encode
     */
    private static function base64UrlEncode($data) {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }
    
    /**
     * Base64 URL decode
     */
    private static function base64UrlDecode($data) {
        return base64_decode(strtr($data, '-_', '+/'));
    }
    
    /**
     * Get current authenticated user from request
     */
    public static function user(Request $request) {
        $token = self::extractToken($request);
        return self::validateToken($token);
    }
}
?>
