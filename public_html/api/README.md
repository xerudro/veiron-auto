# VEIRONAUTO REST API v1 🚗

## Phase 1: Core Framework - ✅ COMPLETE

Professional REST API with JWT authentication, ready for Vue.js admin dashboard.

---

## 🎯 What's Been Built

### Core Framework
- ✅ **Response.php** - Standardized JSON responses (200, 201, 400, 401, 403, 404, 422, 429, 500)
- ✅ **Request.php** - HTTP request parsing (body, query, headers, files)
- ✅ **Router.php** - RESTful routing with route parameters
- ✅ **Auth.php** - JWT authentication with blacklist
- ✅ **config/api.php** - Central configuration

### Features
- ✅ JWT token generation and validation
- ✅ Token blacklist for logout
- ✅ Role-based access control (admin, manager, staff)
- ✅ CORS support
- ✅ Error handling
- ✅ Request/Response abstraction

---

## 🚀 Quick Start

### 1. Create JWT Blacklist Table
```bash
mysql -u veironau1_admin -p veironau1_newsite < database/migrations/add_jwt_blacklist.sql
```

Or run in MySQL:
```sql
CREATE TABLE IF NOT EXISTS jwt_blacklist (
    id INT PRIMARY KEY AUTO_INCREMENT,
    token VARCHAR(500) NOT NULL,
    blacklisted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    INDEX idx_token (token(255)),
    INDEX idx_expires_at (expires_at)
);
```

### 2. Test API Endpoints

#### Health Check
```bash
curl http://localhost/api/v1/health
```

Response:
```json
{
    "success": true,
    "data": {
        "status": "healthy",
        "version": "1.0.0",
        "timestamp": "2025-12-11T08:00:00+02:00"
    },
    "message": "API is running",
    "meta": {
        "timestamp": "2025-12-11T08:00:00+02:00",
        "version": "1.0.0"
    }
}
```

#### Login (Get JWT Token)
```bash
curl -X POST http://localhost/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@veironauto.ro","password":"admin123"}'
```

Response:
```json
{
    "success": true,
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "user": {
            "id": 1,
            "username": "admin",
            "email": "admin@veironauto.ro",
            "full_name": "Administrator",
            "role": "admin"
        }
    },
    "message": "Login successful"
}
```

#### Protected Endpoint (Admin Stats)
```bash
curl http://localhost/api/v1/admin/stats \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### Logout
```bash
curl -X POST http://localhost/api/v1/auth/logout \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 📁 Directory Structure

```
api/
├── v1/
│   ├── index.php              # Main router
│   └── endpoints/             # Endpoint folders (future)
│       ├── auth/
│       ├── cars/
│       ├── bookings/
│       ├── clients/
│       └── images/
├── core/
│   ├── Request.php           # HTTP request handling
│   ├── Response.php          # JSON response formatting
│   ├── Router.php            # Route dispatcher
│   └── Auth.php              # JWT authentication
├── middleware/               # Middleware (future)
├── models/                   # Data models (future)
├── controllers/              # Controllers (future)
└── .htaccess                # URL rewriting
```

---

## 🔧 Configuration

Edit `config/api.php` to customize:

```php
// JWT Settings
define('JWT_SECRET', 'your-secret-key');
define('JWT_EXPIRATION', 86400); // 24 hours

// Upload Settings
define('UPLOAD_MAX_SIZE', 5 * 1024 * 1024); // 5MB
define('UPLOAD_ALLOWED_TYPES', ['jpg', 'jpeg', 'png', 'webp']);

// Rate Limits
define('RATE_LIMIT_PUBLIC', 60); // per minute
define('RATE_LIMIT_AUTHENTICATED', 300); // per minute

// CORS
define('CORS_ALLOWED_ORIGINS', [
    'https://veironauto.ro',
    'http://localhost:3000'
]);
```

---

## 🔐 Authentication

### JWT Token Structure
```json
{
  "sub": 1,
  "name": "Administrator",
  "email": "admin@veironauto.ro",
  "role": "admin",
  "iat": 1702217400,
  "exp": 1702303800
}
```

### Using Tokens
Include in requests:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

### Role Hierarchy
- **staff** (level 1) - Basic access
- **manager** (level 2) - Can access staff + manager endpoints
- **admin** (level 3) - Full access

---

## 📊 Current Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/v1/health` | No | API health check |
| POST | `/v1/auth/login` | No | Login and get JWT token |
| POST | `/v1/auth/logout` | Yes | Logout (blacklist token) |
| GET | `/v1/test` | No | Test endpoint |
| GET | `/v1/admin/stats` | Admin | Admin statistics (example) |
| GET | `/v1/cars` | No | List cars (placeholder) |
| GET | `/v1/cars/{id}` | No | Car details (placeholder) |
| GET | `/v1/bookings` | Yes | List bookings (placeholder) |
| POST | `/v1/bookings` | No | Create booking (placeholder) |

---

## 🎨 Response Format

### Success Response
```json
{
    "success": true,
    "data": { },
    "message": "Operation successful",
    "meta": {
        "timestamp": "2025-12-11T08:00:00+02:00",
        "version": "1.0.0"
    }
}
```

### Error Response
```json
{
    "success": false,
    "message": "Error message",
    "errors": [
        {
            "field": "email",
            "message": "Invalid email format"
        }
    ],
    "meta": {
        "timestamp": "2025-12-11T08:00:00+02:00",
        "version": "1.0.0"
    }
}
```

### Paginated Response
```json
{
    "success": true,
    "data": [ ],
    "message": "Data retrieved successfully",
    "meta": {
        "pagination": {
            "total": 100,
            "page": 1,
            "limit": 20,
            "pages": 5
        },
        "timestamp": "2025-12-11T08:00:00+02:00",
        "version": "1.0.0"
    }
}
```

---

## 🛠️ Next Steps (Phase 2)

- [ ] Implement CarController with CRUD operations
- [ ] Add car availability checking
- [ ] Implement pricing calculation endpoint
- [ ] Add filtering and pagination for cars
- [ ] Create car images API

---

## 🧪 Testing

### Manual Testing
```bash
# Start PHP built-in server
php -S localhost:8000 -t h:\VIBE CODING\VEIRONAUTO\public_html

# Test endpoints
curl http://localhost:8000/api/v1/health
```

### Postman Collection
Import the API into Postman:
- Base URL: `http://localhost/api/v1`
- Add Authorization header: `Bearer {token}`

---

## 🔒 Security

- ✅ JWT tokens with expiration
- ✅ Token blacklist on logout
- ✅ Password hashing (bcrypt)
- ✅ SQL injection prevention (PDO prepared statements)
- ✅ XSS prevention (JSON encoding)
- ✅ CORS configuration
- ✅ Security headers (.htaccess)

---

## 📝 Notes

- **Default admin:** admin@veironauto.ro / admin123 (change this!)
- **JWT Secret:** Change `JWT_SECRET` in production!
- **Debug mode:** Set `API_ENV` to 'production' when deploying
- **Database:** Ensure jwt_blacklist table is created

---

**Phase 1 Complete! ✅**
Ready for Phase 2: Cars API Implementation 🚗
