# VEIRONAUTO Copilot Instructions

## Project Overview
VEIRONAUTO is a car rental platform with multi-language support (English/Romanian) built with PHP backend, MariaDB database, and vanilla JavaScript frontend. The system manages a car fleet with booking, pricing, and admin dashboard functionality.

## Architecture
- **Backend**: PHP 8.1+ with custom MVC framework (controllers, models, services)
- **Database**: MariaDB/MySQL with complex schema including cars, bookings, users, currency rates
- **Frontend**: HTML5, UIkit CSS framework, vanilla JavaScript
- **API**: RESTful with JWT authentication and role-based access (admin/manager/staff)
- **Services**: Email notifications (PHPMailer), booking management, image handling

## Key Components
- `api/v1/index.php` - Main API entry point with routing
- `api/controllers/CarController.php` - Car CRUD operations with filtering/pagination
- `api/models/Car.php` - Database operations with complex queries
- `services/BookingService.php` - Booking logic with transactions
- `libs/EmailService.php` - Email sending via PHPMailer
- `database/schema.sql` - Complete database schema with 11+ tables

## Critical Workflows
- **Setup**: Copy `.env.example` to `.env`, run `php database/migrate.php`
- **Development**: Use `php -S localhost:8000` for local server
- **Database**: Connect via PDO in `database/config.php`, use transactions for multi-table operations
- **API Testing**: Use curl or `test_cars_api.php` for endpoint validation
- **Image Upload**: Handled by `ImageUploadHandler` with thumbnail generation

## Project-Specific Patterns
- **API Responses**: Use `Response::success()`/`Response::error()` for standardized JSON
- **Database**: Always use prepared statements with PDO, filter null values in queries
- **Authentication**: JWT tokens with blacklist, check via `Auth::user()`
- **File Includes**: `require_once __DIR__ . '/../relative/path.php'` for all dependencies
- **Error Handling**: Try-catch blocks with `Response::error()` for API failures
- **Image Management**: Automatic thumbnail creation (200x150, 400x300, 800x600) on upload
- **Currency**: Dual EUR/RON pricing with conversion rates table
- **Bookings**: Complex lifecycle with services, notifications, and status tracking

## Conventions Differing from Standards
- **Config Loading**: Environment variables loaded via custom `DotEnv.php`, not dotenv library
- **Database Connection**: Global `getDBConnection()` function, not dependency injection
- **Routing**: Custom `Router` class with closures, not framework-based routing
- **Models**: Direct SQL queries in methods, not ORM abstractions
- **Services**: Business logic in service classes with PDO transactions
- **Frontend**: No build tools, direct HTML/JS with UIkit for styling

## Integration Points
- **Email**: Configured in `config/email.php`, uses PHPMailer with SMTP
- **Database**: Foreign keys and indexes for performance, triggers for audit logging
- **Uploads**: Images stored in `uploads/cars/` with thumbnails in subfolders
- **Multi-language**: Separate HTML files (index-en.html, index-ro.html) with shared assets

## Examples
- **Creating API Endpoint**: Add route in `api/v1/index.php`, implement in controller with `Response::success()`
- **Database Query**: Use `$this->pdo->prepare()`, bind params, execute in model methods
- **Service Transaction**: `$this->pdo->beginTransaction()`, commit/rollback in try-catch
- **Image Upload**: Validate file type/size, create thumbnails, store paths in database

Reference: `api/controllers/CarController.php` for controller patterns, `api/models/Car.php` for model queries, `services/BookingService.php` for service logic.