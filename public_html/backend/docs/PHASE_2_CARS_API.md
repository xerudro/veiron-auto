# Phase 2: Cars API - Implementation Complete ✅

## Overview
Phase 2 implements a complete REST API for managing cars in the VEIRONAUTO car rental system, including full CRUD operations, image management, advanced filtering, and availability checking.

## Files Created

### 1. Car Model (`api/models/Car.php`)
Complete database operations for cars:
- **getAll()** - Get all cars with filters, sorting, and pagination
- **getById()** - Get single car with images and recent bookings
- **create()** - Create new car
- **update()** - Update car (full or partial)
- **delete()** - Soft delete (sets status to 'retired')
- **hardDelete()** - Permanent deletion (use with caution)
- **isAvailable()** - Check car availability for date range
- **getCarImages()** - Get all images for a car
- **addImage()** - Add new image to car
- **deleteImage()** - Delete car image
- **setPrimaryImage()** - Set primary image for car
- **getBrands()** - Get unique list of car brands
- **getStats()** - Get car statistics (total, available, rented, etc.)

### 2. Car Controller (`api/controllers/CarController.php`)
HTTP request handlers:
- **index()** - GET /cars - List all cars with filters
- **show()** - GET /cars/{id} - Get single car
- **store()** - POST /cars - Create new car (admin only)
- **update()** - PUT /cars/{id} - Full update (admin only)
- **patch()** - PATCH /cars/{id} - Partial update (manager+)
- **destroy()** - DELETE /cars/{id} - Soft delete (admin only)
- **checkAvailability()** - GET /cars/{id}/availability - Check dates
- **getImages()** - GET /cars/{id}/images - Get car images
- **uploadImage()** - POST /cars/{id}/images - Upload image (manager+)
- **deleteImage()** - DELETE /cars/{id}/images/{imageId} - Delete image
- **setPrimaryImage()** - PATCH /cars/{id}/images/{imageId}/primary
- **getBrands()** - GET /cars/brands - Get available brands
- **getStats()** - GET /cars/stats - Get statistics (admin only)

### 3. Image Upload Handler (`api/handlers/ImageUploadHandler.php`)
Professional image handling:
- **upload()** - Upload single image with validation
- **uploadMultiple()** - Batch upload images
- **validateFile()** - Comprehensive validation (size, type, MIME)
- **createThumbnails()** - Generate small/medium/large thumbnails
- **resizeImage()** - Smart resize maintaining aspect ratio
- **deleteImage()** - Delete image and thumbnails
- **getConfig()** - Get upload configuration

Features:
- Supports JPG, PNG, WebP formats
- Automatic thumbnail generation (200x150, 400x300, 800x600)
- Image validation and security checks
- Maintains transparency for PNG/WebP
- Configurable quality settings

### 4. Updated Router (`api/v1/index.php`)
Added comprehensive car routes with proper authentication:

**Public Endpoints:**
```
GET    /v1/cars                          - Browse all cars
GET    /v1/cars/brands                   - Get available brands
GET    /v1/cars/{id}                     - View car details
GET    /v1/cars/{id}/availability        - Check availability
GET    /v1/cars/{id}/images              - View car images
```

**Protected Endpoints (Admin):**
```
POST   /v1/cars                          - Create car
PUT    /v1/cars/{id}                     - Full update
DELETE /v1/cars/{id}                     - Delete car
GET    /v1/cars/stats                    - Statistics
```

**Protected Endpoints (Manager+):**
```
PATCH  /v1/cars/{id}                     - Partial update
POST   /v1/cars/{id}/images              - Upload image
DELETE /v1/cars/{id}/images/{imageId}    - Delete image
PATCH  /v1/cars/{id}/images/{imageId}/primary - Set primary
```

### 5. Enhanced Auth (`api/core/Auth.php`)
Added **Auth::user()** method:
- Extracts and validates JWT token from request
- Checks token blacklist
- Returns authenticated user data or null

### 6. Test Files
- **test_cars_api.php** - HTTP-based API tests (requires curl)
- **test_cars_direct.php** - Direct component tests

## Features Implemented

### Advanced Filtering
Query parameters for GET /cars:
- `brand` - Filter by car brand
- `model` - Filter by model (LIKE search)
- `fuel_type` - petrol, diesel, electric, hybrid
- `transmission` - manual, automatic
- `status` - available, rented, maintenance, retired
- `min_price` / `max_price` - Price range filter
- `seats` - Minimum number of seats
- `doors` - Number of doors
- `search` - Search across brand, model, registration

### Sorting
- `sort_by` - Column to sort by (brand, model, year, price_per_day, etc.)
- `sort_order` - ASC or DESC

### Pagination
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20, max: 100)

Returns:
```json
{
  "success": true,
  "data": [...],
  "meta": {
    "total": 50,
    "page": 1,
    "limit": 20,
    "pages": 3
  }
}
```

### Image Management
- Upload images with automatic thumbnail generation
- Set primary image for each car
- Delete images (removes file + thumbnails)
- Image URLs returned with car data
- Supports multiple images per car

### Availability Checking
Check if car is available for specific date range:
```
GET /cars/1/availability?start_date=2025-01-01&end_date=2025-01-07
```

Returns:
```json
{
  "car_id": 1,
  "start_date": "2025-01-01",
  "end_date": "2025-01-07",
  "available": true
}
```

### Security Features
- Role-based access control (admin, manager, staff)
- JWT token authentication
- Input validation and sanitization
- SQL injection prevention (prepared statements)
- File upload validation (type, size, MIME check)
- CORS configuration

## Database Requirements

⚠️ **IMPORTANT**: Before using the Cars API, you must execute `database/schema.sql` on your database to create all required tables:

Required tables:
- `cars` - Main cars table
- `car_images` - Car images with primary flag
- `bookings` - For availability checking
- `clients` - For booking relations
- `users` - For authentication

To apply the schema:
```bash
mysql -h your_db_host -u your_db_user -p your_database_name < database/schema.sql
```

Or import via phpMyAdmin/Adminer.

## API Response Format

All endpoints return standardized JSON responses:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {...}
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": {
    "field": "Error message"
  }
}
```

**Paginated Response:**
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": [...],
  "meta": {
    "total": 50,
    "page": 1,
    "limit": 20,
    "pages": 3
  }
}
```

## Usage Examples

### 1. Get All Cars
```bash
GET /api/v1/cars
```

### 2. Filter by Brand and Transmission
```bash
GET /api/v1/cars?brand=Toyota&transmission=automatic
```

### 3. Search and Sort by Price
```bash
GET /api/v1/cars?search=Avensis&sort_by=price_per_day&sort_order=ASC
```

### 4. Get Car Details
```bash
GET /api/v1/cars/1
```

Response includes:
- All car specifications
- Images array with URLs
- Recent bookings
- Active booking count

### 5. Check Availability
```bash
GET /api/v1/cars/1/availability?start_date=2025-12-20&end_date=2025-12-27
```

### 6. Create New Car (Admin Only)
```bash
POST /api/v1/cars
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "brand": "Toyota",
  "model": "Avensis",
  "year": 2024,
  "color": "Silver",
  "registration_number": "B123ABC",
  "fuel_type": "diesel",
  "transmission": "automatic",
  "seats": 5,
  "doors": 4,
  "price_per_day": 45.00,
  "deposit_amount": 500.00
}
```

### 7. Upload Car Image (Manager+)
```bash
POST /api/v1/cars/1/images
Authorization: Bearer {jwt_token}
Content-Type: multipart/form-data

image: [file]
is_primary: true
display_order: 1
```

Response includes:
- Original image URL
- Thumbnails (small, medium, large)
- Image ID
- File info (size, dimensions)

### 8. Update Car Price (Manager+)
```bash
PATCH /api/v1/cars/1
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "price_per_day": 50.00
}
```

### 9. Delete Car (Admin Only)
```bash
DELETE /api/v1/cars/1
Authorization: Bearer {jwt_token}
```

Performs soft delete (sets status to 'retired').
Cannot delete cars with active bookings.

## Validation Rules

### Creating/Updating Cars
- **brand**: Required, string
- **model**: Required, string
- **year**: Required, number (1900 - current year + 1)
- **registration_number**: Required, unique
- **fuel_type**: Required, enum (petrol, diesel, electric, hybrid)
- **transmission**: Required, enum (manual, automatic)
- **seats**: Required, number
- **doors**: Required, number
- **price_per_day**: Required, number >= 0
- **status**: Optional, enum (available, rented, maintenance, retired)

### Uploading Images
- **Max size**: 5MB (configurable in .env)
- **Allowed types**: jpg, jpeg, png, webp
- **MIME validation**: Validates actual file content
- **Dimension check**: Uses getimagesize()

## Performance Optimizations

1. **Single Query Loading**: Images loaded with car data in one query
2. **Prepared Statements**: All queries use PDO prepared statements
3. **Indexed Columns**: brand, model, status, registration_number
4. **Pagination**: Limits result set size
5. **Lazy Loading**: Recent bookings only loaded for single car view
6. **Static Connection**: Database connection reused via singleton pattern

## Error Handling

- **400 Bad Request**: Invalid input data
- **401 Unauthorized**: Missing or invalid authentication
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Car or image not found
- **409 Conflict**: Cannot delete car with active bookings
- **422 Unprocessable Entity**: Validation errors
- **500 Internal Server Error**: Server-side errors

All errors logged to error_log in production mode.

## Next Steps

Phase 2 is complete! Next phases:

- **Phase 3**: Bookings API - Create, manage, and track bookings
- **Phase 4**: Clients API - Customer management
- **Phase 5**: Payments API - Payment processing and tracking
- **Phase 6**: Dashboard API - Statistics and analytics
- **Phase 7**: Vue.js Admin Dashboard - Frontend implementation

## Notes

- All file paths are configured via .env
- Upload directory created automatically if missing
- Thumbnails generated on upload
- Primary image flag ensures only one primary per car
- Soft delete preserves data for historical bookings
- Role hierarchy: staff < manager < admin
- Debug mode shows detailed errors (set API_DEBUG=false in production)

---

**Status**: ✅ Phase 2 Complete and Ready for Testing
**Next**: Apply database schema, then test all endpoints
