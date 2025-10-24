# Developer Guide - Appointment Booking Plugin

## Introduction

This guide helps developers understand, maintain, and extend the Appointment Booking Plugin. It covers the architecture, coding standards, common tasks, and best practices.

## Prerequisites

### Required Knowledge
- PHP 7.4+ 
- WordPress plugin development
- MySQL/MariaDB
- React.js basics
- REST API concepts

### Development Environment
- Local WordPress installation (Local by Flywheel, XAMPP, etc.)
- PHP IDE (VS Code, PHPStorm)
- Node.js and npm (for React compilation)
- Git for version control

## Getting Started

### 1. Clone and Setup

```bash
# Navigate to WordPress plugins directory
cd wp-content/plugins/

# Clone repository
git clone [repository-url] appointment-booking

# Install npm dependencies (for React)
cd appointment-booking
npm install
```

### 2. Build Assets

```bash
# Development build with watch
npm run start

# Production build
npm run build
```

### 3. Activate Plugin

- Go to WordPress admin → Plugins
- Find "Appointment Booking"
- Click "Activate"

## Architecture Overview

### Layered Architecture

```
Frontend (React) → REST API → Controllers → Services → Repositories → Database
```

**Each layer has specific responsibilities:**

1. **Frontend**: User interface and interaction
2. **REST API**: HTTP request/response handling
3. **Controllers**: Route requests to services
4. **Services**: Business logic and validation
5. **Repositories**: Database access
6. **Database**: Data storage

### Dependency Injection

All services use dependency injection via the Container:

```php
// Get service from container
$appointment_service = appointment_booking_service('appointment_service');

// Or inject manually for testing
$service = new Appointment_Service($mock_repo, $mock_slot_repo);
```

## Code Organization

### Directory Structure

```
appointment-booking/
├── includes/               # PHP backend
│   ├── core/              # DI container
│   ├── database/          # Schema, migrations
│   ├── repositories/      # Data access
│   ├── services/          # Business logic
│   ├── utilities/         # Helper classes
│   └── rest/              # API endpoints
├── src/                   # React frontend
│   ├── admin/             # Admin interface
│   └── frontend/          # Public booking form
├── build/                 # Compiled JavaScript
├── docs/                  # Documentation
└── languages/             # Translations
```

### Naming Conventions

**Files:**
- PHP: `PascalCase.php` (e.g., `ScheduleService.php`)
- React: `PascalCase.jsx` (components), `camelCase.js` (hooks/utils)

**Classes:**
- `Appointment_Booking_` prefix (e.g., `Appointment_Booking_Schedule_Service`)
- Descriptive names (e.g., `SlotRepository` not `SR`)

**Functions:**
- Prefix with `appointment_booking_` for global functions
- Use verb_noun pattern (e.g., `get_active_schedule`)

**Database:**
- Tables: `wp_nobat_{entity}` (e.g., `wp_nobat_appointments`)
- Columns: `snake_case`

## Common Development Tasks

### Adding a New Repository Method

**Example: Get appointments by status**

```php
// In AppointmentRepository.php

/**
 * Get appointments by status
 * 
 * @param string $status
 * @param int $limit
 * @return array
 */
public function find_by_status( $status, $limit = 100 ) {
    $table = $this->get_table_name();
    
    $results = $this->wpdb->get_results(
        $this->wpdb->prepare(
            "SELECT * FROM {$table} 
             WHERE status = %s 
             ORDER BY created_at DESC 
             LIMIT %d",
            $status,
            $limit
        ),
        ARRAY_A
    );
    
    if ( $this->wpdb->last_error ) {
        error_log( 'AppointmentRepository::find_by_status error: ' . $this->wpdb->last_error );
        return array();
    }
    
    return $results ? $results : array();
}
```

### Adding a New Service Method

**Example: Get upcoming appointments**

```php
// In AppointmentService.php

/**
 * Get upcoming appointments for a user
 * 
 * @param int $user_id
 * @param int $days Number of days to look ahead
 * @return array|WP_Error
 */
public function get_upcoming_appointments( $user_id, $days = 7 ) {
    // Validate input
    if ( ! $user_id || $user_id < 1 ) {
        return new WP_Error( 'invalid_user_id', 'Invalid user ID' );
    }
    
    // Get user's appointments
    $appointments = $this->appointment_repo->find_by_user( $user_id );
    
    // Filter for upcoming only
    $upcoming = array_filter( $appointments, function( $appointment ) use ( $days ) {
        $slot = $this->slot_repo->find_by_id( $appointment['slot_id'] );
        if ( ! $slot ) {
            return false;
        }
        
        $slot_datetime = strtotime( $slot['slot_date'] . ' ' . $slot['start_time'] );
        $now = time();
        $future_limit = $now + ( $days * 86400 );
        
        return $slot_datetime >= $now && $slot_datetime <= $future_limit;
    } );
    
    return array_values( $upcoming );
}
```

### Adding a New REST Endpoint

**Step 1: Add Controller Method**

```php
// In AppointmentController.php

/**
 * Get upcoming appointments
 * 
 * @param WP_REST_Request $request
 * @return WP_REST_Response|WP_Error
 */
public function get_upcoming( $request ) {
    $user_id = $this->auth_service->get_current_user_id();
    $days = $request->get_param( 'days' ) ?: 7;
    
    $result = $this->appointment_service->get_upcoming_appointments(
        $user_id,
        (int) $days
    );
    
    if ( is_wp_error( $result ) ) {
        return $result;
    }
    
    return new WP_REST_Response( array(
        'appointments' => $result
    ), 200 );
}
```

**Step 2: Register Route**

```php
// In includes/rest/routes.php

// Add to appointment routes
register_rest_route( $namespace, '/appointments/upcoming', array(
    'methods' => 'GET',
    'callback' => array( $appointment_controller, 'get_upcoming' ),
    'permission_callback' => array( $auth_middleware, 'check_user_logged_in' ),
    'args' => array(
        'days' => array(
            'required' => false,
            'type' => 'integer',
            'default' => 7,
            'minimum' => 1,
            'maximum' => 30
        )
    )
) );
```

**Step 3: Document Endpoint**

Add to `docs/API-v2-ENDPOINTS.md`:

```markdown
### GET /appointments/upcoming

Get upcoming appointments for current user.

**Authentication:** Required

**Parameters:**
- `days` (integer, optional) - Number of days to look ahead (1-30, default: 7)

**Response:**
```json
{
    "appointments": [...]
}
```

### Adding a React Component

**Example: UpcomingAppointments.jsx**

```jsx
import React, { useState, useEffect } from 'react';

export const UpcomingAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUpcoming();
    }, []);

    const fetchUpcoming = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                '/wp-json/appointment-booking/v2/appointments/upcoming?days=7',
                {
                    credentials: 'include'
                }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch appointments');
            }

            const data = await response.json();
            setAppointments(data.appointments);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="upcoming-appointments">
            <h3>Upcoming Appointments</h3>
            {appointments.length === 0 ? (
                <p>No upcoming appointments</p>
            ) : (
                <ul>
                    {appointments.map(appointment => (
                        <li key={appointment.id}>
                            {/* Render appointment details */}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
```

### Adding Database Migration

**Example: Add new column**

```php
// Update DatabaseManager.php DB_VERSION
const DB_VERSION = '3.1';

// Update table creation method
private function create_appointments_table( $charset_collate ) {
    $table_name = $this->prefix . 'nobat_appointments';

    $sql = "CREATE TABLE $table_name (
        id bigint(20) NOT NULL AUTO_INCREMENT,
        user_id bigint(20) NOT NULL,
        slot_id bigint(20) NOT NULL,
        schedule_id bigint(20) NOT NULL,
        assigned_admin_id bigint(20) DEFAULT NULL,
        note text,
        priority varchar(10) DEFAULT 'normal', -- NEW COLUMN
        status varchar(20) DEFAULT 'pending',
        -- ... rest of columns
    ) $charset_collate;";

    dbDelta( $sql );
}
```

When version is bumped, `dbDelta()` will automatically add the new column on next plugin load.

## Testing

### Manual Testing

**Test Appointment Booking Flow:**

1. Create a schedule with working hours
2. Verify slots are generated
3. Book appointment as logged-in user
4. Verify slot status changes to 'booked'
5. Request cancellation
6. Approve cancellation as admin
7. Verify slot status returns to 'available'

### Using Test Data

```bash
# Load test data script via WordPress admin
# Navigate to: wp-admin/admin.php?page=appointment-booking
# Or run via WP-CLI:
wp eval-file includes/database/test-data.php
```

### Verification

```bash
# Run verification script
wp eval-file includes/database/verify-migration.php
```

## Debugging

### Enable WordPress Debug Mode

```php
// In wp-config.php
define( 'WP_DEBUG', true );
define( 'WP_DEBUG_LOG', true );
define( 'WP_DEBUG_DISPLAY', false );
```

### Check Error Logs

```bash
# WordPress debug log
tail -f wp-content/debug.log

# PHP error log
tail -f /path/to/php-error.log
```

### Database Queries

```php
// In your code
global $wpdb;
$wpdb->show_errors();

// After query
echo $wpdb->last_query;
echo $wpdb->last_error;
```

### React Debugging

```javascript
// Browser console
console.log('State:', appointments);

// React DevTools (Chrome/Firefox extension)
// Inspect component props and state
```

## Best Practices

### Security

1. **Always sanitize input:**
```php
$name = sanitize_text_field( $request->get_param( 'name' ) );
$email = sanitize_email( $request->get_param( 'email' ) );
```

2. **Use prepared statements:**
```php
$wpdb->prepare( "SELECT * FROM table WHERE id = %d", $id );
```

3. **Check permissions:**
```php
if ( ! current_user_can( 'manage_options' ) ) {
    return new WP_Error( 'forbidden', 'Insufficient permissions', array( 'status' => 403 ) );
}
```

4. **Validate nonces (for forms):**
```php
if ( ! wp_verify_nonce( $_POST['_wpnonce'], 'action_name' ) ) {
    wp_die( 'Invalid nonce' );
}
```

### Performance

1. **Index frequently queried columns**
2. **Use SELECT only needed columns**
3. **Limit result sets**
4. **Cache expensive queries**
5. **Use singleton pattern for services**

### Code Quality

1. **Follow WordPress Coding Standards**
2. **Add PHPDoc comments**
3. **Keep functions small (<50 lines)**
4. **One responsibility per function**
5. **Use descriptive variable names**
6. **Avoid deep nesting (max 3 levels)**

### Error Handling

```php
// Services return WP_Error
if ( is_wp_error( $result ) ) {
    return $result;
}

// Repositories return false on error and log
if ( ! $result ) {
    error_log( 'Repository error: ' . $wpdb->last_error );
    return false;
}
```

## Troubleshooting

### Common Issues

**Issue: Slots not generating**

Check:
1. Working hours properly defined
2. Date range includes future dates
3. Meeting duration set
4. Check error logs for SlotGenerator errors

**Issue: "Not logged in" error**

Check:
1. User is actually logged in
2. Session cookies enabled
3. `credentials: 'include'` in fetch requests
4. WordPress auth working

**Issue: Database errors**

Check:
1. Table prefixes correct (`wp_nobat_`)
2. Foreign keys valid
3. Database user permissions
4. Check `$wpdb->last_error`

**Issue: React not updating**

Check:
1. Run `npm run build`
2. Clear browser cache
3. Check browser console for errors
4. Verify API returns correct data

## Resources

### Documentation
- `docs/ARCHITECTURE.md` - Architecture overview
- `docs/DATABASE-SCHEMA.md` - Database schema
- `docs/API-v2-ENDPOINTS.md` - API documentation
- `docs/REFACTOR-PLAN.md` - Original refactor plan

### WordPress Resources
- [Plugin Handbook](https://developer.wordpress.org/plugins/)
- [REST API Handbook](https://developer.wordpress.org/rest-api/)
- [Database Class (wpdb)](https://developer.wordpress.org/reference/classes/wpdb/)

### Code Standards
- [WordPress PHP Coding Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/php/)
- [WordPress JavaScript Coding Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/javascript/)

## Getting Help

### Before Asking
1. Check error logs
2. Review relevant documentation
3. Search closed issues
4. Try debugging with `error_log()` and `console.log()`

### When Asking
Include:
- What you're trying to do
- What you expected
- What actually happened
- Error messages (full stack trace)
- Code snippets
- WordPress version, PHP version

## Contributing

### Workflow
1. Create feature branch: `git checkout -b feature/new-feature`
2. Make changes
3. Test thoroughly
4. Commit with clear message: `git commit -m "Add new feature"`
5. Push: `git push origin feature/new-feature`
6. Create pull request

### Commit Messages
```
Add: New feature
Fix: Bug description
Update: What changed
Refactor: What was refactored
Docs: Documentation update
```

## Conclusion

This plugin uses modern, maintainable architecture. Follow the patterns established, write clean code, test thoroughly, and document your changes. When in doubt, look at existing code for examples.

Happy coding! 🚀

