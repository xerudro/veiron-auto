# Workflow Optimizat – Taskuri

- Poți bifa mai multe taskuri odată (batch complete): selectezi și marchezi cu [x]
- Taskurile cu dependențe nerezolvate sunt marcate automat BLOCKED
- Pentru filtrare rapidă: caută 🔴 (BLOCKED) sau 🟢 (independent)
- Rulează scripturile pentru progres și log zilnic

---

# PRIORITATE: BLOCKER & DEPENDENȚE

## Taskuri BLOCKER (🔴)
- Install MariaDB and configure user/app database (1.1.1)
- Create database schema (1.1.2) [depinde de 1.1.1]
- Create directory structure (1.2.1)
- Set up public_html and app directories (1.2.2) [depinde de 1.2.1]
- Create organized assets structure (1.3.1) [depinde de 1.2.2]
- Create booking-ro.html (Romanian booking page) [depinde de 2.1.1]
- Create forms.css with form styling and validation states [depinde de 2.2.1]
- Create cards.css with car card design [depinde de 2.2.1]
- Create base.css with CSS variables and reset styles [depinde de 1.3.2]
- Create layout.css with grid system and containers [depinde de 2.2.1]
- Create app.js with main application logic [depinde de structura HTML de bază]
- Create config.js with application configuration
- Create filters.js for live car filtering [depinde de app.js]
- Create catalog.js for catalog page [depinde de filters.js]
- Create en.js with English translations [depinde de index-en.html]
- Create ro.js with Romanian translations [depinde de index-ro.html]
- Create currency.js for currency conversion [depinde de utils.js]
- Implement language detection and switching [depinde de en.js, ro.js]
- Create cars.json with car data structure [depinde de seed data]
- Create database.php for database connection [depinde de 1.1.1]
- Create email.php for PHPMailer configuration

## Taskuri cu dependențe explicite
- Create database schema (1.1.2) → depinde de Install MariaDB (1.1.1)
- Set up public_html and app directories (1.2.2) → depinde de Create directory structure (1.2.1)
- Create organized assets structure (1.3.1) → depinde de Set up public_html and app directories (1.2.2)
- Create catalog-en.html → depinde de catalog-ro.html
- Create booking-en.html → depinde de booking-ro.html
- Create contact-en.html → depinde de contact-ro.html
- Create layout.css → depinde de base.css
- Create typography.css → depinde de base.css
- Create utilities.css → depinde de base.css
- Create gallery.js → depinde de lightGallery
- Create carousel.js → depinde de Swiper
- Create admin.js → depinde de api.js
- Create config.json → depinde de config.js

---

# Taskuri Active - VEIRONAUTO (importate din VEIRONAUTO_TODO_LIST.md)

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
- [ ] Set proper permissions (755 for directories, 644 for files)
- [ ] Create README files for each directory
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
- [ ] Add README files explaining structure
- [ ] Create main.css to import all styles
- [ ] Set up CSS build process
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
- [ ] Create index-en.html (English version)
- [ ] Create catalog-ro.html (Romanian catalog page)
- [ ] Create catalog-en.html (English catalog page)
- [ ] Create booking-ro.html (Romanian booking page)
- [ ] Create booking-en.html (English booking page)
- [ ] Create contact-ro.html (Romanian contact page)
- [ ] Create contact-en.html (English contact page)
- [ ] Create politica-de-confidentialitate.html (Romanian privacy policy page)
  - [ ] Structurare semantică cu <h1>, <h2>, <p>, <ul>, <li>
  - [ ] Adăugare titlu și conținut conform legislației
  - [ ] Integrare header și footer identic cu restul site-ului
  - [ ] Adăugare link în footer la Legal & ANPC
  - [ ] Testare responsive și compatibilitate
- [ ] Create privacy-policy.html (English privacy policy page)
  - [ ] Traducere și structurare identică cu varianta RO
  - [ ] Integrare header și footer
  - [ ] Adăugare link în footer la Legal & ANPC
  - [ ] Testare responsive și compatibilitate
- [x] Create termeni-si-conditii.html (Romanian terms and conditions page)
  - [x] Structurare identică cu politica-de-confidentialitate.html
  - [x] Titlu, subtitlu, prima secțiune (Rezervare - Predare/Primire - Plata)
  - [x] Integrare header și footer sincronizate
  - [x] Script dinamic pentru Veiron Daune/Assessments
- [x] Create terms-and-conditions.html (English terms and conditions page)
  - [x] Structurare identică cu varianta RO
  - [x] Titlu, subtitlu, prima secțiune (Reservation - Handover/Return - Payment)
  - [x] Integrare header și footer sincronizate
  - [x] Script dinamic pentru Veiron Daune/Assessments

### 2.2 Base Styles & Layout
- [ ] Create base.css with CSS variables and reset styles
- [ ] Create layout.css with grid system and containers
- [ ] Create typography.css with font definitions
- [ ] Create utilities.css with helper classes

### 2.3 Component Styles
- [ ] Create buttons.css with button variants and states
- [ ] Create forms.css with form styling and validation states
- [ ] Create cards.css with car card design
- [ ] Create gallery.css for lightGallery custom styling
- [ ] Create carousel.css for Swiper custom styling

### 2.4 Page-Specific Styles
- [ ] Create catalog.css for car catalog page
- [ ] Create contact.css for contact page
- [ ] Create admin.css for admin panel
- [ ] Adaugă styling dedicat pentru pagina Politica de Confidențialitate în contact-ro.css sau un fișier separat dacă e nevoie
- [ ] Asigură-te că titlurile, paragrafele și listele sunt lizibile și bine spațiate
- [ ] Testează compatibilitatea cu dark mode (dacă există)

### 2.5 Language & Currency Themes
- [ ] Create en-eur.css for English + EUR styling
- [ ] Create ro-ron.css for Romanian + RON styling
- [ ] Implement currency formatting and conversion
- [ ] Set up language switching functionality

### 2.6 Core JavaScript
- [ ] Create app.js with main application logic
- [ ] Create config.js with application configuration
- [ ] Create utils.js with utility functions
- [ ] Create api.js for API communication

### 2.7 Component Scripts
- [ ] Create filters.js for live car filtering
- [ ] Create gallery.js for lightGallery integration
- [ ] Create carousel.js for Swiper integration

### 2.8 Page-Specific Scripts
- [ ] Create catalog.js for catalog page
- [ ] Create contact.js for contact form
- [ ] Create admin.js for admin panel

### 2.9 Internationalization
- [ ] Create en.js with English translations
- [ ] Create ro.js with Romanian translations
- [ ] Create currency.js for currency conversion
- [ ] Implement language detection and switching
- [ ] Set up currency conversion rates

### 2.10 Data Files
- [ ] Create cars.json with car data structure
- [ ] Create services.json with additional services
- [ ] Create warranty.json with warranty plans
- [ ] Create countries.json with country codes and flags
- [ ] Create config.json with site configuration

### 2.11 Image Gallery & Carousel Integration
- [ ] Add thumbnail navigation for image galleries
- [ ] Implement touch gestures for mobile devices

## PHASE 3: Backend Development

### 3.1 Configuration
- [ ] Create database.php for database connection
- [ ] Create email.php for PHPMailer configuration

---

# Schimbări și implementări recente (iulie 2025)

- Footer-ul a fost refăcut și aplicat pe toate paginile principale (română și engleză)
- Styling-ul pentru footer a fost separat în footer.css pentru a nu afecta alte componente
- S-a adăugat link-ul Veiron Daune (https://veirondaune.ro) la secțiunea Legal & ANPC din footer
- S-a mărit spațiul (gap) între cele două coloane de link-uri din footer la 10rem pentru desktop
- S-au corectat butoanele din slider pentru a nu fi afectate de stilurile footer-ului
- S-au sincronizat toate modificările de layout și CSS între index-ro.html și index-en.html
- S-a verificat responsive și compatibilitatea pe desktop/mobil

## Responsive Issues - Hamburger Menu (documentare)

### Probleme identificate (iulie 2025)

- **booking.html** și **booking-en.html**
  - Hamburger menu (meniul mobil) NU funcționează pe ecrane mici (sub 900px):
    - Butonul de meniu nu deschide meniul de navigație.
    - Navigarea pe mobil devine imposibilă fără meniu.
  - Header-ul și meniul arată ok pe desktop, dar pe mobil nu există meniu funcțional.

- **contact.html** și **contact-en.html**
  - Aceeași problemă: hamburger menu nu deschide meniul pe mobil.
  - Navigarea pe mobil este afectată.

### Ce trebuie reparat
- Implementarea funcțională a hamburger menu-ului pe aceste pagini:
  - Să deschidă și să închidă meniul de navigație la click.
  - Să se închidă la click pe un link sau în afara meniului.
  - Să folosească același JS ca pe index.html (dacă e posibil, să fie DRY).
- Verificare suplimentară pe toate rezoluțiile mobile (320px, 375px, 480px, 600px, 768px).

### Status
- [x] De rezolvat la următorul refactor sau sprint de responsive. (Rezolvat iulie 2025)
- [x] Să se verifice dacă există fișiere JS lipsă sau dacă scriptul nu e inclus pe aceste pagini. (Rezolvat)

#### Notă:
Problema hamburger menu-ului a fost rezolvată prin includerea `<script src="assets/js/app.js"></script>` pe toate paginile relevante (booking.html, booking-en.html, contact.html, contact-en.html) și unificarea structurii header/nav cu cea de pe index.html. Meniul mobil funcționează acum corect pe toate rezoluțiile.

### Checklist de verificare (hamburger menu)
- [ ] Butonul hamburger apare pe ecrane sub 900px
- [ ] La click pe hamburger, meniul de navigație devine vizibil
- [ ] La click pe un link din meniu, meniul se închide automat
- [ ] La click în afara meniului, meniul se închide
- [ ] Iconul hamburger se schimbă (ex: bară ↔ X) când meniul e deschis/închis
- [ ] Navigarea funcționează pe toate paginile (booking, contact, etc.)
- [ ] Scriptul JS pentru meniu este inclus corect pe fiecare pagină
- [ ] Nu există erori JS în consolă pe mobil
- [ ] Testat pe rezoluții: 320px, 375px, 480px, 600px, 768px

### Pași de remediere sugerați
1. **Verifică dacă fișierul JS pentru hamburger menu (ex: app.js) este inclus pe toate paginile**
   - Dacă lipsește, adaugă `<script src="assets/js/app.js"></script>` înainte de `</body>`
2. **Asigură-te că structura HTML a header-ului și meniului este identică cu cea de pe index.html**
   - Copiază secțiunea de header/nav dacă e nevoie
3. **Verifică dacă există conflicte de CSS sau JS care ar putea bloca funcționalitatea**
   - Inspectează cu DevTools dacă meniul primește clasa `active` la click
4. **Testează funcționalitatea pe mobil și desktop**
   - Folosește Chrome DevTools (Device Toolbar) și telefoane reale dacă e posibil
5. **Refactorizează codul pentru a evita duplicarea JS/CSS între pagini**
   - Ideal: header și scripturi comune, importate peste tot
6. **Adaugă fallback pentru browsere vechi sau JS dezactivat (opțional)**
7. **Documentează orice modificare făcută în memory-bank/tasks.md**

### Problemă suplimentară: Imagine operator contact (responsive)
- Pe paginile **contact.html** și **contact-en.html**, imaginea cu operatorul (femeia) se ascunde parțial/sub header pe ecrane mici (ex: iPhone 15 Pro, Pixel 7 Pro, Surface Pro X).
- Problema apare la breakpoint-uri sub 900px, dar e vizibilă mai ales sub 480px și 400px.
- Imaginea nu este complet vizibilă, fiind tăiată de header sau de marginile containerului.

#### Ce trebuie investigat/remediat
- [ ] Să se ajusteze marginile/padding-ul de sus pentru ca poza să nu fie acoperită de header (ex: `margin-top` mai mare pe mobil).
- [ ] Să se verifice dacă există `z-index` sau `overflow` care ascunde imaginea.
- [ ] Să se testeze pe toate breakpoint-urile relevante (900px, 768px, 600px, 480px, 393px).
- [ ] Să se asigure că poza operatorului rămâne complet vizibilă și centrată pe toate dispozitivele.

### Problemă suplimentară: Bara de sumar rezervare acoperă footer-ul (responsive)
- Pe paginile de rezervare (booking.html, booking-en.html), pe ecrane mici (aceleași breakpoint-uri: 900px, 768px, 600px, 480px, 393px), bara de sumar rezervare (rezervation bar) acoperă footer-ul.
- Problema este vizibilă mai ales când bara este extinsă (se deschide în sus la click pe săgeată), dar și când e restrânsă.
- Footer-ul nu mai este complet vizibil sau accesibil, contextul legal și datele de contact pot fi ascunse.

#### Ce trebuie investigat/remediat
- [ ] Să se decidă dacă bara de sumar trebuie mutată mai sus pe mobil (ex: sub conținut, nu peste footer) sau dacă footer-ul trebuie împins mai sus cu un padding/margin-bottom egal cu înălțimea barei.
- [ ] Să se gestioneze două dimensiuni pentru bar: restrânsă și extinsă (height variabilă).
- [ ] Să se aplice padding/margin-bottom la containerul principal sau la footer, dinamic, în funcție de starea barei (JS sau CSS calc).
- [ ] Să se testeze pe toate breakpoint-urile relevante.
- [ ] Să se asigure că footer-ul rămâne mereu vizibil și accesibil, indiferent de starea barei de sumar.
