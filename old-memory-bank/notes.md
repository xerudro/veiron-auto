# VEIRONAUTO - Development Notes

## Technical Architecture

### Frontend Architecture
- **Framework**: UIkit CSS for responsive grid and components
- **JavaScript**: Vanilla JS with modular organization
- **Libraries**: 
  - lightGallery for image galleries with lightbox, zoom, pan
  - Swiper for responsive carousels with touch navigation
- **Asset Organization**: Separated by type (css/, js/, json/, images/, libs/)
- **CSS Structure**: common/, components/, pages/, themes/
- **JS Structure**: core/, components/, pages/, i18n/

### Backend Architecture
- **Language**: PHP (no framework)
- **Database**: MariaDB with proper indexing
- **Email**: PHPMailer with SMTP configuration
- **Security**: CSRF protection, input validation, SQL injection prevention

### Multi-language & Currency Support
- **Languages**: English (en), Romanian (ro)
- **Currencies**: EUR (€), RON (lei)
- **Implementation**: Dynamic content switching with locale detection
- **Currency Conversion**: Real-time conversion with API integration
- **Formatting**: Locale-specific number and date formatting
- **File Structure**: Separate HTML files for each language variant (index-ro.html, index-en.html, etc.)

## Design System

### Color Palette
- Primary colors from reference mockup
- Consistent theming across all components
- Dark backgrounds for car cards with rounded corners

### Typography
- Font hierarchy for different content types
- Responsive font sizing
- Multi-language font support

### Component Design
- **Car Cards**: 4/row desktop, responsive stacking
- **Buttons**: Consistent styling with hover states
- **Forms**: Validation states and error handling
- **Gallery**: lightGallery integration with custom styling
- **Carousel**: Swiper integration with responsive breakpoints

## Database Schema

### Core Tables
```sql
-- Cars table
CREATE TABLE cars (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255),
    class VARCHAR(50),
    transmission ENUM('manual', 'automatic'),
    fuel_type VARCHAR(50),
    seats INT,
    luggage INT,
    price_per_day DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'EUR',
    images JSON,
    available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings table
CREATE TABLE bookings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    car_id INT,
    user_name VARCHAR(255),
    user_email VARCHAR(255),
    user_phone VARCHAR(50),
    start_date DATE,
    end_date DATE,
    total_price DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'EUR',
    language VARCHAR(2) DEFAULT 'en',
    status ENUM('pending', 'confirmed', 'cancelled'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (car_id) REFERENCES cars(id)
);

-- Additional services
CREATE TABLE additional_services (
    id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT,
    service_type ENUM('gps', 'child_seat_baby', 'child_seat_child'),
    price_per_day DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'EUR',
    FOREIGN KEY (booking_id) REFERENCES bookings(id)
);

-- Warranty plans
CREATE TABLE warranty_plans (
    id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT,
    plan_type ENUM('basic', 'premium'),
    price DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'EUR',
    FOREIGN KEY (booking_id) REFERENCES bookings(id)
);
```

## Image Gallery & Carousel Features

### lightGallery Integration
- **Lightbox Functionality**: Full-screen image viewing
- **Zoom & Pan**: Detailed image examination
- **Thumbnail Navigation**: Quick image switching
- **Touch Gestures**: Mobile-friendly interactions
- **Responsive Design**: Adapts to all screen sizes
- **Custom Styling**: Matches site design theme

### Swiper Carousel
- **Popular Cars Display**: Homepage carousel
- **Touch Navigation**: Swipe gestures for mobile
- **Autoplay**: Automatic rotation with hover pause
- **Pagination**: Visual indicators for current position
- **Navigation Controls**: Previous/next buttons
- **Responsive Breakpoints**: Different settings per device

## Multi-step Booking Process

### Step 1: Car Selection
- Grid layout with 4 cards per row on desktop
- Responsive adaptation (2-3 cards on tablet, stacking on mobile)
- Live filtering by transmission and class
- Real-time price updates

### Step 2: Personal Data & Services
- Form validation with real-time feedback
- Phone number field with country selection
- Additional services selection (GPS, child seats)
- Warranty plan selection (Basic/Premium)

### Step 3: Summary & Verification
- Persistent sticky summary bar
- Expandable/collapsible details
- Cost breakdown with all options
- Quick edit functionality

### Step 4: Confirmation
- Final review of all selections
- Email confirmation with detailed summary
- Admin notification system

## Booking System Implementation (Completed)

### Session Storage Architecture
- **BookingDataManager**: Handles data persistence in session storage
- **BookingFormHandler**: Manages form validation and data collection
- **EmailService**: Handles email generation and sending
- **BookingSystem**: Main orchestrator connecting all components

### Data Flow
1. **Form Collection**: User fills booking form on index-ro.html
2. **Session Storage**: Data saved to browser session storage
3. **Pricing Page**: Data loaded for pricing calculation
4. **Email Generation**: Final booking sent via email service
5. **Cleanup**: Session data cleared after successful submission

### Key Features Implemented
- **Real-time Validation**: Form fields validated on blur and input
- **Error Handling**: Comprehensive error messages and recovery
- **Responsive Design**: Form adapts to all screen sizes
- **Modular Architecture**: Separate files for each functionality
- **Debug Support**: Console functions for development testing

### Email Templates
- **Client Email**: Confirmation with booking details and costs
- **Owner Email**: Notification with customer and booking information
- **HTML Formatting**: Professional email templates with styling

## Car Card Design

### Visual Elements
- Dark background with rounded corners
- High-quality car images
- Icon indicators (passengers, luggage, transmission, fuel)
- Price bands with currency display
- Availability badges
- Hover effects and interactions

### Responsive Behavior
- **Desktop**: 4 cards per row
- **Tablet**: 2-3 cards per row
- **Mobile**: Single column stacking
- **Touch Interactions**: Optimized for mobile devices

## Form Components

### Phone Number Field
- **Country Dropdown**: Flag icons with country names
- **Prefix Field**: Auto-populated based on country selection
- **Number Field**: Validation for digits only
- **Validation**: Real-time format checking

### Additional Services
- **GPS**: 2 EUR/day
- **Child Seat (Baby)**: 2 EUR/day
- **Child Seat (Child)**: 2 EUR/day
- **Visual Selection**: Checkbox with icons and pricing

### Warranty Plans
- **Basic Plan**: Standard coverage
- **Premium Plan**: Extended coverage
- **Visual Differentiation**: Different styling for each plan
- **Price Display**: Clear cost breakdown

## Internationalization (i18n)

### Translation System
- **File Structure**: Separate files for each language (en.js, ro.js)
- **Dynamic Loading**: Load translations based on user selection
- **Fallback**: Default to English if translation missing
- **Context Support**: Handle pluralization and gender

### Currency Handling
- **Conversion API**: Real-time exchange rates
- **Formatting**: Locale-specific number formatting
- **Symbol Display**: Currency symbols (€, lei)
- **Decimal Places**: Proper decimal handling

### Locale Detection
- **Browser Language**: Automatic detection from browser

## Pricing System Architecture

### Tiered Pricing Structure
- **1-3 days**: Standard rate (no discount)
- **4-7 days**: Reduced rate (5-10% discount)
- **8-14 days**: Further reduced rate (10-15% discount)
- **15-30 days**: Lowest rate (15-20% discount)

### Warranty System
- **Car-specific deposits**: Varies by brand and condition
- **One-time fee**: Applied per rental regardless of duration
- **Refundable**: Returned after vehicle inspection
- **Risk-based**: Higher deposits for premium/luxury vehicles

### Insurance Options
- **Basic Insurance**: Daily rate with standard coverage
- **Premium Insurance**: Daily rate with comprehensive coverage
- **Daily calculation**: Multiplied by rental duration
- **Optional add-on**: Can be selected during booking process
- **Client choice**: Customer can opt out of both insurance options
- **Risk assumption**: If no insurance selected, customer bears all accident costs
- **No mandatory requirement**: Insurance is completely optional

### Implementation Strategy
- **Dynamic calculation**: Real-time pricing updates
- **Date-based logic**: Automatic tier detection
- **Car-specific rates**: Different base prices per vehicle
- **Currency support**: Works with both EUR and RON
- **User Preference**: Manual language selection
- **Persistence**: Remember user's language choice
- **URL Structure**: Language codes in URLs (optional)

## Performance Optimization

### Frontend Optimization
- **CSS Organization**: Modular structure for better caching
- **JavaScript Loading**: Async loading where appropriate
- **Image Optimization**: WebP format with fallbacks
- **Library Optimization**: Minified versions of lightGallery and Swiper

### Backend Optimization
- **Database Queries**: Optimized with proper indexing
- **Caching**: Static resource caching
- **API Response**: Compressed JSON responses
- **Error Handling**: Graceful degradation

### Multi-language Optimization
- **Translation Loading**: Lazy loading of translation files
- **Currency Conversion**: Cached exchange rates
- **Locale-specific Caching**: Separate cache for each language
- **CDN Integration**: Global content delivery

## Security Considerations

### Input Validation
- **Frontend**: Real-time validation with visual feedback
- **Backend**: Server-side validation for all inputs
- **Sanitization**: HTML and SQL injection prevention
- **CSRF Protection**: Token-based protection for forms

### Data Protection
- **Personal Data**: GDPR compliance for user information
- **Email Security**: Encrypted email transmission
- **Database Security**: Prepared statements for all queries
- **File Uploads**: Secure handling of car images

### Authentication
- **Admin Access**: Secure login system
- **Session Management**: Proper session handling
- **Password Security**: Strong password requirements
- **Rate Limiting**: Protection against brute force attacks

## Testing Strategy

### Frontend Testing
- **Responsive Design**: Test on all device sizes
- **Browser Compatibility**: Cross-browser testing
- **JavaScript Functionality**: Form validation and interactions
- **Gallery & Carousel**: Test lightGallery and Swiper functionality

### Backend Testing
- **API Endpoints**: Test all CRUD operations
- **Database Operations**: Verify data integrity
- **Email System**: Test booking confirmations
- **Security**: Penetration testing for vulnerabilities

### Multi-language Testing
- **Translation Accuracy**: Verify all text translations
- **Currency Conversion**: Test conversion accuracy
- **Locale Formatting**: Test number and date formatting
- **Language Switching**: Test dynamic content switching

### Integration Testing
- **Booking Flow**: End-to-end booking process
- **Admin Panel**: Complete admin functionality
- **Email Notifications**: Verify email delivery
- **Data Consistency**: Frontend-backend data sync

## Deployment Considerations

### Environment Setup
- **Production Server**: Configure web server (Apache/Nginx)
- **Database**: Set up MariaDB with proper permissions
- **SSL Certificate**: HTTPS configuration
- **Email Server**: SMTP configuration for PHPMailer

### Asset Deployment
- **Static Files**: Optimize and compress all assets
- **CDN**: Consider CDN for global delivery
- **Caching**: Implement proper caching headers
- **Backup**: Automated backup procedures

### Monitoring
- **Error Logging**: Comprehensive error tracking
- **Performance Monitoring**: Track page load times
- **User Analytics**: Monitor user behavior
- **Email Monitoring**: Track email delivery success

## Future Enhancements

### Potential Features
- **Mobile App**: Native mobile application
- **Payment Integration**: Online payment processing
- **Advanced Analytics**: Detailed booking analytics
- **API for Partners**: Third-party integration capabilities

### Scalability Considerations
- **Database Scaling**: Read replicas and sharding
- **Load Balancing**: Multiple server setup
- **Caching Strategy**: Redis or Memcached integration
- **Microservices**: Break down into smaller services 