# Environment Configuration Setup 🔐

## Overview
All sensitive credentials are now stored in `.env` file for security.

---

## 🚀 Quick Setup

### 1. Copy Template
```bash
cp .env.example .env
```

### 2. Edit Configuration
Open `.env` and update with your actual credentials:

```bash
# Edit .env
nano .env
# or
code .env
```

### 3. Verify Configuration
```bash
php -r "require 'config/DotEnv.php'; DotEnv::load('.env'); echo 'Database: ' . DotEnv::get('DB_NAME') . PHP_EOL;"
```

---

## 📋 Configuration Files Updated

The following files now read from `.env`:

### 1. Database Configuration
**File:** `database/config.php`
**Reads:**
- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASS`
- `DB_CHARSET`
- `DB_COLLATION`

### 2. Email Configuration
**File:** `config/email.php`
**Reads:**
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USERNAME`
- `SMTP_PASSWORD`
- `SMTP_ENCRYPTION`
- `SMTP_FROM_EMAIL`
- `SMTP_FROM_NAME`
- `SMTP_DEBUG`
- `ADMIN_EMAIL`

### 3. API Configuration
**File:** `config/api.php`
**Reads:**
- `APP_ENV`
- `APP_DEBUG`
- `API_VERSION`
- `JWT_SECRET`
- `JWT_ALGORITHM`
- `JWT_EXPIRATION`
- `JWT_REFRESH_EXPIRATION`
- `UPLOAD_MAX_SIZE`
- `UPLOAD_ALLOWED_TYPES`
- `RATE_LIMIT_PUBLIC`
- `RATE_LIMIT_AUTHENTICATED`
- `RATE_LIMIT_UPLOAD`
- `CORS_ALLOWED_ORIGINS`
- `CORS_MAX_AGE`
- `PAGINATION_DEFAULT_LIMIT`
- `PAGINATION_MAX_LIMIT`

---

## 🔒 Security Best Practices

### ✅ DO:
- Keep `.env` file outside version control (already in `.gitignore`)
- Use strong, unique passwords
- Change `JWT_SECRET` to a random string
- Use different credentials for development and production
- Regularly rotate passwords
- Set `APP_DEBUG=false` in production
- Use `APP_ENV=production` in production

### ❌ DON'T:
- Never commit `.env` to Git
- Never share `.env` file publicly
- Never use default passwords in production
- Never expose `.env` through web server

---

## 🔄 Migrating from Old Configuration

All hardcoded credentials have been removed from:
- ✅ `database/config.php` - Now reads from `.env`
- ✅ `config/email.php` - Now reads from `.env`
- ✅ `config/api.php` - Now reads from `.env`

**Your current credentials are already in `.env`** - everything should work without changes!

---

## 🧪 Testing

### Test Database Connection
```bash
php -r "
require 'database/config.php';
if (testDBConnection()) {
    echo 'Database connection successful!' . PHP_EOL;
} else {
    echo 'Database connection failed!' . PHP_EOL;
}
"
```

### Test Email Configuration
```bash
php test_email_simple.php
```

### Test API
```bash
curl http://localhost/api/v1/health
```

---

## 🌍 Environment-Specific Configuration

### Development (.env)
```env
APP_ENV=development
APP_DEBUG=true
SMTP_DEBUG=2
LOG_LEVEL=debug
```

### Production (.env)
```env
APP_ENV=production
APP_DEBUG=false
SMTP_DEBUG=0
LOG_LEVEL=error
SESSION_SECURE_COOKIE=true
```

---

## 📝 Adding New Variables

### 1. Add to .env
```env
NEW_VARIABLE=value
```

### 2. Add to .env.example
```env
NEW_VARIABLE=example_value
```

### 3. Use in Code
```php
require_once 'config/DotEnv.php';
DotEnv::load('.env');

$value = DotEnv::get('NEW_VARIABLE', 'default');
```

---

## 🔧 DotEnv Parser

**Location:** `config/DotEnv.php`

**Methods:**
- `DotEnv::load($filePath)` - Load .env file
- `DotEnv::get($key, $default)` - Get variable
- `DotEnv::has($key)` - Check if variable exists

**Features:**
- Simple, lightweight (no dependencies)
- Supports comments (#)
- Supports quotes (" and ')
- Default values
- Environment variable support

---

## 🚨 Troubleshooting

### Error: ".env file not found"
**Solution:** Copy `.env.example` to `.env`
```bash
cp .env.example .env
```

### Error: "Undefined constant DB_HOST"
**Solution:** Ensure `.env` file exists and contains `DB_HOST`

### Database Connection Failed
**Solution:** Check credentials in `.env`:
```bash
grep DB_ .env
```

### Email Not Sending
**Solution:** Check SMTP credentials in `.env`:
```bash
grep SMTP_ .env
```

---

## 📦 Deployment Checklist

Before deploying to production:

- [ ] Copy `.env.example` to `.env` on server
- [ ] Update all credentials in `.env`
- [ ] Set `APP_ENV=production`
- [ ] Set `APP_DEBUG=false`
- [ ] Generate strong `JWT_SECRET`
- [ ] Update `CORS_ALLOWED_ORIGINS`
- [ ] Set proper file permissions (600 for .env)
- [ ] Verify `.env` is not accessible via web

---

## 🔐 File Permissions

```bash
# Secure .env file (read/write for owner only)
chmod 600 .env

# Verify permissions
ls -la .env
# Should show: -rw------- (600)
```

---

**✅ Configuration is now secure and environment-agnostic!**
