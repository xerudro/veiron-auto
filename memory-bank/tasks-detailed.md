# VEIRONAUTO - Detailed Tasks & Instructions

## Current Development State Analysis

### Completed Tasks (✅)
Based on progress.md and todo.md analysis:

**PHASE 1 - Setup & Infrastructure:**
- [x] Create public_html directory
- [x] Create app directory  
- [x] Create database directory
- [x] Create docs directory
- [x] Create assets subdirectories (css/, js/, json/, images/, libs/)
- [x] Create admin subdirectory
- [x] Create app subdirectories (config/, api/, includes/, admin/)
- [x] Create css/ directory with subdirectories
- [x] Create js/ directory with subdirectories
- [x] Create json/ directory for data files
- [x] Create images/ directory with subdirectories
- [x] Create libs/ directory for third-party libraries

**PHASE 2 - Frontend Development:**
- [x] Create index-ro.html (Romanian version)
- [x] Create home.css for homepage layout
- [x] Create booking.css for multi-step booking process
- [x] Create contact-ro.html (Romanian contact page)
- [x] Create contact-en.html (English contact page)

### Current Progress Summary
- **Total Tasks:** 161
- **Completed:** 14 (8.7%)
- **Remaining:** 147 tasks
- **Current Phase:** PHASE 2 (32.5% complete)

### Known Completed Features
- Basic project structure established
- Romanian homepage (index-ro.html)
- Contact pages in both languages (RO/EN)
- Terms and conditions pages (RO/EN)
- Footer implementation with Veiron Daune links
- Basic CSS structure for home and booking pages

---

## Task Categories & Priority Levels

### 🔴 HIGH PRIORITY (Blocking Dependencies)
Tasks that must be completed before others can proceed

### 🟡 MEDIUM PRIORITY (Core Features)
Essential functionality for MVP

### 🟢 LOW PRIORITY (Enhancements)
Nice-to-have features and optimizations

---

## Detailed Task Instructions by Phase

### PHASE 1: Setup & Infrastructure (0/15 completed)

**Status:** Foundation complete, remaining tasks are optimizations

#### 1.1 Database Setup (0/15 tasks)
**Priority:** 🔴 HIGH (Required for backend functionality)

**Task 1.1.1: Install MariaDB Server**
- **Status:** Not started
- **Dependencies:** None
- **Instructions:**
  1. Download MariaDB 10.6+ from official website
  2. Install with default settings
  3. Set root password during installation
  4. Verify installation: `mysql --version`
  5. Start MariaDB service
- **Acceptance Criteria:** MariaDB running and accessible via command line
- **Estimated Time:** 30 minutes

**Task 1.1.2: Create Database and User**
- **Status:** Not started
- **Dependencies:** 1.1.1
- **Instructions:**
  1. Connect to MariaDB as root: `mysql -u root -p`
  2. Create database: `CREATE DATABASE veironauto;`
  3. Create user: `CREATE USER 'veiron_user'@'localhost' IDENTIFIED BY 'secure_password';`
  4. Grant permissions: `GRANT ALL PRIVILEGES ON veironauto.* TO 'veiron_user'@'localhost';`
  5. Flush privileges: `FLUSH PRIVILEGES;`
  6. Test connection with new user
- **Acceptance Criteria:** Database created, user can connect and has proper permissions
- **Estimated Time:** 15 minutes

**Task 1.1.3: Design Database Schema**
- **Status:** Not started
- **Dependencies:** 1.1.2
- **Instructions:**
  1. Create `database/schema.sql` file
  2. Design cars table with fields: id, brand, model, class, transmission, fuel_type, seats, price_ron, price_eur, available
  3. Design bookings table with fields: id, user_id, car_id, pickup_location, dropoff_location, pickup_date, dropoff_date, total_price, status
  4. Design users table for admin accounts
  5. Add proper indexes and foreign keys
  6. Document schema design decisions
- **Acceptance Criteria:** Complete SQL schema file with all tables, relationships, and indexes
- **Estimated Time:** 2 hours

#### 1.2 Project Structure Optimization (5/15 tasks)
**Priority:** 🟡 MEDIUM (Infrastructure improvements)

**Task 1.2.1: Set Proper File Permissions**
- **Status:** Not started
- **Dependencies:** None
- **Instructions:**
  1. Set directory permissions: `chmod 755` for all directories
  2. Set file permissions: `chmod 644` for all files
  3. Set executable permissions for scripts: `chmod +x`
  4. Verify permissions with `ls -la`
  5. Document permission structure
- **Acceptance Criteria:** All files and directories have appropriate permissions
- **Estimated Time:** 30 minutes

**Task 1.2.2: Create README Files**
- **Status:** Not started
- **Dependencies:** None
- **Instructions:**
  1. Create `README.md` in project root with project overview
  2. Create `README.md` in each major directory explaining purpose
  3. Include setup instructions, file structure, and usage guidelines
  4. Add contribution guidelines
  5. Document development workflow
- **Acceptance Criteria:** All major directories have informative README files
- **Estimated Time:** 1 hour

#### 1.3 Asset Organization (5/15 tasks)
**Priority:** 🟡 MEDIUM (Development efficiency)

**Task 1.3.1: Create Main CSS Import File**
- **Status:** Not started
- **Dependencies:** None
- **Instructions:**
  1. Create `assets/css/main.css`
  2. Import all CSS files in correct order:
     - base.css (CSS variables and reset)
     - layout.css (grid system)
     - typography.css (fonts)
     - utilities.css (helper classes)
     - components/*.css (component styles)
     - pages/*.css (page-specific styles)
  3. Test CSS loading order
  4. Optimize for production
- **Acceptance Criteria:** Single CSS file that imports all styles correctly
- **Estimated Time:** 45 minutes

**Task 1.3.2: Set Up JavaScript Module System**
- **Status:** Not started
- **Dependencies:** None
- **Instructions:**
  1. Create `assets/js/main.js` as entry point
  2. Set up ES6 module imports
  3. Create module structure for components
  4. Set up build process for production
  5. Test module loading
- **Acceptance Criteria:** Modular JavaScript system with proper imports/exports
- **Estimated Time:** 1 hour

---

### PHASE 2: Frontend Development (14/43 completed)

**Status:** Core structure in place, need to complete remaining HTML pages and CSS architecture

#### 2.1 Core HTML Structure (5/15 tasks)
**Priority:** 🔴 HIGH (Foundation for all other frontend work)

**Task 2.1.1: Create index-en.html (English Homepage)**
- **Status:** Not started
- **Dependencies:** index-ro.html (completed)
- **Instructions:**
  1. Copy `index-ro.html` to `index-en.html`
  2. Translate all Romanian text to English:
     - Navigation menu items
     - Hero section content
     - Feature descriptions
     - Footer content
  3. Update language attributes: `lang="en"`
  4. Update currency displays from RON to EUR
  5. Update phone numbers and addresses if needed
  6. Test responsive design matches Romanian version
  7. Verify all links work correctly
- **Acceptance Criteria:** English homepage identical in structure to Romanian, all content translated
- **Estimated Time:** 2 hours

**Task 2.1.2: Create catalog-ro.html (Romanian Catalog Page)**
- **Status:** Not started
- **Dependencies:** None
- **Instructions:**
  1. Create `catalog-ro.html` with proper HTML5 structure
  2. Include header and footer from index-ro.html
  3. Create main content area with:
     - Search filters sidebar (left)
     - Car grid display (right)
     - Sorting controls (top of grid)
  4. Add filter controls:
     - Car class (Economy, Standard, Premium, Luxury)
     - Price range slider
     - Transmission type (Manual/Automatic)
     - Fuel type (Petrol, Diesel, Hybrid, Electric)
     - Brand selection
  5. Create car card template with:
     - Car image (placeholder)
     - Brand and model
     - Class and transmission
     - Price in RON
     - "Book Now" button
  6. Add pagination controls
  7. Test responsive design (desktop-first)
- **Acceptance Criteria:** Functional catalog page with filters and car grid
- **Estimated Time:** 3 hours

**Task 2.1.3: Create catalog-en.html (English Catalog Page)**
- **Status:** Not started
- **Dependencies:** 2.1.2 (catalog-ro.html)
- **Instructions:**
  1. Copy `catalog-ro.html` to `catalog-en.html`
  2. Translate all Romanian text to English
  3. Update currency displays to EUR
  4. Update language attributes
  5. Test functionality matches Romanian version
- **Acceptance Criteria:** English catalog page with translated content and EUR pricing
- **Estimated Time:** 1 hour

**Task 2.1.4: Create booking-ro.html (Romanian Booking Page)**
- **Status:** Not started
- **Dependencies:** None
- **Instructions:**
  1. Create `booking-ro.html` with multi-step wizard structure
  2. Step 1 - Car Selection:
     - Grid of available cars
     - Car details and pricing
     - "Select Car" button for each
  3. Step 2 - Personal Details:
     - Form fields: First Name, Last Name, Email, Phone
     - Driver license information
     - Additional services selection (GPS, child seats, etc.)
  4. Step 3 - Location & Dates:
     - Pickup location dropdown
     - Dropoff location dropdown
     - Date pickers for pickup and dropoff
     - Time selection
  5. Step 4 - Summary & Confirmation:
     - Booking summary display
     - Total price calculation
     - Terms and conditions checkbox
     - "Confirm Booking" button
  6. Add progress indicator at top
  7. Add booking summary sidebar
  8. Implement form validation
- **Acceptance Criteria:** Complete booking wizard with all steps functional
- **Estimated Time:** 4 hours

**Task 2.1.5: Create booking-en.html (English Booking Page)**
- **Status:** Not started
- **Dependencies:** 2.1.4 (booking-ro.html)
- **Instructions:**
  1. Copy `booking-ro.html` to `booking-en.html`
  2. Translate all Romanian text to English
  3. Update currency displays to EUR
  4. Update language attributes
  5. Test booking flow matches Romanian version
- **Acceptance Criteria:** English booking page with translated content and EUR pricing
- **Estimated Time:** 1 hour

#### 2.2 Base Styles & Layout (0/10 tasks)
**Priority:** 🔴 HIGH (Required for all styling)

**Task 2.2.1: Create base.css (CSS Variables and Reset)**
- **Status:** Not started
- **Dependencies:** None
- **Instructions:**
  1. Create `assets/css/common/base.css`
  2. Define CSS custom properties:
     ```css
     :root {
       /* Colors */
       --primary-color: #007bff;
       --secondary-color: #6c757d;
       --accent-color: #28a745;
       --danger-color: #dc3545;
       --warning-color: #ffc107;
       --info-color: #17a2b8;
       --light-color: #f8f9fa;
       --dark-color: #343a40;
       
       /* Typography */
       --font-family-base: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
       --font-family-headings: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
       --font-size-base: 16px;
       --line-height-base: 1.5;
       
       /* Spacing */
       --spacing-unit: 8px;
       --container-padding: 1rem;
       
       /* Breakpoints */
       --breakpoint-sm: 576px;
       --breakpoint-md: 768px;
       --breakpoint-lg: 992px;
       --breakpoint-xl: 1200px;
     }
     ```
  3. Add CSS reset/normalize styles
  4. Set up base typography styles
  5. Define base layout containers
  6. Test cross-browser compatibility
- **Acceptance Criteria:** CSS variables defined, reset styles applied, base typography working
- **Estimated Time:** 1.5 hours

**Task 2.2.2: Create layout.css (Grid System)**
- **Status:** Not started
- **Dependencies:** 2.2.1 (base.css)
- **Instructions:**
  1. Create `assets/css/common/layout.css`
  2. Implement responsive grid system:
     ```css
     .container {
       max-width: 1200px;
       margin: 0 auto;
       padding: 0 var(--container-padding);
     }
     
     .row {
       display: flex;
       flex-wrap: wrap;
       margin: 0 calc(-1 * var(--spacing-unit));
     }
     
     .col {
       flex: 1;
       padding: 0 var(--spacing-unit);
     }
     
     /* Responsive columns */
     .col-sm-12 { flex: 0 0 100%; }
     .col-md-6 { flex: 0 0 50%; }
     .col-lg-4 { flex: 0 0 33.333%; }
     .col-xl-3 { flex: 0 0 25%; }
     ```
  3. Add utility classes for layout
  4. Add flexbox utilities
  5. Test responsive behavior across breakpoints
- **Acceptance Criteria:** Responsive grid system working on all screen sizes
- **Estimated Time:** 2 hours

**Task 2.2.3: Create typography.css (Font Definitions)**
- **Status:** Not started
- **Dependencies:** 2.2.1 (base.css)
- **Instructions:**
  1. Create `assets/css/common/typography.css`
  2. Define font hierarchy:
     ```css
     h1 { font-size: 2.5rem; font-weight: 700; margin-bottom: 1rem; }
     h2 { font-size: 2rem; font-weight: 600; margin-bottom: 0.875rem; }
     h3 { font-size: 1.75rem; font-weight: 600; margin-bottom: 0.75rem; }
     h4 { font-size: 1.5rem; font-weight: 500; margin-bottom: 0.625rem; }
     h5 { font-size: 1.25rem; font-weight: 500; margin-bottom: 0.5rem; }
     h6 { font-size: 1rem; font-weight: 500; margin-bottom: 0.375rem; }
     ```
  3. Create text utility classes
  4. Configure font loading optimization
  5. Add font-weight variations
  6. Test font rendering across devices
- **Acceptance Criteria:** Typography system working with proper hierarchy
- **Estimated Time:** 1 hour

**Task 2.2.4: Create utilities.css (Helper Classes)**
- **Status:** Not started
- **Dependencies:** 2.2.1 (base.css)
- **Instructions:**
  1. Create `assets/css/common/utilities.css`
  2. Add spacing utilities:
     ```css
     .m-0 { margin: 0; }
     .mt-1 { margin-top: var(--spacing-unit); }
     .mb-2 { margin-bottom: calc(2 * var(--spacing-unit)); }
     .p-3 { padding: calc(3 * var(--spacing-unit)); }
     ```
  3. Add color utilities
  4. Add display utilities
  5. Add positioning utilities
  6. Add text alignment utilities
  7. Test utility class functionality
- **Acceptance Criteria:** All utility classes working correctly
- **Estimated Time:** 1 hour

#### 2.3 Component Styles (0/8 tasks)
**Priority:** 🟡 MEDIUM (Required for UI components)

**Task 2.3.1: Create buttons.css (Button Variants)**
- **Status:** Not started
- **Dependencies:** 2.2.1 (base.css)
- **Instructions:**
  1. Create `assets/css/components/buttons.css`
  2. Design primary button styles:
     ```css
     .btn-primary {
       background-color: var(--primary-color);
       color: white;
       border: none;
       padding: 0.75rem 1.5rem;
       border-radius: 0.375rem;
       font-weight: 500;
       cursor: pointer;
       transition: background-color 0.2s;
     }
     ```
  3. Design secondary and outline button variants
  4. Add disabled button states
  5. Create hover and focus effects
  6. Add loading state animations
  7. Ensure accessibility compliance
  8. Test button interactions
- **Acceptance Criteria:** All button variants working with proper styling and interactions
- **Estimated Time:** 1.5 hours

**Task 2.3.2: Create forms.css (Form Styling)**
- **Status:** Not started
- **Dependencies:** 2.2.1 (base.css)
- **Instructions:**
  1. Create `assets/css/components/forms.css`
  2. Style form inputs and labels:
     ```css
     .form-group {
       margin-bottom: 1rem;
     }
     
     .form-label {
       display: block;
       margin-bottom: 0.5rem;
       font-weight: 500;
     }
     
     .form-control {
       width: 100%;
       padding: 0.75rem;
       border: 1px solid #ced4da;
       border-radius: 0.375rem;
       font-size: 1rem;
     }
     ```
  3. Create validation error states
  4. Style form groups and layouts
  5. Design custom select dropdowns
  6. Style checkboxes and radio buttons
  7. Create responsive form layouts
  8. Add focus states
  9. Test form accessibility
- **Acceptance Criteria:** All form elements styled consistently and accessible
- **Estimated Time:** 2 hours

**Task 2.3.3: Create cards.css (Car Card Design)**
- **Status:** Not started
- **Dependencies:** 2.2.1 (base.css)
- **Instructions:**
  1. Create `assets/css/components/cards.css`
  2. Design car card layout with dark background:
     ```css
     .car-card {
       background: #1a1a1a;
       border-radius: 0.5rem;
       padding: 1rem;
       margin-bottom: 1rem;
       transition: transform 0.2s;
     }
     
     .car-card:hover {
       transform: translateY(-2px);
     }
     ```
  3. Create responsive grid (4/row desktop, 2-3/row tablet, 1/row mobile)
  4. Style car images with aspect ratio
  5. Style car information display
  6. Create price band styling
  7. Add icon displays (seats, luggage, etc.)
  8. Add hover effects and interactions
  9. Test responsive breakpoints
- **Acceptance Criteria:** Car cards displaying correctly in responsive grid
- **Estimated Time:** 2 hours

---

## Next Steps & Immediate Actions

### This Week's Priority Tasks:
1. **Complete PHASE 1 setup tasks** (1.5 hours)
2. **Begin PHASE 2 core HTML structure** (4 hours)
3. **Set up CSS architecture** (2 hours)

### Blocking Issues to Resolve:
- None currently identified

### Dependencies to Monitor:
- Database setup before backend development
- CSS architecture before component styling
- HTML structure before JavaScript functionality

---

**Document Version:** 1.0
**Last Updated:** 2025-01-22
**Next Review:** 2025-01-29
**Status:** Active Development Document