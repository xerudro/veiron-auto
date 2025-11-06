# VEIRONAUTO - Comprehensive Todo List with Dependencies (actualizat automat)

## Project Overview
- **Project**: Car Rental Platform with Multi-language Support
- **Technology Stack**: HTML5, UIkit, Vanilla JavaScript, PHP, MariaDB, PHPMailer
- **Libraries**: lightGallery, Swiper
- **Languages**: English (EUR), Romanian (RON)
- **Total Tasks**: 161 (153 main + 8 additional pricing tasks)
- **Current Progress**: 12/161 tasks completed (7.5%)
- **Estimated Timeline**: 18-28 days

## Task Dependencies Legend
- 🔴 **Blocker**: Must be completed before dependent tasks
- 🟡 **Soft Dependency**: Recommended to complete first
- 🟢 **Independent**: Can be done in parallel
- ✅ **Completed**: Task already finished

---

# Progres și Taskuri Finalizate

## Progres General
- Total taskuri: 161
- Taskuri finalizate: 12
- Progres: 7.5%

## Progres pe faze
- PHASE 1: 0/15 (0%)
- PHASE 2: 12/43 (27.9%)
- PHASE 3: 0/25 (0%)
- PHASE 4: 0/20 (0%)
- PHASE 5: 0/15 (0%)
- PHASE 6: 0/20 (0%)
- PHASE 7: 0/15 (0%)

## Taskuri completate (✅)
- PHASE 1:
  - (niciun task finalizat)
- PHASE 2:
  - Create public_html directory
  - Create app directory
  - Create database directory
  - Create docs directory
  - Create assets subdirectories (css/, js/, json/, images/, libs/)
  - Create admin subdirectory
  - Create app subdirectories (config/, api/, includes/, admin/)
  - Create css/ directory with subdirectories
  - Create js/ directory with subdirectories
  - Create json/ directory for data files
  - Create images/ directory with subdirectories
  - Create libs/ directory for third-party libraries
  - Create index-ro.html (Romanian version)
  - Create home.css for homepage layout
  - Create booking.css for multi-step booking process

## Vizualizare dependențe cheie
- Create booking.js depinde de Create app.js
- Create catalog-en.html depinde de catalog-ro.html
- Create booking-en.html depinde de booking-ro.html
- Create contact-en.html depinde de contact-ro.html
- Create layout.css depinde de base.css
- Create catalog.js depinde de filters.js
- Create booking.js depinde de booking-ro.html
- Create en.js depinde de index-en.html
- Create ro.js depinde de index-ro.html
- Implement currency formatting and conversion depinde de en-eur.css și ro-ron.css
- Set up language switching functionality depinde de index-en.html

---

## PHASE 1: Setup & Infrastructure

### 1.1 Database Setup
- [ ] Install MariaDB server on development machine
- [ ] Create database named `veironauto`
- [ ] Create database user `veiron_user` with appropriate permissions
- [ ] Configure database connection settings in config file
- [ ] Test database connectivity with test script
- [ ] Document connection parameters
- [ ] Design `cars` table structure
- [ ] Design `bookings` table structure
- [ ] Design `additional_services` table
- [ ] Design `warranty_plans` table
- [ ] Design `users` table for admin accounts
- [ ] Create foreign key relationships
- [ ] Add proper indexes for performance
- [ ] Execute SQL schema creation script
- [ ] Create `database/migrations/` directory structure
- [ ] Set up migration tracking table in database
- [ ] Create initial migration files
- [ ] Implement migration runner script
- [ ] Test migration rollback functionality
- [ ] Document migration process
- [ ] Create sample car data (minimum 20 cars)
- [ ] Create sample user accounts (3 admin users)
- [ ] Create sample services (GPS, child seats)
- [ ] Create warranty plans (Basic, Premium)
- [ ] Verify data integrity
- [ ] Create seed data SQL file

### 1.2 Project Structure
- [x] Create public_html directory
- [x] Create app directory
- [x] Create database directory
- [x] Create docs directory
- [ ] Set proper permissions (755 for directories, 644 for files)
- [ ] Create README files for each directory
- [x] Create assets subdirectories (css/, js/, json/, images/, libs/)
- [x] Create admin subdirectory
- [x] Create app subdirectories (config/, api/, includes/, admin/)
- [ ] Set up proper file permissions
- [ ] Create index files to prevent directory listing
- [ ] Set up .htaccess files
- [ ] Install and configure web server (Apache or Nginx)
- [ ] Enable PHP module (PHP 7.4+ recommended)
- [ ] Configure virtual host for veironauto.local
- [ ] Set up URL rewriting for clean URLs
- [ ] Configure error logging
- [ ] Test PHP execution
- [ ] Install development tools (VS Code, PHPStorm, etc.)
- [ ] Configure IDE/editor with project settings
- [ ] Set up version control (Git)
- [ ] Create .gitignore file
- [ ] Initialize Git repository
- [ ] Create initial commit

### 1.3 Asset Organization
- [x] Create css/ directory with subdirectories
- [x] Create js/ directory with subdirectories
- [x] Create json/ directory for data files
- [x] Create images/ directory with subdirectories
- [x] Create libs/ directory for third-party libraries
- [ ] Add README files explaining structure
- [x] Create common/ directory for shared styles
- [x] Create components/ directory for component-specific styles
- [x] Create pages/ directory for page-specific styles
- [x] Create themes/ directory for language/currency themes
- [ ] Create main.css to import all styles
- [ ] Set up CSS build process
- [x] Create core/ directory for main application logic
- [x] Create components/ directory for component scripts
- [x] Create pages/ directory for page-specific scripts
- [x] Create i18n/ directory for internationalization
- [ ] Create main.js to initialize application
- [ ] Set up JS module system
- [ ] Download UIkit CSS files (v3.x)
- [ ] Place in libs/uikit/ directory
- [ ] Include UIkit CSS in HTML templates
- [ ] Configure basic UIkit setup
- [ ] Create UIkit customization file
- [ ] Test UIkit functionality
- [ ] Download lightGallery files
- [ ] Place in libs/lightgallery/ directory
- [ ] Include lightGallery CSS and JS
- [ ] Configure basic lightGallery setup
- [ ] Create custom lightGallery theme
- [ ] Test lightGallery functionality
- [ ] Download Swiper files
- [ ] Place in libs/swiper/ directory
- [ ] Include Swiper CSS and JS
- [ ] Configure basic Swiper setup
- [ ] Create custom Swiper theme
- [ ] Test Swiper functionality
- [ ] Add node_modules/ if using npm
- [ ] Add vendor/ for PHP dependencies
- [ ] Add config files with sensitive data
- [ ] Add IDE-specific files
- [ ] Add OS-specific files
- [ ] Add build/dist directories

## PHASE 2: Frontend Development

### 2.1 Core HTML Structure
- [x] Create index-ro.html (Romanian version)
- [ ] Create index-en.html (English version)
  - [ ] Copy structure from index-ro.html
  - [ ] Translate all content to English
  - [ ] Update language attributes
  - [ ] Update currency displays to EUR
  - [ ] Maintain same structure as Romanian version
  - [ ] Test language-specific content
- [ ] Create catalog-ro.html (Romanian catalog page)
  - [ ] Create car catalog layout with filters sidebar
  - [ ] Implement responsive car grid (4 cards/row desktop)
  - [ ] Add sorting controls (price, name, class)
  - [ ] Add filtering controls (transmission, class)
  - [ ] Include lightGallery for car images
  - [ ] Test catalog functionality
- [ ] Create catalog-en.html (English catalog page)
  - [ ] Copy structure from catalog-ro.html
  - [ ] Translate all catalog content
  - [ ] Update currency to EUR
  - [ ] Maintain same functionality
- [ ] Create booking-ro.html (Romanian booking page)
  - [ ] Create multi-step booking wizard structure
  - [ ] Step 1: Car selection grid
  - [ ] Step 2: Personal data & services form
  - [ ] Step 3: Summary and verification
  - [ ] Step 4: Confirmation
  - [ ] Implement form validation
  - [ ] Add booking summary sidebar
  - [ ] Test booking flow end-to-end
- [ ] Create booking-en.html (English booking page)
  - [ ] Copy structure from booking-ro.html
  - [ ] Translate all booking content
  - [ ] Update currency to EUR
  - [ ] Maintain same booking flow
- [ ] Create contact-ro.html (Romanian contact page)
  - [ ] Create contact form layout
  - [ ] Add company contact information
  - [ ] Include Google Maps integration
  - [ ] Add business hours display
  - [ ] Test contact form functionality
- [ ] Create contact-en.html (English contact page)
  - [ ] Copy structure from contact-ro.html
  - [ ] Translate all contact content
  - [ ] Maintain same functionality

### 2.2 Base Styles & Layout
- [ ] Create base.css with CSS variables and reset styles
  - [ ] Define CSS custom properties
  - [ ] Colors: primary, secondary, accent, grays
  - [ ] Fonts: headings, body, monospace
  - [ ] Spacing: base unit, scales
  - [ ] Breakpoints: mobile, tablet, desktop
  - [ ] Create CSS reset/normalize styles
  - [ ] Set up base typography styles
  - [ ] Define base layout containers
  - [ ] Test cross-browser compatibility
- [ ] Create layout.css with grid system and containers
  - [ ] Create responsive grid system (12 columns)
  - [ ] Define container classes (.container, .container-fluid)
  - [ ] Set up breakpoints (576px, 768px, 992px, 1200px)
  - [ ] Create utility classes for layout
  - [ ] Add flexbox utilities
  - [ ] Test responsive behavior
- [ ] Create typography.css with font definitions
  - [ ] Define font families for different languages
  - [ ] Set up font hierarchy (h1-h6, p, small, etc.)
  - [ ] Create text utility classes
  - [ ] Configure font loading optimization
  - [ ] Add font-weight variations
  - [ ] Test font rendering across devices
- [ ] Create utilities.css with helper classes
  - [ ] Create spacing utility classes (margin, padding)
  - [ ] Create color utility classes
  - [ ] Create display utility classes
  - [ ] Create positioning utility classes
  - [ ] Add text alignment utilities
  - [ ] Test utility class functionality

### 2.3 Component Styles
- [ ] Create buttons.css with button variants and states
  - [ ] Design primary button styles
  - [ ] Design secondary button styles
  - [ ] Design outline button variants
  - [ ] Design disabled button states
  - [ ] Create hover and focus effects
  - [ ] Add loading state animations
  - [ ] Ensure accessibility compliance
  - [ ] Test button interactions
- [ ] Create forms.css with form styling and validation states
  - [ ] Style form inputs and labels
  - [ ] Create validation error states
  - [ ] Style form groups and layouts
  - [ ] Design custom select dropdowns
  - [ ] Style checkboxes and radio buttons
  - [ ] Create responsive form layouts
  - [ ] Add focus states
  - [ ] Test form accessibility
- [ ] Create cards.css with car card design
  - [ ] Design car card layout with dark background
  - [ ] Create responsive grid (4/row desktop, 2-3/row tablet, 1/row mobile)
  - [ ] Style car images with aspect ratio
  - [ ] Style car information display
  - [ ] Create price band styling
  - [ ] Add icon displays (seats, luggage, etc.)
  - [ ] Add hover effects and interactions
  - [ ] Test responsive breakpoints
- [ ] Create gallery.css for lightGallery custom styling
  - [ ] Customize lightGallery lightbox appearance
  - [ ] Style thumbnail navigation
  - [ ] Create custom zoom and pan controls
  - [ ] Design responsive gallery layout
  - [ ] Style loading animations
  - [ ] Test gallery functionality across devices
- [ ] Create carousel.css for Swiper custom styling
  - [ ] Customize Swiper carousel appearance
  - [ ] Style navigation arrows
  - [ ] Style pagination dots
  - [ ] Create responsive carousel layout
  - [ ] Design autoplay controls
  - [ ] Test carousel on touch devices

### 2.4 Page-Specific Styles
- [x] Create home.css for homepage layout
- [x] Create booking.css for multi-step booking process
- [ ] Create catalog.css for car catalog page
  - [ ] Style car grid layout
  - [ ] Design filter sidebar
  - [ ] Create sorting controls
  - [ ] Style pagination
  - [ ] Add loading states
  - [ ] Test catalog page functionality
- [ ] Create contact.css for contact page
  - [ ] Style contact form
  - [ ] Design contact information display
  - [ ] Create map integration styling
  - [ ] Style business hours display
  - [ ] Test contact page functionality
- [ ] Create admin.css for admin panel
  - [ ] Design admin dashboard layout
  - [ ] Style admin navigation
  - [ ] Create data table styles
  - [ ] Design admin forms
  - [ ] Style statistics widgets
  - [ ] Test admin panel responsiveness

### 2.5 Language & Currency Themes
- [ ] Create en-eur.css for English + EUR styling
  - [ ] Set up English language typography
  - [ ] Configure EUR currency formatting
  - [ ] Create English-specific layout adjustments
  - [ ] Define currency symbols and positions
  - [ ] Test English content display
- [ ] Create ro-ron.css for Romanian + RON styling
  - [ ] Set up Romanian language typography
  - [ ] Configure RON currency formatting
  - [ ] Create Romanian-specific layout adjustments
  - [ ] Define currency symbols and positions
  - [ ] Test Romanian content display
- [ ] Implement currency formatting and conversion
  - [ ] Create currency conversion functions
  - [ ] Implement real-time currency updates
  - [ ] Style currency display elements
  - [ ] Add currency switcher UI
  - [ ] Test currency conversion accuracy
- [ ] Set up language switching functionality
  - [ ] Create language switcher component
  - [ ] Implement dynamic content loading
  - [ ] Handle URL language parameters
  - [ ] Store language preference
  - [ ] Test language switching

### 2.6 Core JavaScript
- [ ] Create app.js with main application logic
  - [ ] Set up application initialization
  - [ ] Create event handling system
  - [ ] Implement routing logic
  - [ ] Create global utility functions
  - [ ] Set up error handling
  - [ ] Test application startup
- [ ] Create config.js with application configuration
  - [ ] Define API endpoints
  - [ ] Set up environment variables
  - [ ] Configure default settings
  - [ ] Add feature flags
  - [ ] Create configuration validation
  - [ ] Test configuration loading
- [ ] Create utils.js with utility functions
  - [ ] Create date formatting functions
  - [ ] Implement number formatting
  - [ ] Create validation utilities
  - [ ] Add DOM manipulation helpers
  - [ ] Create debounce/throttle functions
  - [ ] Test utility functions
- [ ] Create api.js for API communication
  - [ ] Create HTTP request functions (GET, POST, PUT, DELETE)
  - [ ] Implement error handling
  - [ ] Add request/response interceptors
  - [ ] Create API response caching
  - [ ] Add retry logic
  - [ ] Test API communication

### 2.7 Component Scripts
- [ ] Create booking.js for multi-step booking wizard
  - [ ] Initialize lightGallery instances
  - [ ] Configure gallery options
  - [ ] Handle dynamic image loading
  - [ ] Implement custom controls
  - [ ] Add gallery events
  - [ ] Test gallery functionality
- [ ] Create filters.js for live car filtering
  - [ ] Implement transmission filter (manual/automatic)
  - [ ] Create class-based filtering (checkboxes)
  - [ ] Add price range filtering
  - [ ] Create live search functionality
  - [ ] Implement filter state management
  - [ ] Test filter performance
- [ ] Create forms.js for form validation
  - [ ] Initialize contact form
  - [ ] Handle form submission
  - [ ] Implement validation
  - [ ] Add success/error handling
  - [ ] Handle map integration
  - [ ] Test contact functionality
- [ ] Create summary.js for persistent booking summary
  - [ ] Initialize admin components
  - [ ] Handle CRUD operations
  - [ ] Implement data tables
  - [ ] Add export functionality
  - [ ] Handle statistics updates
  - [ ] Test admin panel

### 2.8 Page-Specific Scripts
- [ ] Create home.js for homepage functionality
- [ ] Create catalog.js for catalog page
  - [ ] Initialize catalog components
  - [ ] Handle filter interactions
  - [ ] Implement sorting functionality
  - [ ] Add pagination logic
  - [ ] Handle loading states
  - [ ] Test catalog page
- [ ] Create booking.js for booking page
- [ ] Create contact.js for contact form
- [ ] Create admin.js for admin panel

### 2.9 Internationalization
- [ ] Create en.js with English translations
  - [ ] Translate all UI text to English
  - [ ] Create translation key structure
  - [ ] Handle pluralization rules
  - [ ] Add context-specific translations
  - [ ] Create fallback translations
  - [ ] Test English translations
- [ ] Create ro.js with Romanian translations
  - [ ] Translate all UI text to Romanian
  - [ ] Create translation key structure
  - [ ] Handle pluralization rules
  - [ ] Add context-specific translations
  - [ ] Create fallback translations
  - [ ] Test Romanian translations
- [ ] Create currency.js for currency conversion
  - [ ] Implement currency conversion API integration
  - [ ] Create formatting functions
  - [ ] Handle exchange rate updates
  - [ ] Add currency symbol display
  - [ ] Implement caching mechanism
  - [ ] Test currency functionality
- [ ] Implement language detection and switching
  - [ ] Detect browser language
  - [ ] Create language switcher UI
  - [ ] Handle URL language parameters
  - [ ] Implement language persistence
  - [ ] Update content dynamically
  - [ ] Test language switching
- [ ] Set up currency conversion rates
  - [ ] Integrate currency API service
  - [ ] Create rate caching system
  - [ ] Handle API errors gracefully
  - [ ] Implement fallback rates
  - [ ] Schedule rate updates
  - [ ] Test conversion accuracy

### 2.10 Data Files
- [ ] Create cars.json with car data structure
  - [ ] Define car data schema
  - [ ] Create sample car entries (minimum 20)
  - [ ] Include all required fields
  - [ ] Add multilingual content (RO/EN)
  - [ ] Add image references
  - [ ] Validate JSON structure
- [ ] Create services.json with additional services
  - [ ] Define service data structure
  - [ ] Create GPS service entry (2 EUR/day)
  - [ ] Create child seat service entries (2 EUR/day each)
  - [ ] Add pricing information
  - [ ] Include multilingual descriptions
  - [ ] Validate JSON structure
- [ ] Create warranty.json with warranty plans
  - [ ] Define warranty plan structure
  - [ ] Create Basic plan entry
  - [ ] Create Premium plan entry
  - [ ] Add coverage details
  - [ ] Include pricing information
  - [ ] Validate JSON structure
- [ ] Create countries.json with country codes and flags
  - [ ] Include all country codes (ISO 3166)
  - [ ] Add phone prefixes
  - [ ] Include flag image references
  - [ ] Add country names in RO/EN
  - [ ] Sort alphabetically
  - [ ] Validate data accuracy
- [ ] Create config.json with site configuration
  - [ ] Define site settings structure
  - [ ] Add default language/currency
  - [ ] Include API endpoints
  - [ ] Add feature flags
  - [ ] Set business rules
  - [ ] Test configuration loading

### 2.11 Image Gallery & Carousel Integration
- [ ] Integrate lightGallery for car image galleries
- [ ] Implement lightbox functionality with zoom and pan
- [ ] Add thumbnail navigation for image galleries
- [ ] Implement touch gestures for mobile devices
- [ ] Integrate Swiper for popular cars carousel
- [ ] Add autoplay functionality with hover pause
- [ ] Implement pagination and navigation controls
- [ ] Configure responsive breakpoints for carousel

---

## PHASE 3: Backend Development

### 3.1 Configuration
- [ ] Create database.php for database connection
  - [ ] Set up PDO connection parameters
  - [ ] Implement connection pooling
  - [ ] Add error handling
  - [ ] Create connection testing function
  - [ ] Implement secure connection (SSL)
  - [ ] Add connection retry logic
- [ ] Create email.php for PHPMailer configuration
  - [ ]