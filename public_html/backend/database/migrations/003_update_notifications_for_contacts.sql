-- Migration: Update notifications table to support contact messages
-- Created: 2026-01-13
-- Description: Add columns to support both booking and contact message notifications

USE veironau1_to;

-- =====================================================
-- UPDATE NOTIFICATIONS TABLE
-- =====================================================

-- Add contact_message_id column
ALTER TABLE notifications
ADD COLUMN contact_message_id INT NULL AFTER booking_id,
ADD COLUMN notification_category ENUM('booking', 'contact_message', 'system') DEFAULT 'booking' AFTER notification_type;

-- Add foreign key for contact_message_id
ALTER TABLE notifications
ADD CONSTRAINT fk_contact_message
FOREIGN KEY (contact_message_id) REFERENCES contact_messages(id) ON DELETE CASCADE;

-- Add index for contact_message_id
CREATE INDEX idx_contact_message_id ON notifications(contact_message_id);

-- Add index for notification_category
CREATE INDEX idx_notification_category ON notifications(notification_category);

-- Make booking_id nullable (since some notifications are for contact messages, not bookings)
ALTER TABLE notifications
MODIFY COLUMN booking_id INT NULL;

-- =====================================================
-- UPDATE VIEW FOR UNREAD NOTIFICATIONS
-- =====================================================

CREATE OR REPLACE VIEW unread_notifications AS
SELECT
    n.id,
    n.notification_type,
    n.notification_category,
    n.recipient,
    n.subject,
    n.status,
    n.created_at,
    CASE
        WHEN n.notification_category = 'booking' THEN CONCAT('Booking #', b.booking_number)
        WHEN n.notification_category = 'contact_message' THEN CONCAT('Contact from ', cm.name)
        ELSE 'System Notification'
    END as notification_title,
    b.booking_number,
    cm.name as contact_name,
    cm.email as contact_email
FROM notifications n
LEFT JOIN bookings b ON n.booking_id = b.id
LEFT JOIN contact_messages cm ON n.contact_message_id = cm.id
WHERE n.status IN ('pending', 'sent')
ORDER BY n.created_at DESC;
