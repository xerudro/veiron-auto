# VEIRONAUTO - Backend Package (API & Services)

Professional REST API for car rental management system

## 📦 Package Contents

- ✅ Complete REST API (v1)
- ✅ JWT Authentication
- ✅ Car management (CRUD operations)
- ✅ Booking system
- ✅ Image upload with thumbnails
- ✅ Email notifications
- ✅ Role-based access control
- ✅ Database schema & migrations
- ✅ Comprehensive documentation

## 🚀 Quick Start

### System Requirements

- PHP 7.4+ or 8.0+ (8.3 recommended)
- MySQL 5.7+ or MariaDB 10.2+
- Apache or Nginx
- Composer
- OpenSSL extension
- GD or Imagick extension (for image processing)
- PDO extension
- mbstring extension

### Installation

1. **Upload Backend Files**

```bash
# Upload the backend/ folder to your server
# Example location: /home/username/backend/
```

2. **Configure Environment**

```bash
cp .env.example .env
nano .env  # Edit with your credentials
```

**Important settings in .env:**

```env
# Database
DB_HOST=your-database-host
DB_NAME=your-database-name
DB_USER=your-database-user
DB_PASS=your-database-password

# Email/SMTP
SMTP_HOST=mail.yourdomain.com
SMTP_PORT=465
SMTP_USERNAME=noreply@yourdomain.com
SMTP_PASSWORD=your-smtp-password
ADMIN_EMAIL=admin@yourdomain.com

# JWT Secret (CHANGE THIS!)
JWT_SECRET=your-random-secret-key-change-this

# API Configuration
APP_ENV=production
APP_DEBUG=false
```

3. **Install Dependencies**

```bash
cd backend
composer install
```

4. **Setup Database**

```bash
# Import the schema
mysql -u your_user -p your_database < database/schema.sql

# Or use phpMyAdmin/Adminer to import database/schema.sql
```

5. **Configure Web Server**

**Apache (.htaccess)**

The `.htaccess` file is already configured. Make sure `mod_rewrite` is enabled:

```bash
sudo a2enmod rewrite
sudo systemctl restart apache2
```

**Nginx**

Add to your nginx configuration:

```nginx
location /backend/api/ {
    try_files $uri $uri/ /backend/api/v1/index.php?$query_string;
}
```

6. **Set Permissions**

```bash
chmod 755 backend/
chmod 644 backend/.env
chmod 755 backend/uploads/
chmod 755 backend/logs/
```

7. **Test Installation**

```bash
php tests/test_env_config.php
```

Expected output:
```
✅ .env file loaded successfully
✅ Database connection successful
✅ Email config loaded
✅ API config loaded
✅ All tests passed!
```

8. **Test API**

Visit: `https://yourdomain.com/backend/api/v1/health`

Expected response:
```json
{
  "success": true,
  "message": "API is running",
  "data": {
    "status": "healthy",
    "version": "1.0.0",
    "timestamp": "2025-12-11T10:30:00+00:00"
  }
}
```

## 📁 Directory Structure

```
backend/
├── api/                       # API Core
│   ├── v1/
│   │   ├── index.php         # Main router
│   │   └── endpoints/
│   ├── core/
│   │   ├── Request.php       # HTTP request handler
│   │   ├── Response.php      # JSON response formatter
│   │   ├── Router.php        # RESTful router
│   │   └── Auth.php          # JWT authentication
│   ├── models/
│   │   └── Car.php           # Car database model
│   ├── controllers/
│   │   └── CarController.php # Car HTTP controller
│   ├── handlers/
│   │   └── ImageUploadHandler.php  # Image upload & resize
│   ├── middleware/           # Request middleware (future)
│   └── .htaccess            # Apache URL rewriting
│
├── config/
│   ├── api.php              # API configuration
│   ├── email.php            # Email configuration
│   └── DotEnv.php           # Environment loader
│
├── database/
│   ├── config.php           # Database connection
│   ├── schema.sql           # Complete database schema
│   ├── migrations/          # Database migrations
│   │   └── add_jwt_blacklist.sql
│   └── seed/                # Sample data (optional)
│
├── libs/
│   └── EmailService.php     # Email sending service
│
├── services/
│   ├── BookingService.php   # Booking business logic
│   └── BookingNotificationService.php  # Notifications
│
├── vendor/                  # Composer dependencies
│   └── phpmailer/          # PHPMailer 6.9.2
│
├── uploads/                 # File uploads directory
│   ├── cars/               # Car images
│   ├── gallery/            # Gallery images
│   ├── temp/               # Temporary files
│   └── thumbnails/         # Auto-generated thumbnails
│
├── logs/                    # Application logs
│   └── api/                # API request logs
│
├── tests/                   # Test scripts
│   ├── test_cars_api.php
│   ├── test_cars_direct.php
│   └── test_env_config.php
│
├── docs/                    # Documentation
│   ├── API_DOCUMENTATION.md
│   ├── PHASE_2_CARS_API.md
│   └── ENV_SETUP.md
│
├── .env                     # Environment configuration (DO NOT COMMIT)
├── .env.example            # Environment template
├── .gitignore              # Git ignore rules
├── composer.json           # PHP dependencies
└── README.md               # This file
```

## 🔌 API Endpoints

### Public Endpoints (No Authentication)

```
GET    /api/v1/health                      # API health check
GET    /api/v1/cars                        # Get all cars
GET    /api/v1/cars/brands                 # Get car brands
GET    /api/v1/cars/{id}                   # Get car details
GET    /api/v1/cars/{id}/availability      # Check availability
GET    /api/v1/cars/{id}/images            # Get car images
POST   /api/v1/auth/login                  # Login
POST   /api/v1/auth/logout                 # Logout
```

### Protected Endpoints (Admin Only)

```
POST   /api/v1/cars                        # Create car
PUT    /api/v1/cars/{id}                   # Update car (full)
DELETE /api/v1/cars/{id}                   # Delete car
GET    /api/v1/cars/stats                  # Get statistics
```

### Protected Endpoints (Manager+)

```
PATCH  /api/v1/cars/{id}                   # Update car (partial)
POST   /api/v1/cars/{id}/images            # Upload image
DELETE /api/v1/cars/{id}/images/{imageId}  # Delete image
PATCH  /api/v1/cars/{id}/images/{imageId}/primary  # Set primary
```

## 📖 API Usage Examples

### Get All Cars

```bash
curl https://yourdomain.com/backend/api/v1/cars
```

### Get Cars with Filters

```bash
curl "https://yourdomain.com/backend/api/v1/cars?brand=Toyota&transmission=automatic&sort_by=price_per_day"
```

### Check Availability

```bash
curl "https://yourdomain.com/backend/api/v1/cars/1/availability?start_date=2025-12-20&end_date=2025-12-27"
```

### Login

```bash
curl -X POST https://yourdomain.com/backend/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"your-password"}'
```

### Create Car (Admin)

```bash
curl -X POST https://yourdomain.com/backend/api/v1/cars \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "brand": "Toyota",
    "model": "RAV4",
    "year": 2024,
    "color": "White",
    "registration_number": "B123ABC",
    "fuel_type": "hybrid",
    "transmission": "automatic",
    "seats": 5,
    "doors": 5,
    "price_per_day": 100.00,
    "deposit_amount": 300.00
  }'
```

## 🔒 Security

### Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. Login via `/api/v1/auth/login`
2. Receive JWT token
3. Include token in `Authorization: Bearer TOKEN` header
4. Token expires after 24 hours (configurable)

### Role-Based Access

Three user roles:
- **Admin**: Full access (create, update, delete)
- **Manager**: Limited admin access (update, image management)
- **Staff**: View only

Role hierarchy: `staff < manager < admin`

### Security Features

- ✅ JWT token authentication
- ✅ Token blacklist (logout)
- ✅ SQL injection prevention (prepared statements)
- ✅ XSS protection
- ✅ CORS configuration
- ✅ File upload validation
- ✅ Rate limiting (configurable)
- ✅ Input sanitization

## 📧 Email Configuration

The system sends email notifications for:
- New bookings
- Booking confirmations
- Booking cancellations
- Admin notifications

**Setup:**

1. Configure SMTP in `.env`:

```env
SMTP_HOST=mail.yourdomain.com
SMTP_PORT=465
SMTP_USERNAME=noreply@yourdomain.com
SMTP_PASSWORD=your-password
SMTP_ENCRYPTION=ssl
```

2. Test email:

```bash
php tests/test_email_simple.php
```

## 🖼️ Image Management

### Upload Configuration

Edit `.env`:

```env
UPLOAD_MAX_SIZE=5242880           # 5MB in bytes
UPLOAD_ALLOWED_TYPES=jpg,jpeg,png,webp
THUMBNAIL_SMALL=200,150           # Width,Height
THUMBNAIL_MEDIUM=400,300
THUMBNAIL_LARGE=800,600
```

### Features

- ✅ Automatic thumbnail generation (3 sizes)
- ✅ Image validation (size, type, MIME)
- ✅ Maintains transparency (PNG/WebP)
- ✅ Aspect ratio preservation
- ✅ Secure file naming
- ✅ Organized storage structure

### Image Upload

```bash
curl -X POST https://yourdomain.com/backend/api/v1/cars/1/images \
  -H "Authorization: Bearer TOKEN" \
  -F "image=@/path/to/image.jpg" \
  -F "is_primary=true"
```

## 🗄️ Database Management

### Backup

```bash
mysqldump -u your_user -p your_database > backup_$(date +%Y%m%d).sql
```

### Restore

```bash
mysql -u your_user -p your_database < backup_20251211.sql
```

### Migrations

Located in `database/migrations/`. Apply manually or through migration tool.

## 🧪 Testing

### Run All Tests

```bash
php tests/test_env_config.php      # Test environment
php tests/test_cars_direct.php     # Test car model
php tests/test_email_simple.php    # Test email
```

### Manual Testing

Use tools like:
- Postman
- Insomnia
- cURL
- Browser DevTools

## 📊 Monitoring & Logs

### Application Logs

Located in `logs/` directory:

- `logs/api/` - API request logs
- Error logs - PHP error_log

### Enable Logging

In `.env`:

```env
APP_DEBUG=true              # Show detailed errors
API_LOG_REQUESTS=true       # Log all requests
```

**⚠️ Disable in production!**

## 🔄 Updates & Maintenance

### Updating Dependencies

```bash
composer update
```

### Database Schema Updates

1. Review changes in `database/migrations/`
2. Backup database
3. Apply migration:

```bash
mysql -u user -p database < database/migrations/migration_file.sql
```

## 🚢 Deployment

### Production Checklist

- [ ] Set `APP_ENV=production` in `.env`
- [ ] Set `APP_DEBUG=false` in `.env`
- [ ] Generate strong `JWT_SECRET`
- [ ] Configure HTTPS/SSL
- [ ] Set proper file permissions
- [ ] Configure firewall
- [ ] Enable rate limiting
- [ ] Setup automated backups
- [ ] Configure monitoring
- [ ] Test all endpoints
- [ ] Setup error logging

### Recommended Hosting

- VPS (Digital Ocean, Linode, Vultr)
- Shared hosting with PHP 7.4+
- Cloud hosting (AWS, Google Cloud)

### Performance Optimization

1. Enable OPcache
2. Use Redis for caching (optional)
3. Configure MySQL query cache
4. Enable Gzip compression
5. Use CDN for images

## 🆘 Troubleshooting

### Issue: 500 Internal Server Error

**Solution:**
- Check PHP error logs
- Verify `.htaccess` configuration
- Ensure `mod_rewrite` is enabled
- Check file permissions

### Issue: Database Connection Failed

**Solution:**
- Verify credentials in `.env`
- Check if database exists
- Verify MySQL is running
- Check firewall rules

### Issue: JWT Token Invalid

**Solution:**
- Verify `JWT_SECRET` in `.env`
- Check token expiration
- Ensure token isn't blacklisted
- Verify Authorization header format

### Issue: Email Not Sending

**Solution:**
- Verify SMTP credentials
- Check OpenSSL extension
- Test SMTP connection
- Review email logs

### Issue: Image Upload Fails

**Solution:**
- Check upload directory permissions
- Verify GD extension is installed
- Check file size limits
- Verify allowed file types

## 📞 Support

For technical support:
- Email: support@veironauto.com
- Documentation: See `docs/` folder
- API Documentation: `docs/API_DOCUMENTATION.md`

## 📄 License

This backend is sold as-is with full rights to modify and use commercially.

---

**Version**: 1.0.0 (Phase 2 Complete)
**Last Updated**: December 2025
**Developed by**: VEIRONAUTO Development Team

**Next Phases**:
- Phase 3: Bookings API
- Phase 4: Clients API
- Phase 5: Payments API
- Phase 6: Admin Dashboard
