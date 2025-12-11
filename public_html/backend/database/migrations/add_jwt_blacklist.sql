-- JWT Blacklist Table
-- Stores invalidated tokens (for logout functionality)

CREATE TABLE IF NOT EXISTS jwt_blacklist (
    id INT PRIMARY KEY AUTO_INCREMENT,
    token VARCHAR(500) NOT NULL,
    blacklisted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    
    INDEX idx_token (token(255)),
    INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Cleanup old tokens (run periodically)
-- DELETE FROM jwt_blacklist WHERE expires_at < NOW();
