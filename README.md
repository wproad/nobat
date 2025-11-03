# Nobat (نوبت) - WordPress Appointment Booking Plugin

**Version:** 2.2.0  
**Requires WordPress:** 6.1+  
**Requires PHP:** 7.4+  
**License:** GPL-2.0-or-later  
**Text Domain:** nobat

A modern, feature-rich appointment booking system for WordPress with admin management, Persian calendar support, and a clean architecture.

## ✨ Features

### Core Functionality

- 🗓️ **Schedule Management**: Create and manage multiple schedules with custom working hours
- 📅 **Persian Calendar Support**: Full Jalali (Shamsi) calendar integration
- 👥 **User-Based Appointments**: Appointments tied to WordPress user accounts
- 🔄 **Cancellation Workflow**: Users can request cancellations, admins approve/deny
- 📊 **Admin Calendar View**: Visual weekly calendar with drag-and-drop slot management
- 🎯 **Appointment Limits**: Configurable max active appointments per user (default: 3)
- ✅ **Status Tracking**: Pending, confirmed, completed, cancelled states with history
- 🔐 **Role-Based Access**: Secure API with admin/user permission checks

### Technical Features

- 🏗️ **Clean Architecture**: Repository pattern, service layer, dependency injection
- 🔌 **REST API v2**: Modern, versioned API with full authentication
- 📦 **PSR-4 Autoloading**: Composer-based class autoloading
- 🎨 **React Admin UI**: Modern, responsive admin interface
- 🌍 **Translation Ready**: Full i18n support with `.pot` file
- 🗄️ **Normalized Database**: Proper relational schema (no JSON storage)

## 📦 Installation

### Quick Install

1. Upload the plugin folder to `/wp-content/plugins/nobat/`
2. Install dependencies and build assets:
   ```bash
   cd /wp-content/plugins/nobat/
   composer install
   npm install
   npm run build
   ```
3. Activate the plugin through the 'Plugins' menu in WordPress
4. The database will be created/updated automatically

### Manual Installation

```bash
# Clone or download the plugin
cd /wp-content/plugins/
git clone https://github.com/your-username/nobat.git

# Install dependencies
cd nobat
composer install --no-dev
npm install
npm run build
```

## 🚀 Quick Start

### For Users (Booking Appointments)

Users must be logged in to book appointments. Add the booking form to any page or post using one of these shortcodes:

**New Booking Interface (Recommended):**

```
[nobat_new]
```

**Legacy Booking Interface:**

```
[nobat_booking]
```

**Note:** Guests will see a login prompt. Users are limited to 3 active appointments by default. The `nobat_new` shortcode uses the modern React-based booking interface, while `nobat_booking` is the legacy interface (to be deprecated in a future release).

### For Admins (Managing Appointments)

1. Navigate to **Nobat** in the WordPress admin menu
2. **Add Schedule**: Create a new schedule with working hours
3. **Calendar View**: Manage appointments visually on the calendar
4. **Cancellations**: Review and process cancellation requests
5. **Settings**: Configure global plugin settings

## 📚 Documentation

### Admin Menu Structure

- **Nobat**
  - All Appointments
  - Calendar View (`nobat-cal`)
  - Add Schedule (`nobat-scheduling`)
  - All Schedules (`nobat-schedules`)
  - Cancellations (`nobat-cancellations`)
  - Settings (`nobat-settings`)

### Database Schema

The plugin creates 5 normalized tables:

- `wp_nobat_schedules` — Schedule metadata
- `wp_nobat_working_hours` — Working hours per schedule and day
- `wp_nobat_slots` — Individual time slots (auto-generated)
- `wp_nobat_appointments` — User appointments
- `wp_nobat_history` — Appointment status change history

For detailed schema documentation, see [docs/DATABASE-SCHEMA.md](docs/DATABASE-SCHEMA.md)

### REST API v2

All endpoints use the namespace `nobat/v2`:

#### Appointments

- `GET /wp-json/nobat/v2/appointments` — List appointments (admin/user)
- `POST /wp-json/nobat/v2/appointments` — Create appointment (authenticated users)
- `GET /wp-json/nobat/v2/appointments/{id}` — Get single appointment
- `PUT /wp-json/nobat/v2/appointments/{id}` — Update appointment (admin)
- `DELETE /wp-json/nobat/v2/appointments/{id}` — Delete appointment (admin)
- `POST /wp-json/nobat/v2/appointments/{id}/cancel` — Request/approve cancellation
- `POST /wp-json/nobat/v2/appointments/{id}/confirm` — Deny cancellation request
- `POST /wp-json/nobat/v2/appointments/{id}/complete` — Mark as completed (admin)

#### Schedules

- `GET /wp-json/nobat/v2/schedules` — List all schedules (admin)
- `POST /wp-json/nobat/v2/schedules` — Create schedule (admin)
- `GET /wp-json/nobat/v2/schedules/{id}` — Get schedule by ID
- `PUT /wp-json/nobat/v2/schedules/{id}` — Update schedule (admin)
- `DELETE /wp-json/nobat/v2/schedules/{id}` — Delete schedule (admin)
- `GET /wp-json/nobat/v2/schedules/active` — Get active schedule (public)

#### Slots

- `GET /wp-json/nobat/v2/slots` — List slots (with filters)
- `GET /wp-json/nobat/v2/slots/{id}` — Get single slot
- `PUT /wp-json/nobat/v2/slots/{id}` — Update slot status (admin)
- `POST /wp-json/nobat/v2/slots/{id}/block` — Block a slot (admin)
- `POST /wp-json/nobat/v2/slots/{id}/unblock` — Unblock a slot (admin)

For complete API documentation, see [docs/API-v2-ENDPOINTS.md](docs/API-v2-ENDPOINTS.md)

## 🛠️ Development

### Prerequisites

- Node.js 16+ (for building React components)
- Composer 2.0+ (for PHP autoloading)
- PHP 7.4+ with MySQL/MariaDB

### Development Workflow

```bash
# Install dependencies
composer install
npm install

# Development mode (watch for changes)
npm run start

# Production build
npm run build

# Regenerate autoloader
composer dump-autoload
```

### Project Structure

```
nobat/
├── nobat.php                 # Main plugin file
├── includes/
│   ├── Core/                 # Core classes (Container, DatabaseManager)
│   ├── Repositories/         # Data access layer
│   ├── Services/             # Business logic layer
│   ├── Controllers/          # REST API controllers
│   ├── Middleware/           # API middleware (auth)
│   ├── Utilities/            # Helper classes
│   ├── Admin/                # Admin UI classes
│   ├── bootstrap.php         # DI container setup
│   └── rest/
│       ├── routes.php        # v2 API route registration
│       ├── schedule-api.php  # Legacy v1 compatibility (schedules)
│       └── appointment-api.php # Legacy v1 compatibility (appointments)
├── src/
│   ├── admin/                # React admin components
│   │   ├── cal/              # Calendar view
│   │   ├── schedule/         # Schedule builder
│   │   └── cancellations/    # Cancellation requests
│   ├── bookingNew/           # New React booking interface
│   │   ├── components/       # Booking components
│   │   ├── contexts/         # React contexts (Auth)
│   │   ├── hooks/            # Custom React hooks
│   │   └── utils/            # Utility functions
│   └── frontend/             # Legacy booking interface (to be deprecated)
│       └── booking/          # Old booking components
├── docs/                     # Comprehensive documentation
└── build/                    # Compiled assets
```

### Architecture

Nobat follows **Clean Architecture** principles:

1. **Repository Pattern**: Data access abstraction
2. **Service Layer**: Business logic encapsulation
3. **Dependency Injection**: Loose coupling via container
4. **Controller Layer**: REST API endpoints
5. **Middleware**: Authentication and authorization

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for details.

## 🎨 Customization

### Styling

Edit SCSS files in `src/`:

- `src/admin/admin.scss` — Base admin styles
- `src/admin/cal/cal.scss` — Calendar view
- `src/admin/schedule/schedule.scss` — Schedule builder
- `src/admin/cancellations/cancellations.scss` — Cancellation requests
- `src/bookingNew/bookingNew.scss` — New booking interface styles

After editing, run `npm run build` to compile.

### Filters & Hooks

```php
// Modify max appointments per user
add_filter( 'nobat_max_appointments_per_user', function( $max ) {
    return 5; // Allow 5 instead of default 3
} );

// Custom appointment notification
add_action( 'nobat_appointment_created', function( $appointment_id ) {
    // Send custom notification
} );
```

### Translation

Generate POT file for translation:

```bash
wp i18n make-pot . languages/nobat.pot
```

Place `.po` and `.mo` files in the `languages/` directory.

## 🧪 Testing

### Manual Testing Checklist

- [ ] Create a new schedule
- [ ] Generate slots correctly
- [ ] Book appointment as logged-in user
- [ ] Request cancellation
- [ ] Admin approves/denies cancellation
- [ ] Calendar view displays correctly
- [ ] Appointment limits enforced
- [ ] Persian dates display correctly

### Automated Testing

```bash
# Run PHPUnit tests (when available)
composer test

# Run Jest tests (when available)
npm test
```

## 📖 Documentation

Comprehensive documentation is available in the `docs/` folder:

- [Architecture Overview](docs/ARCHITECTURE.md)
- [Database Schema](docs/DATABASE-SCHEMA.md)
- [API v2 Endpoints](docs/API-v2-ENDPOINTS.md)
- [Developer Guide](docs/DEVELOPER-GUIDE.md)
- [Upgrade Guide](docs/UPGRADE-GUIDE.md)
- [Refactoring Progress](docs/REFACTORING-COMPLETE-SUMMARY.md)

## 🔄 Upgrading from v1.x

If you're upgrading from the old "Appointment Booking" plugin:

1. **Backup your database**
2. Deactivate the old plugin
3. Install dependencies: `composer install && npm install && npm run build`
4. Activate Nobat
5. Database will migrate automatically

See [docs/UPGRADE-GUIDE.md](docs/UPGRADE-GUIDE.md) for detailed migration instructions.

## 🐛 Known Issues

- Legacy `nobat_booking` shortcode will be deprecated in a future release (use `nobat_new` instead)
- Old v1 API endpoints are deprecated but maintained for backward compatibility
- Persian calendar widget requires custom JavaScript library

## 🗺️ Roadmap

### v2.1 (Planned)

- [ ] Email notifications
- [ ] SMS integration
- [ ] Payment gateway integration
- [ ] Multiple service types
- [ ] Deprecate legacy `nobat_booking` shortcode

### v2.2 (Future)

- [ ] Recurring appointments
- [ ] Google Calendar sync
- [ ] Multi-admin assignment
- [ ] Custom fields for appointments

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Follow WordPress coding standards
4. Write clean, documented code
5. Submit a pull request

## 📄 License

This plugin is licensed under GPL-2.0-or-later.

```
Nobat - WordPress Appointment Booking Plugin
Copyright (C) 2024 Your Name

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.
```

## 👨‍💻 Author

**Your Name**  
Website: https://yourwebsite.com  
GitHub: https://github.com/your-username

## 🙏 Acknowledgments

- WordPress community
- React and WordPress Components teams
- Persian calendar contributors

---

**Made with ❤️ for the WordPress community**
