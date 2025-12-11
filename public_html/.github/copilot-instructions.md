# VEIRONAUTO Copilot Instructions

## Project Overview
VEIRONAUTO is a car rental platform with multi-language support (English/Romanian) built with PHP backend, MariaDB database, and vanilla JavaScript frontend. The system is organized into two packages: a static frontend site and a full-stack backend API.

## Architecture
- **Frontend Package**: Static HTML/CSS/JS site in `frontend/` - can run standalone or integrate with backend
- **Backend Package**: PHP 8.1+ API in `backend/` with MVC framework (controllers, models, services)
- **Database**: MariaDB/MySQL with complex schema including cars, bookings, users, currency rates
- **API**: RESTful with JWT authentication and role-based access (admin/manager/staff)
- **Services**: Email notifications (PHPMailer), booking management, image handling

## Key Components
- `backend/api/v1/index.php` - Main API entry point with routing
- `backend/api/controllers/CarController.php` - Car CRUD operations with filtering/pagination
- `backend/api/models/Car.php` - Database operations with complex queries
- `backend/services/BookingService.php` - Booking logic with transactions
- `backend/libs/EmailService.php` - Email sending via PHPMailer
- `backend/database/schema.sql` - Complete database schema with 11+ tables
- `frontend/assets/js/api-client.js` - Optional backend integration for frontend

## Critical Workflows
- **Frontend Setup**: Upload `frontend/` contents to web root for static site
- **Backend Setup**: Copy `backend/.env.example` to `.env`, run `php backend/database/migrate.php`
- **Development**: Use `php -S localhost:8000` for backend API testing
- **Database**: Connect via PDO in `backend/database/config.php`, use transactions for multi-table operations
- **API Testing**: Use curl or `backend/api/test-api.php` for endpoint validation
- **Image Upload**: Handled by `ImageUploadHandler` with thumbnail generation in `backend/uploads/`

## Project-Specific Patterns
- **API Responses**: Use `Response::success()`/`Response::error()` for standardized JSON
- **Database**: Always use prepared statements with PDO, filter null values in queries
- **Authentication**: JWT tokens with blacklist, check via `Auth::user()`
- **File Includes**: `require_once __DIR__ . '/../relative/path.php'` for all dependencies
- **Error Handling**: Try-catch blocks with `Response::error()` for API failures
- **Image Management**: Automatic thumbnail creation (200x150, 400x300, 800x600) on upload
- **Currency**: Dual EUR/RON pricing with conversion rates table
- **Bookings**: Complex lifecycle with services, notifications, and status tracking
- **Frontend-Backend Integration**: `api-client.js` auto-detects backend availability, falls back to static data

## Pricing System Conventions
- **Data Storage**: Prices stored in EUR in `frontend/assets/json/car-pricing-data.json`
- **Display Logic**: JavaScript converts EUR to RON (× 5.07) for Romanian users
- **Critical Warning**: Never double-convert EUR→RON→RON - this causes 5x price inflation
- **Pricing Tiers**: tier1, tier2, tier3, tier4 (daily rates in EUR)
- **JavaScript Config**: Prices in `frontend/assets/js/booking.js` and `booking-en.js` must be in EUR only
- **Debugging**: Check console for pricing calculations, verify against JSON source

## Image Management Conventions
- **Image Mapping**: Model IDs mapped to images in `carImageMap` (separate RO/EN versions)
- **Configuration Files**: 
  - `frontend/assets/js/parc-auto.js` (RO) and `parc-auto-en.js` (EN) for fleet page
  - `frontend/assets/js/booking.js` (RO) and `booking-en.js` (EN) for booking page
- **Gallery Config**: `CAR_MODELS` object defines image galleries with `isDirectImage` flag
- **Fallback System**: `CAR_IMAGE_FALLBACKS` provides backup images when primary fails
- **Debugging**: Check F12 console for `⚠️ No specific image found` warnings, Network tab for 404s
- **File Verification**: Use `ls -la "assets/images/cars/[model]/"` to check image existence

## Debugging Patterns
- **Console Logging**: Use F12 → Console tab for JavaScript errors and warnings
- **Network Tab**: Check for 404 errors on missing images or API calls
- **File Verification**: Use terminal commands to verify file existence before debugging
- **Price Issues**: Compare JavaScript pricing against `car-pricing-data.json` source
- **Image Issues**: Check `carImageMap` configuration and file paths

## Conventions Differing from Standards
- **Config Loading**: Environment variables loaded via custom `DotEnv.php`, not dotenv library
- **Database Connection**: Global `getDBConnection()` function, not dependency injection
- **Routing**: Custom `Router` class with closures, not framework-based routing
- **Models**: Direct SQL queries in methods, not ORM abstractions
- **Services**: Business logic in service classes with PDO transactions
- **Frontend**: No build tools, direct HTML/JS with UIkit for styling
- **Package Structure**: Two-package system (frontend/backend) for flexible deployment
- **Multi-language**: Separate HTML/JS files for RO/EN instead of i18n frameworks

## Integration Points
- **Email**: Configured in `backend/config/email.php`, uses PHPMailer with SMTP
- **Database**: Foreign keys and indexes for performance, triggers for audit logging
- **Uploads**: Images stored in `backend/uploads/cars/` with thumbnails in subfolders
- **Multi-language**: Separate HTML files (index-en.html, index-ro.html) with shared assets
- **API Client**: Frontend can optionally connect to backend API via `api-client.js`

## Examples
- **Creating API Endpoint**: Add route in `backend/api/v1/index.php`, implement in controller with `Response::success()`
- **Database Query**: Use `$this->pdo->prepare()`, bind params, execute in model methods
- **Service Transaction**: `$this->pdo->beginTransaction()`, commit/rollback in try-catch
- **Image Upload**: Validate file type/size, create thumbnails, store paths in database
- **Frontend-Backend Integration**: Include `api-client.js`, call `new VeironautoAPI('/backend/api/v1')`
- **Adding New Car**: Update `car-pricing-data.json`, then `carImageMap` in both RO/EN JS files
- **Fixing Pricing**: Ensure JavaScript prices are in EUR only, never pre-converted RON values

Reference: `backend/api/controllers/CarController.php` for controller patterns, `backend/api/models/Car.php` for model queries, `backend/services/BookingService.php` for service logic.