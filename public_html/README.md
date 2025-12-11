# VEIRONAUTO Web Platform

VEIRONAUTO is a bilingual (RO/EN) car rental platform delivered as both a static marketing site and a full stack application with an API driven booking system. This repository now reflects the two-package architecture so each deliverable can evolve independently while sharing a single source of truth.

## Deliverables at a Glance

- `frontend/` - responsive static site (HTML/CSS/JS) with booking UX, car fleet sections, legal pages, and a placeholder `admin/` shell for the upcoming Vue dashboard.
- `backend/` - PHP REST API with JWT authentication, booking and fleet management, email notifications, file uploads, logging, documentation, and smoke tests.
- `docs/` - developer handbooks, troubleshooting guides, pricing analysis, and release notes that explain how to operate the platform.
- `optimization-journey/` - research notes describing the decisions that led to the current structure.
- `.github/` - workflows and repository-level policies reused across releases.
- Root helper files - `PROJECT_RESTRUCTURE_PLAN.md`, `QUICK_START.md`, `SECURITY.md`, `VEIRONAUTO_TODO_LIST.md`, and PowerShell scripts for reporting progress.

## Repository Layout

```
public_html/
|-- frontend/
|   |-- admin/                # Vue dashboard scaffold (HTML only today)
|   |-- assets/
|   |   |-- css/
|   |   |-- images/
|   |   |-- js/
|   |   |   |-- app.js
|   |   |   |-- api-client.js
|   |   |   |-- booking.js / booking-en.js
|   |   |   |-- parc-auto.js / parc-auto-en.js
|   |   |   `-- config.js     # MODE/API toggles
|   |   `-- json/car-pricing-data.json
|   |-- *.html                # index-ro/en, booking, parc-auto, contact, despre-noi, policies
|   `-- README.md             # Frontend deployment guide
|-- backend/
|   |-- api/v1/               # Router, controllers, middleware
|   |-- config/               # api.php, email.php, DotEnv.php
|   |-- database/             # schema.sql, migrations/, seed/
|   |-- libs/, services/, uploads/, logs/
|   |-- docs/                 # API documentation set
|   |-- tests/                # php smoke tests (env, cars, email, booking)
|   |-- .env.example
|   `-- README.md             # Backend installation guide
|-- docs/                     # Operational guides and references
|-- optimization-journey/     # Process retrospectives
|-- .github/workflows/        # Automation & lint policies
|-- QUICK_START.md
|-- PROJECT_RESTRUCTURE_PLAN.md
|-- SECURITY.md
`-- README.md                 # You are here
```

## Choose Your Deployment Mode

### 1. Static Website Only (Frontend Package)

1. `cd frontend` and upload the contents to your host (`public_html`, `www`, Netlify, GitHub Pages, etc.).
2. Update `assets/js/config.js` so `MODE` stays `static` and `API_ENABLED` remains `false`.
3. Customize copy, pricing, and contact details in the HTML files and `assets/json/car-pricing-data.json`.
4. Preview locally with `npx http-server -p 8080 frontend` or `python -m http.server 8080`.

This mode needs only HTML hosting because all interactive pieces read from the JSON data file and the bundled scripts.

### 2. Full Stack Website (Frontend + Backend Package)

1. Deploy the `frontend/` folder as above.
2. Copy `backend/` to a secure server path (for example `/home/account/backend`).
3. Configure the environment file:
   ```bash
   cd backend
   cp .env.example .env
   # update DB credentials, SMTP, JWT secret, BASE_URL, etc.
   ```
4. Install dependencies and bootstrap the database:
   ```bash
   composer install
   mysql -u user -p dbname < database/schema.sql
   ```
5. Point Apache/Nginx rewrites at `backend/api/v1/index.php`, and allow `uploads/` plus `logs/` to be writable.
6. Run `php tests/test_env_config.php` and request `/backend/api/v1/health` to confirm the API is live.
7. Switch the frontend to API mode in `frontend/assets/js/config.js` (`MODE: 'api'`, `API_ENABLED: true`, `API_BASE_URL: '/backend/api/v1'` or the absolute URL).

## Frontend Highlights

- Romanian and English versions for every public page (`index-*.html`, `booking*.html`, `parc-auto*.html`, privacy and terms files).
- Booking widgets, car galleries, and pricing cards driven by `assets/json/car-pricing-data.json` plus the paired JS modules.
- Shared styling in `assets/css/` and modular scripts like `booking.js`, `parc-auto.js`, and `api-client.js` to keep localization isolated.
- `frontend/admin/` ships as an HTML shell so the Vue dashboard can be built without touching the public pages.

## Backend Highlights

- REST API under `backend/api/v1/` with controllers, models, handlers, middleware, and JWT-based auth helpers.
- Configuration files in `backend/config/`, `.env` support, and a full SQL schema, migrations, and seed data in `backend/database/`.
- Services for bookings, notifications, and email via PHPMailer, plus file upload pipelines (cars, gallery, temp, thumbnails).
- Operational tooling: log directories, health tests under `backend/tests/`, and detailed documentation in `backend/docs/`.

## Documentation & Support Resources

- `frontend/README.md` - deployment and customization guide for the static package.
- `backend/README.md` - installation checklist, requirements, and troubleshooting steps for the API stack.
- `docs/QUICK-REFERENCE.md` - condensed commands and common tasks.
- `docs/TROUBLESHOOTING-IMAGES.md` and `docs/TROUBLESHOOTING-PRICING.md` - playbooks for the issues we hit most often.
- `PROJECT_RESTRUCTURE_PLAN.md` - narrative behind the new layout and naming updates.
- `SECURITY.md` - disclosure process and expectations for both packages.
- `VEIRONAUTO_TODO_LIST.md` - running backlog of enhancements and follow ups.

## Development Tips

- Follow `docs/README.md` for lightweight local servers, Git helpers, and asset checklists.
- Keep `car-pricing-data.json`, `parc-auto*.js`, and the matching HTML cards synchronized whenever you add or remove fleet items.
- Test `frontend/assets/js/api-client.js` against `/backend/api/v1/health` before exposing API mode to customers.
- The PowerShell helpers (`update-progress.ps1`, `update-tasks.ps1`, `check-files.ps1`) in the repo root keep reporting artifacts aligned with the new structure.
- CI/CD and shared policies live under `.github/workflows/`; update them whenever the release flow changes.

---

Last updated: December 2025 (post-restructure). Update this README whenever directories move or when deployment steps change.
