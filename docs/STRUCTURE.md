# Nobat Plugin Structure

**Version:** 2.2.0  
**Last Updated:** August 2026

This document provides a comprehensive overview of the Nobat plugin's structure, architecture, and organization.

---

## 📁 Directory Structure

```
nobat/
├── nobat.php                    # Main plugin file & entry point
├── composer.json                # PHP dependencies & PSR-4 autoloading
├── package.json                 # JavaScript dependencies & build scripts
├── webpack.config.js            # Webpack build configuration
│
├── includes/                    # PHP source code
│   ├── Core/                    # Core infrastructure
│   │   ├── Container.php        # Dependency injection container
│   │   ├── DatabaseManager.php  # Database schema management
│   │   └── DatabaseTransaction.php # Transaction handling
│   │
│   ├── Repositories/            # Data access layer (Repository pattern)
│   │   ├── BaseRepository.php
│   │   ├── ScheduleRepository.php
│   │   ├── WorkingHoursRepository.php
│   │   ├── SlotRepository.php
│   │   ├── AppointmentRepository.php
│   │   ├── AppointmentHistoryRepository.php
│   │   └── UserRepository.php
│   │
│   ├── Services/                # Business logic layer
│   │   ├── AuthService.php
│   │   ├── ScheduleService.php
│   │   ├── SlotService.php
│   │   └── AppointmentService.php
│   │
│   ├── Controllers/             # REST API controllers
│   │   ├── AppointmentController.php
│   │   ├── ScheduleController.php
│   │   └── SlotController.php
│   │
│   ├── Middleware/              # API middleware
│   │   └── AuthMiddleware.php
│   │
│   ├── Utilities/               # Helper classes
│   │   ├── DateTimeHelper.php
│   │   ├── Validator.php
│   │   └── SlotGenerator.php
│   │
│   ├── Admin/                   # Admin UI classes
│   │   ├── AppointmentsListTable.php
│   │   └── ScheduleListTable.php
│   │
│   ├── Core/Router.php          # REST API route registration (nobat/v2)
│   ├── Core/ShortcodeHandler.php # Booking shortcodes
│   ├── bootstrap.php            # DI container initialization
│   ├── activation.php           # Plugin activation logic
│   ├── helpers.php              # Shared PHP helpers
│   ├── admin-menu.php           # Admin menu registration
│   ├── admin-page.php           # Admin page callbacks
│   ├── admin-settings.php       # Settings page
│   └── enqueue-scripts.php      # Asset enqueuing
│
├── src/                         # JavaScript/React source
│   ├── admin/                   # Admin React components
│   │   ├── cal/                 # Calendar view
│   │   │   ├── index.js
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── utils/
│   │   └── schedule/            # Schedule builder
│   │       ├── index.js
│   │       └── components/
│   ├── frontend/              # Frontend booking interface (Soft Slot)
│   │   ├── index.js
│   │   ├── soft-slot/          # Design tokens & booking form CSS
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── hooks/
│   │   └── utils/
│   ├── ui/                      # Shared UI components
│   ├── hooks/                   # Shared React hooks
│   ├── lib/                     # Shared JS helpers
│   └── utils/                   # i18n, api-fetch, dom-ready
│
├── design-system/               # Soft Slot design system docs
│
├── build/                       # Compiled assets (generated)
│   ├── cal.js / cal.css
│   ├── schedule.js / schedule.css
│   ├── frontend.js / frontend.css
│   └── *.asset.php
│
├── languages/                   # Translation files
│   ├── nobat.pot                # Translation template
│   ├── nobat-fa_IR.po           # Persian translations
│   ├── nobat-fa_IR.mo
│   └── nobat-fa_IR-*.json       # JS translations
│
├── docs/                        # Documentation
│   ├── README.md                # Documentation index
│   ├── STRUCTURE.md             # This file
│   ├── API-ENDPOINTS.md         # API reference
│   ├── ARCHITECTURE.md          # Architecture overview
│   ├── DATABASE-SCHEMA.md       # Database documentation
│   ├── DEVELOPER-GUIDE.md       # Development guide
│   ├── STATUS-REFERENCE.md      # Status value reference
│   └── LANDING-PAGE-CONTENT.json # Marketing landing handoff
│
├── vendor/                      # Composer dependencies (generated)
│   └── autoload.php
│
└── node_modules/                # NPM dependencies (generated)
```

---

## 🏗️ Architecture Overview

### Clean Architecture Layers

The plugin follows **Clean Architecture** principles with clear separation of concerns:

```
┌─────────────────────────────────────────────┐
│          Presentation Layer                 │
│  (Admin UI, REST API Controllers)           │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│          Service Layer                      │
│  (Business Logic, Use Cases)                │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│          Repository Layer                   │
│  (Data Access, Database Operations)         │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│          Database Layer                     │
│  (MySQL Tables)                             │
└─────────────────────────────────────────────┘
```

### Key Patterns

1. **Repository Pattern**

   - Abstracts database operations
   - Located in `includes/Repositories/`
   - Extends `BaseRepository`

2. **Service Layer**

   - Encapsulates business logic
   - Located in `includes/Services/`
   - Uses repositories for data access

3. **Dependency Injection**

   - Container in `includes/Core/Container.php`
   - Configured in `includes/bootstrap.php`
   - Services resolved via `nobat_service()`

4. **Controller Pattern**
   - REST API endpoints
   - Located in `includes/Controllers/`
   - Delegates to services

---

## 📊 Database Structure

### Tables (Prefix: `wp_nobat_`)

1. **schedules** - Schedule metadata
2. **working_hours** - Working hours per day/schedule
3. **slots** - Individual time slots (auto-generated)
4. **appointments** - User appointments
5. **history** - Appointment change history

See [DATABASE-SCHEMA.md](DATABASE-SCHEMA.md) for complete schema documentation.

---

## 🔌 API Structure

### REST API

**Namespace:** `/wp-json/nobat/v2/`

**Controllers:**

- `AppointmentController` — Appointment management
- `ScheduleController` — Schedule CRUD
- `SlotController` — Slot management

Routes are registered in `includes/Core/Router.php`.

**Authentication:**

- `AuthMiddleware` handles permission checks
- Cookie/nonce auth for logged-in users and admins
- Some schedule/slot read endpoints are public where needed for booking

See [API-ENDPOINTS.md](API-ENDPOINTS.md) for complete API documentation.

---

## 🎨 Frontend Structure

### React Applications

**Admin:**

1. **Calendar** (`src/admin/cal/`) — Admin → Nobat → Calendar
2. **Schedule builder** (`src/admin/schedule/`) — Create/edit schedules

**Frontend booking (Soft Slot):**

3. **Booking interface** (`src/frontend/`)
   - Shortcode: `[nobat_booking]`
   - Optional attribute: `schedule_id`
   - Features: login gate, my appointments, book flow, cancellation requests
   - Brand colors from Settings inject Soft Slot `--accent*` tokens

Assets load conditionally from `includes/enqueue-scripts.php` for admin pages and when a booking shortcode is present.

---

## 🔧 Development Workflow

### Building Assets

```bash
# Development (watch mode)
npm run start

# Production build
npm run build
```

### Autoloading

```bash
# Regenerate Composer autoloader
composer dump-autoload
```

### Adding a New Feature

1. **Database**: Add migration in `DatabaseManager`
2. **Repository**: Create repository class
3. **Service**: Create service class
4. **Controller**: Create API controller
5. **Routes**: Register in `includes/Core/Router.php`
6. **Bootstrap**: Wire up in `bootstrap.php`
7. **UI**: Create React components

---

## 📦 Dependency Management

### PHP Dependencies (Composer)

Currently using **PSR-4 autoloading only** (no external dependencies):

```json
{
  "autoload": {
    "psr-4": {
      "Nobat\\": "includes/"
    }
  }
}
```

### JavaScript Dependencies (NPM)

Key dependencies:

- `@wordpress/components` - UI components
- `@wordpress/element` - React wrapper
- `@wordpress/i18n` - Internationalization
- `@wordpress/api-fetch` - API client
- `@wordpress/scripts` - Build tools

---

## 🌐 Internationalization (i18n)

### Text Domain

All translatable strings use the `nobat` text domain:

```php
__( 'Schedule Name', 'nobat' )
_e( 'Save Settings', 'nobat' )
```

### Translation Files

Located in `languages/`:

- `nobat.pot` - Translation template
- `nobat-{locale}.po` - Translations
- `nobat-{locale}.mo` - Compiled translations
- `nobat-{locale}-{hash}.json` - JS translations

### Generating POT File

```bash
wp i18n make-pot . languages/nobat.pot
```

---

## 🔐 Security

### Authentication

- Admin pages: `current_user_can( 'manage_options' )`
- API v2: `AuthMiddleware` checks permissions
- Nonce verification for AJAX requests

### Data Validation

- Input sanitization: `sanitize_text_field()`, `sanitize_email()`
- SQL injection prevention: `$wpdb->prepare()`
- XSS prevention: `esc_html()`, `esc_attr()`, `esc_url()`

### Database

- Foreign keys for data integrity
- Transactions for atomic operations
- Prepared statements for all queries

---

## 🎯 Key Concepts

### 1. Schedule System

A **schedule** defines:

- Date range (start/end with Jalali support)
- Working hours per day of week
- Meeting duration & buffer time
- Auto-generated time slots

### 2. Slot Generation

Slots are **automatically generated** when a schedule is created:

- Based on working hours
- Respects meeting duration & buffer
- Created for each day in range
- Status: available/booked/blocked

### 3. Appointment Workflow

1. User selects slot
2. System checks availability
3. Creates appointment (status: pending)
4. Admin can confirm
5. User can request cancellation
6. Admin approves/denies
7. Admin marks as completed

### 4. User Limits

- Max 3 active appointments per user
- Enforced in `AppointmentService`
- Configurable in Settings (and via filter)

---

## 🚀 Performance Considerations

### Database Optimization

- Indexed columns: `schedule_id`, `slot_date`, `status`, `user_id`
- Unique constraints on slot combinations
- Foreign keys with cascade deletes

### Asset Loading

- Conditional loading (only on plugin pages)
- Minified production builds
- Separate bundles for each admin page

### Caching

Currently **no caching layer**. Future consideration:

- Transient API for schedule data
- Object cache for slot availability
- Page cache compatibility

---

## 📖 Related Documentation

- [API Reference](API-ENDPOINTS.md)
- [Architecture](ARCHITECTURE.md)
- [Database Schema](DATABASE-SCHEMA.md)
- [Developer Guide](DEVELOPER-GUIDE.md)
- [Status Reference](STATUS-REFERENCE.md)
- [Landing page content](LANDING-PAGE-CONTENT.json)

---

**Current Version:** 2.2.0

---

_This document is the authoritative source for plugin structure information._
