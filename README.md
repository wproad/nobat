# Nobat (نوبت) — WordPress Appointment Booking Plugin

**Version:** 2.2.0  
**Requires WordPress:** 6.1+  
**Requires PHP:** 8.0+  
**License:** GPL-2.0-or-later  
**Text Domain:** nobat  
**Author:** [WPROAD](https://wproad.ir/nobat)

A modern appointment booking system for WordPress with admin management, Persian (Jalali) calendar support, multi-schedule calendars, and a clean PHP / React architecture.

## Features

- **Multiple schedules** — Create several calendars; more than one can be active at once
- **Shortcode calendar selection** — Show a specific schedule, or fall back to the latest active one
- **Persian calendar** — Jalali (Shamsi) dates in admin and booking UI
- **User-based bookings** — Appointments require a logged-in WordPress user
- **Cancellation workflow** — Users request cancellation; admins approve from the calendar
- **Admin calendar** — Weekly view with slot and appointment management
- **Appointment limits** — Configurable max active appointments per user (default: 3)
- **Status tracking** — `pending`, `confirmed`, `completed`, `cancelled`, `cancel_requested` with history
- **REST API** — Namespace `nobat/v2` with admin / user permission checks
- **Clean architecture** — Repositories, services, controllers, DI container, PSR-4 autoload

## Installation

1. Place the plugin in `/wp-content/plugins/nobat/`
2. Install dependencies and build assets:

```bash
cd wp-content/plugins/nobat
composer install --no-dev
npm install
npm run build
```

3. Activate **Nobat** in WordPress → Plugins  
4. Tables are created/updated on activation

## Quick start

### 1. Create and activate a schedule

1. **Nobat → Add Schedule** — set name, date range, duration, weekly hours  
   New schedules are created **inactive**.
2. **Nobat → Schedules → Edit** — set **Active** when ready  
   Multiple schedules may be active at the same time.
3. Optional: **View Calendar** from the schedules list to open that schedule in the calendar UI.

**Notes for admins**

- Overlapping date ranges across schedules are allowed; the admin must manage conflicts manually.
- Deactivating a schedule **cancels** its open appointments (`pending`, `confirmed`, `cancel_requested`).
- Deleting a schedule **deletes** all of its appointments (and related slots / working hours).

### 2. Add the booking form (shortcode)

Users must be logged in to book. Guests see a login prompt.

Use the booking shortcode to render the React booking UI:

| Shortcode | Purpose |
|-----------|---------|
| `[nobat_booking]` | Booking form |

#### Attributes

| Attribute | Required | Description |
|-----------|----------|-------------|
| `schedule_id` | No | Schedule to show. If omitted, the **latest active** schedule is used (`is_active = 1`, highest `id`). |

#### Examples

```
# Latest active schedule (default)
[nobat_booking]

# Specific schedule by ID (from Nobat → Schedules)
[nobat_booking schedule_id="12"]
```

Find schedule IDs under **Nobat → Schedules**.

### 3. Admin workflow

1. **Calendar** (`Nobat`) — weekly view; defaults to latest active schedule, or `?schedule_id=` for a specific one  
2. **All Appointments** — list and manage bookings  
3. **Schedules** — list, edit (name / active), view calendar, delete  
4. **Add Schedule** — create a new calendar  
5. **Settings** — max appointments, success message, brand colors

## Admin menu

| Menu item | Slug | Description |
|-----------|------|-------------|
| Calendar | `nobat` | Weekly calendar (latest active by default) |
| All Appointments | `nobat-appointments` | Appointment list table |
| Settings | `nobat-settings` | Plugin options |
| Schedules | `nobat-schedules` | Schedule list (Edit / View Calendar / Delete) |
| Edit Schedule | `nobat-schedule-edit` | Hidden page; name + active flag |
| Add Schedule | `nobat-scheduling` | Create schedule UI |

## Database

Five tables (prefix is your `$wpdb->prefix`, usually `wp_`):

| Table | Purpose |
|-------|---------|
| `nobat_schedules` | Schedule metadata (`name`, `is_active`, dates, duration, buffer) |
| `nobat_working_hours` | Working hours per schedule / weekday |
| `nobat_slots` | Generated time slots |
| `nobat_appointments` | User appointments |
| `nobat_history` | Appointment status history |

Details: [docs/DATABASE-SCHEMA.md](docs/DATABASE-SCHEMA.md)

## REST API

Base URL: `/wp-json/nobat/v2`

Full reference: [docs/API-ENDPOINTS.md](docs/API-ENDPOINTS.md)

### Appointments

| Method | Route | Auth |
|--------|-------|------|
| `POST` | `/appointments` | User |
| `GET` | `/appointments` | User (own) / see also `/appointments/all` |
| `GET` | `/appointments/all` | Admin |
| `GET` | `/appointments/{id}` | User / Admin |
| `PUT` | `/appointments/{id}` | Admin (status) |
| `PUT` | `/appointments/{id}/report` | Admin |
| `DELETE` | `/appointments/{id}` | Admin (cancels) |
| `POST` | `/appointments/{id}/cancel` | User (request) |
| `POST` | `/appointments/{id}/approve-cancellation` | Admin |
| `POST` | `/appointments/{id}/confirm` | Admin |
| `POST` | `/appointments/{id}/complete` | Admin |
| `GET` | `/appointments/cancellation-requests` | Admin |

### Schedules

| Method | Route | Auth | Notes |
|--------|-------|------|-------|
| `GET` | `/schedules` | Admin | List all |
| `POST` | `/schedules` | Admin | Always created **inactive** |
| `GET` | `/schedules/active` | Public | Latest active schedule + timeslots |
| `GET` | `/schedules/{id}` | Public | Used by shortcode `schedule_id` |
| `PUT` | `/schedules/{id}` | Admin | Update `name` / `is_active` (deactivate cancels open appointments) |
| `DELETE` | `/schedules/{id}` | Admin | Cascades appointments, slots, hours |
| `POST` | `/schedules/{id}/activate` | Admin | Non-exclusive (others stay active) |
| `POST` | `/schedules/{id}/deactivate` | Admin | Cancels open appointments on that schedule |
| `PUT` | `/schedules/slot` | Admin | Update slot by schedule + date + time |

### Slots

| Method | Route | Auth | Notes |
|--------|-------|------|-------|
| `GET` | `/slots` | Public | Optional `schedule_id` (defaults to latest active); optional `days` |
| `PUT` | `/slots/{id}` | Admin | Update status |
| `POST` | `/slots/block` | Admin | Block by schedule + date + time |
| `POST` | `/slots/unblock` | Admin | Unblock by schedule + date + time |

## Development

### Prerequisites

- PHP 8.0+
- Node.js 16+ (React build)
- Composer 2.0+
- WordPress 6.1+

### Workflow

```bash
composer install
npm install

# Watch mode
npm run start

# Production assets
npm run build

composer dump-autoload
```

### Project structure

```
nobat/
├── nobat.php                 # Plugin bootstrap
├── includes/
│   ├── Core/                 # Container, Router, DatabaseManager, ShortcodeHandler
│   ├── Repositories/         # Data access
│   ├── Services/             # Business logic
│   ├── Controllers/          # REST handlers
│   ├── Middleware/           # Auth
│   ├── Utilities/            # Helpers (dates, slots, validation)
│   ├── Admin/                # WP_List_Table classes
│   ├── bootstrap.php         # DI registration
│   ├── admin-menu.php
│   ├── admin-page.php
│   ├── admin-settings.php
│   └── enqueue-scripts.php
├── src/
│   ├── admin/
│   │   ├── cal/              # Admin calendar (React)
│   │   └── schedule/         # Create schedule (React)
│   ├── frontend/           # Front booking UI (React)
│   ├── hooks/                # Shared React hooks
│   ├── ui/                   # Shared UI components
│   └── utils/
├── build/                    # Compiled JS/CSS (cal, schedule, frontend)
├── languages/                # i18n (.po / .mo)
└── docs/                     # Developer documentation
```

### Architecture

1. **Repository** — database access  
2. **Service** — business rules  
3. **Controller** — REST request/response  
4. **DI container** — wiring in `includes/bootstrap.php`  
5. **Middleware** — admin / logged-in checks  

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Customization

### Settings (admin UI)

Configured under **Nobat → Settings**:

- Max active appointments per user
- Success message after booking
- Brand colors (`brand`, `on`, `soft`, `hover`)

### Styling

Edit SCSS / CSS under `src/`, then rebuild:

- `src/admin/cal/cal.scss`
- `src/admin/schedule/schedule.scss`
- `src/frontend/frontend.scss` and `src/frontend/soft-slot/`
- `src/ui/ui-components.scss`

```bash
npm run build
```

### Translation

```bash
wp i18n make-pot . languages/nobat.pot
```

Ship `.po` / `.mo` under `languages/` (e.g. `nobat-fa_IR.po`). Compile with:

```bash
msgfmt -o languages/nobat-fa_IR.mo languages/nobat-fa_IR.po
```

## Manual test checklist

- [ ] Create schedule (inactive by default)
- [ ] Activate via Edit; confirm another active schedule stays active
- [ ] Calendar without `schedule_id` shows latest active
- [ ] Calendar with `?schedule_id=` shows that schedule
- [ ] Shortcode without `schedule_id` uses latest active
- [ ] Shortcode with `schedule_id="N"` loads schedule N
- [ ] Book as logged-in user; guest sees login prompt
- [ ] Deactivate warns and cancels open appointments
- [ ] Delete warns and removes appointments
- [ ] Cancellation request + admin handling on calendar
- [ ] Appointment limit enforced
- [ ] Jalali dates display correctly

## Documentation

| Doc | Contents |
|-----|----------|
| [docs/README.md](docs/README.md) | Docs index |
| [docs/STRUCTURE.md](docs/STRUCTURE.md) | Plugin layout |
| [docs/API-ENDPOINTS.md](docs/API-ENDPOINTS.md) | Full REST reference |
| [docs/DATABASE-SCHEMA.md](docs/DATABASE-SCHEMA.md) | Tables and relations |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Layered design |
| [docs/DEVELOPER-GUIDE.md](docs/DEVELOPER-GUIDE.md) | Local setup / tasks |
| [docs/STATUS-REFERENCE.md](docs/STATUS-REFERENCE.md) | Slot & appointment statuses |

## License

GPL-2.0-or-later

```
Nobat - WordPress Appointment Booking Plugin
Copyright (C) WPROAD

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.
```

## Author

**WPROAD**  
Website: https://wproad.ir/nobat  
GitHub: https://github.com/wproad/nobat
