# VEIRONAUTO Database Setup

This directory contains the database schema, configuration, and migration scripts for the VEIRONAUTO car rental admin system.

## Files Overview

### `schema.sql`
Complete MariaDB database schema including:
- 11 core tables with proper relationships
- Foreign key constraints and indexes
- Triggers for audit logging and business logic
- Views for common queries
- Stored procedures for complex operations
- Initial seed data

### `config.php`
Database configuration file containing:
- Connection settings (host, database, user, password)
- PDO options for secure connections
- Helper functions for database operations

### `migrate.php`
Migration script that:
- Tests database connection
- Executes the complete schema
- Verifies table creation
- Inserts default data (admin user, system settings)

## Database Requirements

- **MariaDB 10.6+** or **MySQL 8.0+**
- **Character Set**: UTF8MB4
- **Collation**: utf8mb4_unicode_ci
- **PHP 8.1+** with PDO extension

## Setup Instructions

### 1. Create Database
```sql
CREATE DATABASE veironauto_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'veironauto_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON veironauto_db.* TO 'veironauto_user'@'localhost';
FLUSH PRIVILEGES;
```

### 2. Configure Database Connection
Edit `config.php` and update the database credentials:
```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'veironauto_db');
define('DB_USER', 'veironauto_user');
define('DB_PASS', 'your_secure_password');
```

### 3. Run Migration
Execute the migration script from command line:
```bash
cd /path/to/public_html/database
php migrate.php
```

Or run via web browser (remove after setup):
```
http://your-domain/database/migrate.php
```

### 4. Verify Installation
The script will:
- ✅ Test database connection
- ✅ Execute all schema statements
- ✅ Verify table creation
- ✅ Insert default admin user (username: `admin`, password: `admin123`)
- ✅ Insert default system settings

## Default Admin Credentials

**Username:** admin
**Password:** admin123

⚠️ **IMPORTANT:** Change the default password immediately after first login!

## Database Tables

| Table | Purpose |
|-------|---------|
| `system_settings` | Application configuration |
| `users` | Admin user accounts and authentication |
| `currency_rates` | EUR/RON exchange rates with history |
| `cars` | Vehicle fleet inventory |
| `car_pricing_tiers` | Flexible pricing structures |
| `clients` | Customer database |
| `bookings` | Rental reservations and lifecycle |
| `booking_services` | Additional equipment/services |
| `notifications` | Email and WhatsApp message logs |
| `car_maintenance` | Fleet maintenance tracking |
| `audit_log` | Security and compliance logging |

## Security Notes

- Store `config.php` outside web root in production
- Use strong passwords for database users
- Enable SSL/TLS for database connections
- Regularly backup the database
- Monitor audit logs for security events

## Troubleshooting

### Connection Issues
- Verify database server is running
- Check firewall settings
- Ensure user has proper permissions
- Confirm host, port, and credentials

### Migration Errors
- Check database version compatibility
- Ensure sufficient privileges for CREATE/DROP operations
- Review error messages for specific SQL issues
- Try running individual statements manually

### Permission Issues
- Grant ALL PRIVILEGES on the database
- Ensure user can create triggers and procedures
- Check SELinux/AppArmor policies

## Next Steps

After successful database setup:
1. Proceed to **Phase 2: Backend API Development**
2. Create PHP REST API endpoints
3. Implement authentication system
4. Build admin dashboard interface

## Support

For issues with database setup, check:
- MariaDB/MySQL documentation
- PHP PDO documentation
- Server error logs
- Database server logs 