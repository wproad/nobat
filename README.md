# Appointment Booking Plugin

A WordPress plugin that allows clients to book appointments through a simple form, with an admin interface to manage all bookings.

## Features

- **Frontend Booking Form**: Simple form for clients to book appointments without registration
- **Admin Dashboard**: View, edit, and manage all appointments
- **Time Slot Management**: Hardcoded time slots with availability checking
- **Status Management**: Track appointment status (pending, confirmed, completed, cancelled)
- **Responsive Design**: Works on desktop and mobile devices

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

## Development

### Building Assets

```bash
# Development mode with watch
npm run start

# Production build
npm run build
```

### File Structure

```
appointment-booking/
├── index.php                 # Main plugin file
├── package.json              # Node dependencies
├── webpack.config.js         # Webpack configuration
├── src/
│   ├── admin/               # Admin React components
│   │   ├── index.js
│   │   ├── admin.scss
│   │   └── components/
│   └── frontend/            # Frontend React components
│       ├── index.js
│       ├── frontend.scss
│       └── components/
└── build/                   # Compiled assets (generated)
```

## API Endpoints

- `GET /wp-json/appointment-booking/v1/appointments` - Get all appointments (admin only)
- `POST /wp-json/appointment-booking/v1/appointments` - Create new appointment
- `PUT /wp-json/appointment-booking/v1/appointments/{id}` - Update appointment (admin only)
- `DELETE /wp-json/appointment-booking/v1/appointments/{id}` - Delete appointment (admin only)
- `GET /wp-json/appointment-booking/v1/available-slots?date={date}` - Get available time slots

## Time Slots

Currently hardcoded time slots:

- 9:00-10:00
- 10:00-11:00
- 11:00-12:00
- 14:00-15:00
- 15:00-16:00
- 16:00-17:00

## Database

The plugin creates a table `wp_appointments` with the following structure:

- `id` - Primary key
- `client_name` - Client's name
- `client_phone` - Client's phone number
- `appointment_date` - Date of appointment
- `time_slot` - Time slot (e.g., "9:00-10:00")
- `status` - Appointment status (pending, confirmed, completed, cancelled)
- `created_at` - Timestamp when appointment was created

## Customization

### Adding New Time Slots

Edit the `appointment_booking_get_available_slots` function in `index.php` to modify the available time slots.

### Styling

Edit the SCSS files in the `src/` directory:

- `src/admin/admin.scss` - Admin interface styles
- `src/frontend/frontend.scss` - Frontend booking form styles

### Adding New Fields

1. Update the database table structure
2. Modify the REST API endpoints
3. Update the React components
4. Rebuild the assets with `npm run build`

## Requirements

- WordPress 6.1+
- PHP 7.4+
- Node.js (for development)
- MySQL/MariaDB

## License

GPL-2.0-or-later
