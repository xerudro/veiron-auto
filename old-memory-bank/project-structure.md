# Project Structure - Car Rental Platform

## Technology Stack
- **Frontend**: HTML5, UIkit CSS Framework, Vanilla JavaScript
- **Backend**: PHP (no framework), MariaDB
- **Email**: PHPMailer
- **Libraries**: lightGallery (image gallery), Swiper (carousel)
- **Design**: Responsive (desktop-first approach)
- **Languages**: English (EUR), Romanian (RON)

## Directory Structure

```
veironauto/
├── public_html/                    # Frontend files
│   ├── index-ro.html              # Homepage (Romanian)
│   ├── index-en.html              # Homepage (English)
│   ├── catalog-ro.html            # Car catalog page (Romanian)
│   ├── catalog-en.html            # Car catalog page (English)
│   ├── booking-ro.html            # Multi-step booking process (Romanian)
│   ├── booking-en.html            # Multi-step booking process (English)
│   ├── contact-ro.html            # Contact page (Romanian)
│   ├── contact-en.html            # Contact page (English)
│   ├── admin/                     # Admin panel
│   │   ├── login-ro.html          # Admin login (Romanian)
│   │   ├── login-en.html          # Admin login (English)
│   │   ├── dashboard-ro.html      # Admin dashboard (Romanian)
│   │   ├── dashboard-en.html      # Admin dashboard (English)
│   │   ├── cars.html
│   │   ├── bookings.html
│   │   └── settings.html
│   └── assets/                    # Organized assets by type
│       ├── css/                   # Stylesheets by page/component
│       │   ├── common/            # Shared styles
│       │   │   ├── base.css       # Base styles, variables
│       │   │   ├── layout.css     # Grid, containers
│       │   │   ├── typography.css # Fonts, text styles
│       │   │   └── utilities.css  # Utility classes
│       │   ├── components/        # Component-specific styles
│       │   │   ├── buttons.css
│       │   │   ├── forms.css
│       │   │   ├── cards.css
│       │   │   ├── gallery.css    # lightGallery custom styles
│       │   │   └── carousel.css   # Swiper custom styles
│       │   ├── pages/             # Page-specific styles
│       │   │   ├── home.css
│       │   │   ├── catalog.css
│       │   │   ├── booking.css
│       │   │   ├── contact.css
│       │   │   └── admin.css
│       │   └── themes/            # Language/currency themes
│       │       ├── en-eur.css     # English + EUR styling
│       │       └── ro-ron.css     # Romanian + RON styling
│       ├── js/                    # JavaScript by functionality
│       │   ├── core/              # Core functionality
│       │   │   ├── app.js         # Main application
│       │   │   ├── config.js      # Configuration
│       │   │   ├── utils.js       # Utility functions
│       │   │   └── api.js         # API communication
│       │   ├── components/        # Component scripts
│       │   │   ├── booking.js     # Multi-step booking
│       │   │   ├── filters.js     # Car filtering
│       │   │   ├── gallery.js     # lightGallery integration
│       │   │   ├── carousel.js    # Swiper integration
│       │   │   ├── forms.js       # Form validation
│       │   │   └── summary.js     # Booking summary
│       │   ├── pages/             # Page-specific scripts
│       │   │   ├── home.js
│       │   │   ├── catalog.js
│       │   │   ├── booking.js
│       │   │   ├── contact.js
│       │   │   └── admin.js
│       │   └── i18n/              # Internationalization
│       │       ├── en.js          # English translations
│       │       ├── ro.js          # Romanian translations
│       │       └── currency.js    # Currency conversion
│       ├── json/                  # Data files
│       │   ├── cars.json          # Car data
│       │   ├── services.json      # Additional services
│       │   ├── warranty.json      # Warranty plans
│       │   ├── countries.json     # Country codes/flags
│       │   └── config.json        # Site configuration
│       ├── images/                # Image assets
│       │   ├── cars/              # Car images
│       │   ├── icons/             # UI icons
│       │   ├── flags/             # Country flags
│       │   └── ui/                # UI elements
│       └── libs/                  # Third-party libraries
│           ├── uikit/
│           ├── lightgallery/
│           └── swiper/
├── app/                           # Backend PHP files
│   ├── config/                    # Configuration files
│   │   ├── database.php           # Database connection
│   │   ├── email.php              # PHPMailer config
│   │   └── app.php                # App settings
│   ├── api/                       # API endpoints
│   │   ├── cars.php               # Car management
│   │   ├── bookings.php           # Booking management
│   │   ├── services.php           # Additional services
│   │   ├── warranty.php           # Warranty plans
│   │   └── admin.php              # Admin operations
│   ├── includes/                  # PHP includes
│   │   ├── functions.php          # Helper functions
│   │   ├── validation.php         # Input validation
│   │   ├── security.php           # Security functions
│   │   └── email-templates.php    # Email templates
│   └── admin/                     # Admin backend
│       ├── auth.php               # Authentication
│       ├── dashboard.php          # Dashboard logic
│       └── reports.php            # Reporting
├── database/                      # Database files
│   ├── schema.sql                 # Database schema
│   ├── seed.sql                   # Sample data
│   └── migrations/                # Database migrations
└── docs/                          # Documentation
    ├── prd.txt                    # Product Requirements Document
    └── api-docs.md                # API documentation
```

## Key Features Structure

### 1. Multi-step Booking Process
- **Step 1**: Car selection grid (4 cards/row desktop, responsive)
- **Step 2**: Personal data + service selection
- **Step 3**: Booking summary and verification
- **Step 4**: Confirmation and email sending

### 2. Car Grid & Filtering
- Responsive grid (4/row desktop, 2-3/row mobile)
- Live filtering by transmission and class
- Card design with pricing, icons, and details

### 3. Image Gallery & Carousel
- **lightGallery**: Interactive image gallery with lightbox, zoom, pan
- **Swiper**: Popular cars carousel with touch navigation, autoplay
- Responsive design for all devices

### 4. Persistent Booking Summary
- Sticky bottom bar with real-time updates
- Expandable/collapsible details
- Quick edit functionality

### 5. Multi-language & Currency Support
- **Languages**: English (en), Romanian (ro)
- **Currencies**: EUR (€), RON (lei)
- Dynamic content switching
- Currency conversion and formatting

### 6. Admin Panel
- CRUD operations for cars, bookings, services
- Export functionality and reports
- User management and authentication

## Development Phases

1. **Setup & Infrastructure** (15 tasks)
2. **Frontend Development** (43 tasks)
3. **Backend Development** (25 tasks)
4. **Admin Panel** (20 tasks)
5. **Integration & Testing** (15 tasks)
6. **Security & Optimization** (20 tasks)
7. **Documentation & Deployment** (15 tasks)

**Total**: 153 tasks across 7 phases 