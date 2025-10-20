# Appointment Booking Plugin

A WordPress plugin that allows clients to book appointments through a simple form, with an admin interface to manage all bookings.

## Features

- **Schedule Management (Admin)**: Create, list, view, and delete schedules, define weekly hours, duration, and buffers; update individual slot availability per day
- **Active Schedule (Frontend)**: Visitors can view future available time slots from the active schedule
- **Appointment Booking API**: Public endpoint to create appointments against available slots
- **Responsive Design**: Works on desktop and mobile devices
- **Admin Calendar View**: Weekly calendar for schedules with day columns and visual time blocks

## Installation

1. Upload the plugin folder to `/wp-content/plugins/`
2. Activate the plugin through the 'Plugins' menu in WordPress
3. Install dependencies and build assets:
   ```bash
   cd /wp-content/plugins/appointment-booking/
   npm install
   npm run build
   ```

## Usage

### For Clients

Add the booking form to any page or post using the shortcode:

```
[appointment_booking title="Book Your Appointment"]
```

### For Admins

1. Go to **Appointments** in the WordPress admin menu
2. View all appointments in a table format
3. Edit appointment status or delete appointments
4. Use the refresh button to reload the list
5. Open the **Appointments → Calendar** submenu for a weekly calendar view with navigation

## Development

### Building Assets

```bash
# Development mode with watch
npm run start

# Production build
npm run build
```

## API Endpoints

- `GET /wp-json/appointment-booking/v1/appointments` — List appointments (admin)
- `POST /wp-json/appointment-booking/v1/appointments` — Create appointment (public)
- `PUT /wp-json/appointment-booking/v1/appointments/{id}` — Update appointment status (admin)
- `DELETE /wp-json/appointment-booking/v1/appointments/{id}` — Delete appointment (admin)
- `GET /wp-json/appointment-booking/v1/available-slots` — Get available time slots (public)
- `GET /wp-json/appointment-booking/v1/time-slots-template` — Get slot template based on settings (admin)
- `POST /wp-json/appointment-booking/v1/schedule` — Create schedule (admin)
- `GET /wp-json/appointment-booking/v1/schedule/active` — Get active schedule (public)
- `GET /wp-json/appointment-booking/v1/schedule/available` — Get available future slots from active schedule (public)
- `GET /wp-json/appointment-booking/v1/schedules` — List all schedules (admin)
- `GET /wp-json/appointment-booking/v1/schedule/{id}` — Get schedule by ID (admin)
- `PUT /wp-json/appointment-booking/v1/schedule/slot` — Update a single slot status for a given date (admin)

## Database

The plugin creates two tables on activation:

- `wp_appointments` — Stores appointment records and their statuses
- `wp_schedules` — Stores schedules, weekly hours, generated per-day timeslots, and settings

## Customization

### Styling

Edit the SCSS files in the `src/` directory:

- `src/admin/admin.scss` — Admin interface styles (appointments table, modal, etc.)
- `src/admin/cal/cal.scss` — Admin calendar styles (weekly grid, headers, slots)
- `src/admin/schedule/schedule.scss` — Admin schedule builder styles
- `src/frontend/booking/frontend.scss` — Frontend booking/available slots styles

## Admin Asset Loading

Assets are enqueued only on this plugin's admin pages. The calendar bundle is loaded for the Calendar submenu. REST nonce (`wpApiSettings.nonce`) is localized for authenticated requests in admin.

## Requirements

- WordPress 6.1+
- PHP 7.4+
- Node.js (for development)
- MySQL/MariaDB

## License

GPL-2.0-or-later
