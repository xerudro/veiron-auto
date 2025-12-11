# Project Restructure Plan - Two Package System

## Overview
Reorganizare proiect VEIRONAUTO pentru a permite vânzarea în două variante:
1. **Frontend Static Package** - Site static fără backend
2. **Full Stack Package** - Site complet cu backend API

## Current Structure Analysis

### Frontend Files (Static)
```
├── index-ro.html
├── index-en.html
├── booking.html
├── booking-en.html
├── contact.html
├── contact-en.html
├── parc-auto.html
├── parc-auto-en.html
├── despre-noi.html
├── about-us.html
├── politica-de-confidentialitate.html
├── privacy-policy.html
├── termeni-si-conditii.html
├── assets/
│   ├── css/
│   ├── js/
│   ├── images/
│   ├── json/
│   ├── libs/
│   └── docs/
└── admin/ (future Vue.js dashboard)
```

### Backend Files (API & Services)
```
├── api/
│   ├── v1/
│   ├── core/
│   ├── models/
│   ├── controllers/
│   ├── handlers/
│   ├── middleware/
│   └── .htaccess
├── config/
│   ├── api.php
│   ├── email.php
│   └── DotEnv.php
├── database/
│   ├── config.php
│   ├── schema.sql
│   ├── migrations/
│   └── seed/
├── libs/
│   └── EmailService.php
├── services/
│   ├── BookingService.php
│   └── BookingNotificationService.php
├── vendor/
├── uploads/
├── logs/
├── .env
├── .env.example
├── .gitignore
└── composer.json
```

## New Proposed Structure

```
veironauto-project/
│
├── README.md                      # Main project overview
├── LICENSE                        # License file
├── CHANGELOG.md                   # Version history
│
├── frontend/                      # 📦 STATIC SITE PACKAGE
│   ├── index.html                 # Renamed from index-ro.html (default)
│   ├── index-en.html
│   ├── booking.html
│   ├── booking-en.html
│   ├── contact.html
│   ├── contact-en.html
│   ├── fleet.html                 # Renamed from parc-auto.html
│   ├── fleet-en.html              # Renamed from parc-auto-en.html
│   ├── about.html                 # Renamed from despre-noi.html
│   ├── about-en.html              # Renamed from about-us.html
│   ├── privacy-policy.html        # Renamed from politica-de-confidentialitate.html
│   ├── privacy-policy-en.html
│   ├── terms.html                 # Renamed from termeni-si-conditii.html
│   ├── terms-en.html
│   ├── assets/
│   │   ├── css/
│   │   ├── js/
│   │   │   ├── app.js             # Main frontend JS
│   │   │   ├── api-client.js      # Optional API integration
│   │   │   └── mock-data.js       # Mock data for static version
│   │   ├── images/
│   │   ├── json/                  # Static data files
│   │   ├── libs/
│   │   └── docs/
│   ├── admin/                     # Future Vue.js admin dashboard
│   │   └── index.html
│   ├── .htaccess                  # Static site redirects
│   ├── README.md                  # Frontend installation guide
│   └── STATIC_SETUP.md            # Static site setup instructions
│
└── backend/                       # 🔧 API & SERVICES PACKAGE
    ├── api/
    │   ├── v1/
    │   │   ├── index.php          # Main API router
    │   │   └── endpoints/
    │   ├── core/
    │   │   ├── Request.php
    │   │   ├── Response.php
    │   │   ├── Router.php
    │   │   └── Auth.php
    │   ├── models/
    │   │   └── Car.php
    │   ├── controllers/
    │   │   └── CarController.php
    │   ├── handlers/
    │   │   └── ImageUploadHandler.php
    │   ├── middleware/
    │   └── .htaccess
    ├── config/
    │   ├── api.php
    │   ├── email.php
    │   └── DotEnv.php
    ├── database/
    │   ├── config.php
    │   ├── schema.sql
    │   ├── migrations/
    │   │   └── add_jwt_blacklist.sql
    │   └── seed/
    │       └── sample_data.sql
    ├── libs/
    │   └── EmailService.php
    ├── services/
    │   ├── BookingService.php
    │   └── BookingNotificationService.php
    ├── vendor/
    │   └── phpmailer/
    ├── uploads/                   # File uploads directory
    │   ├── cars/
    │   ├── gallery/
    │   ├── temp/
    │   └── thumbnails/
    ├── logs/                      # Application logs
    │   └── api/
    ├── tests/                     # Test files
    │   ├── test_cars_api.php
    │   ├── test_cars_direct.php
    │   ├── test_email_simple.php
    │   ├── test_booking_notification.php
    │   └── test_env_config.php
    ├── docs/                      # API Documentation
    │   ├── API_DOCUMENTATION.md
    │   ├── PHASE_1_CORE_API.md
    │   ├── PHASE_2_CARS_API.md
    │   ├── EMAIL_SYSTEM_README.md
    │   └── ENV_SETUP.md
    ├── .env.example               # Environment template
    ├── .gitignore
    ├── composer.json
    ├── composer.lock
    ├── README.md                  # Backend installation guide
    └── API_ENDPOINTS.md           # Quick API reference
```

## Integration Modes

### Mode 1: Static Site Only (Frontend Package)
- Uses `mock-data.js` for car listings
- No backend required
- Forms submit to email directly (or external service)
- Perfect for simple presentations

### Mode 2: Full Stack (Frontend + Backend Package)
- Frontend calls backend API
- `api-client.js` handles all API communication
- Real-time data from database
- Full booking system
- Image management
- Admin dashboard

## Configuration Files

### Frontend Configuration (`frontend/assets/js/config.js`)
```javascript
const APP_CONFIG = {
    // API Configuration
    API_ENABLED: false,              // Toggle API integration
    API_BASE_URL: '/backend/api/v1', // Backend API URL

    // Mode
    MODE: 'static',                  // 'static' or 'api'

    // Static data file
    STATIC_DATA_URL: '/assets/json/cars.json',

    // Language
    DEFAULT_LANG: 'ro',

    // Contact
    CONTACT_EMAIL: 'contact@veironauto.com',
    CONTACT_PHONE: '+40 123 456 789'
};
```

### Backend Configuration (`.env`)
```env
# Application
APP_ENV=production
APP_DEBUG=false

# Database
DB_HOST=localhost
DB_NAME=veironauto
DB_USER=root
DB_PASS=password

# API
JWT_SECRET=your-secret-key
API_VERSION=1.0

# Email
SMTP_HOST=mail.veironauto.com
SMTP_PORT=465
SMTP_USERNAME=noreply@veironauto.com
SMTP_PASSWORD=password
```

## Migration Steps

### Step 1: Create New Directory Structure
```bash
mkdir -p frontend backend
mkdir -p backend/{api,config,database,libs,services,vendor,uploads,logs,tests,docs}
mkdir -p frontend/assets/{css,js,images,json,libs,docs}
```

### Step 2: Move Frontend Files
```bash
# HTML files
mv *.html frontend/

# Assets
mv assets/* frontend/assets/

# Admin (if exists)
mv admin frontend/
```

### Step 3: Move Backend Files
```bash
# API
mv api backend/

# Configuration
mv config backend/

# Database
mv database backend/

# Services
mv libs backend/
mv services backend/

# Dependencies
mv vendor backend/
mv composer.json backend/
mv composer.lock backend/

# Uploads
mv uploads backend/

# Logs
mv logs backend/

# Environment
mv .env backend/
mv .env.example backend/
mv .gitignore backend/

# Tests
mv test_*.php backend/tests/

# Documentation
mv *.md backend/docs/
```

### Step 4: Update File Paths

#### Backend files that need path updates:
1. `backend/api/v1/index.php` - Update all require_once paths
2. `backend/api/controllers/*.php` - Update model/handler paths
3. `backend/api/models/*.php` - Update database config path
4. `backend/config/*.php` - Update DotEnv path
5. `backend/libs/*.php` - Update vendor paths
6. `backend/services/*.php` - Update libs paths

#### Frontend files that need updates:
1. All HTML files - Update asset paths
2. `frontend/assets/js/app.js` - Add API client option
3. Create `frontend/assets/js/api-client.js` - API integration layer
4. Create `frontend/assets/js/mock-data.js` - Static data

### Step 5: Create API Client for Frontend

`frontend/assets/js/api-client.js`:
```javascript
class VeironautoAPI {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
        this.token = localStorage.getItem('auth_token');
    }

    async getCars(filters = {}) {
        const params = new URLSearchParams(filters);
        const response = await fetch(`${this.baseUrl}/cars?${params}`);
        return response.json();
    }

    async getCarById(id) {
        const response = await fetch(`${this.baseUrl}/cars/${id}`);
        return response.json();
    }

    async checkAvailability(carId, startDate, endDate) {
        const params = new URLSearchParams({ start_date: startDate, end_date: endDate });
        const response = await fetch(`${this.baseUrl}/cars/${carId}/availability?${params}`);
        return response.json();
    }

    // ... more methods
}
```

### Step 6: Create Mock Data for Static Version

`frontend/assets/json/cars.json`:
```json
{
    "cars": [
        {
            "id": 1,
            "brand": "Toyota",
            "model": "Avensis Combi",
            "year": 2024,
            "price_per_day": 45.00,
            "images": ["/assets/images/cars/toyota-avensis-1.jpg"],
            "transmission": "automatic",
            "fuel_type": "diesel"
        }
    ]
}
```

## Package Documentation

### Frontend Package README
- Installation instructions
- Asset structure
- Configuration options
- How to enable API integration
- Customization guide

### Backend Package README
- System requirements
- Installation steps
- Database setup
- Environment configuration
- API documentation link
- Testing instructions

## Deployment Scenarios

### Scenario 1: Static Only
```
website.com/
└── [all frontend files]
```

### Scenario 2: Full Stack (Same Domain)
```
website.com/
├── [frontend files]
└── backend/
    └── [backend files]
```

### Scenario 3: Separate Domains
```
www.website.com/        → Frontend
api.website.com/        → Backend
```

## Benefits of This Structure

### For Static Package Buyers
✅ Simple deployment (just upload HTML/CSS/JS)
✅ No server requirements (can use GitHub Pages, Netlify, etc.)
✅ Fast loading times
✅ Easy to customize
✅ Lower cost

### For Full Stack Package Buyers
✅ Complete car rental management system
✅ Real-time availability checking
✅ Booking management
✅ Admin dashboard
✅ Professional REST API
✅ Scalable architecture

### For You (Developer/Seller)
✅ Two products from one codebase
✅ Easy to maintain
✅ Clear separation of concerns
✅ Professional package structure
✅ Better for portfolio
✅ Higher value proposition

## Next Steps

1. ✅ Create directory structure
2. ⏳ Move files to new locations
3. ⏳ Update all file paths
4. ⏳ Create API client for frontend
5. ⏳ Create mock data for static version
6. ⏳ Write package documentation
7. ⏳ Test both versions
8. ⏳ Create demo sites for both packages
9. ⏳ Prepare for sale

## Pricing Suggestion

- **Static Package**: €49-99 (One-time)
- **Full Stack Package**: €199-499 (One-time)
- **Full Stack + Support**: €299-699 (With 6 months support)

---

**Status**: 📋 Plan Ready - Awaiting Approval
**Next**: Implement restructure after user confirmation
