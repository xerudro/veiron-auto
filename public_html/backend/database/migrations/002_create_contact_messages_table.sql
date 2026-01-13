-- Migration: Add contact_messages table
-- Created: 2026-01-13
-- Description: Table for storing contact form submissions

USE veironau1_newsite;

-- =====================================================
-- CONTACT MESSAGES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS contact_messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(255),
    message TEXT NOT NULL,

    -- Status tracking
    status ENUM('new', 'read', 'replied', 'archived', 'spam') DEFAULT 'new',
    replied_at TIMESTAMP NULL,
    replied_by INT,

    -- Metadata
    ip_address VARCHAR(45),
    user_agent TEXT,
    language VARCHAR(2) DEFAULT 'ro',
    source_page VARCHAR(255), -- Which page they submitted from

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (replied_by) REFERENCES users(id) ON DELETE SET NULL,

    INDEX idx_email (email),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    FULLTEXT idx_message_content (subject, message)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- VIEW FOR UNREAD MESSAGES
-- =====================================================

CREATE OR REPLACE VIEW unread_contact_messages AS
SELECT
    id,
    name,
    email,
    phone,
    subject,
    LEFT(message, 100) as message_preview,
    created_at
FROM contact_messages
WHERE status = 'new'
ORDER BY created_at DESC;
