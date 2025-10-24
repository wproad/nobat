# Upgrade Guide - Appointment Booking Plugin

## Overview

This guide helps you upgrade from version 1.x to version 2.x+ (with normalized database schema). Since this plugin is currently in development without active installations, this guide serves as a reference for future upgrades.

## What's New in v2.0+

### Database Changes
- **Normalized Schema**: Replaced JSON storage with proper relational tables
- **Table Prefix**: All tables use `nobat_` prefix (e.g., `wp_nobat_schedules`)
- **5 Tables**: schedules, working_hours, slots, appointments, history
- **Foreign Keys**: Proper relationships between tables
- **Indexes**: Optimized for performance

### Architecture Changes
- **Repository Pattern**: Clean data access layer
- **Service Layer**: Business logic separated from data access
- **DI Container**: Professional dependency management
- **RESTful API**: Clean v2 API endpoints
- **React Updates**: Modern component architecture

### Feature Changes
- **User Authentication Required**: Must be logged in to book
- **Appointment Limit**: Max 3 active appointments per user
- **Cancellation Workflow**: User requests, admin approves
- **Admin Assignment**: Tracked when appointment completed
- **Audit Trail**: Complete history of all changes

## Upgrade Process

### Prerequisites

**Before upgrading:**

1. **Backup Everything**
   ```bash
   # Full WordPress backup
   wp db export backup-$(date +%Y%m%d).sql
   
   # Copy plugin folder
   cp -r wp-content/plugins/appointment-booking wp-content/plugins/appointment-booking-backup
   ```

2. **Check Requirements**
   - PHP 7.4 or higher
   - WordPress 6.1 or higher
   - MySQL 5.6 or higher (or MariaDB equivalent)

3. **Test Environment**
   - Test on staging/development site first
   - Never upgrade directly on production

### Step 1: Update Plugin Files

```bash
# Using Git
cd wp-content/plugins/appointment-booking
git pull origin main

# Or manual upload
# 1. Download latest version
# 2. Deactivate plugin in WordPress admin
# 3. Delete old plugin folder
# 4. Upload new plugin folder
# 5. Activate plugin
```

### Step 2: Database Migration

The database migration happens **automatically** when you activate the plugin or when WordPress loads.

**What happens:**

1. Plugin checks `DB_VERSION` constant (current: 3.0)
2. Compares with stored `appointment_booking_db_version` option
3. If different, runs `DatabaseManager::update_database()`
4. Creates/alters all tables using `dbDelta()`
5. Updates version option

**Monitor the migration:**

```bash
# Watch WordPress debug log
tail -f wp-content/debug.log
```

### Step 3: Verify Database

After activation, verify the new tables exist:

```bash
# Check tables
wp db query "SHOW TABLES LIKE 'wp_nobat_%'"

# Should show:
# wp_nobat_schedules
# wp_nobat_working_hours
# wp_nobat_slots
# wp_nobat_appointments
# wp_nobat_history
```

**Or use the verification script:**

```bash
wp eval-file wp-content/plugins/appointment-booking/includes/database/verify-migration.php
```

### Step 4: Test Core Functionality

1. **Admin Interface**
   - Navigate to admin → Appointments
   - Create a test schedule
   - Verify slots are generated

2. **Frontend Booking**
   - Log in as a regular user
   - Navigate to booking page
   - Book an appointment
   - Verify slot status changes

3. **Appointment Management**
   - Confirm an appointment
   - Request cancellation (as user)
   - Approve cancellation (as admin)
   - Mark appointment as completed

4. **API Endpoints**
   - Test v2 API endpoints
   - Verify authentication works
   - Check error responses

### Step 5: Clear Caches

```bash
# WordPress object cache
wp cache flush

# Transients
wp transient delete --all

# Browser cache
# Clear browser cache and hard reload (Ctrl+Shift+R)
```

## Rollback Procedure

If something goes wrong:

### Option 1: Restore from Backup

```bash
# Deactivate plugin
wp plugin deactivate appointment-booking

# Restore database
wp db import backup-YYYYMMDD.sql

# Restore plugin files
rm -rf wp-content/plugins/appointment-booking
mv wp-content/plugins/appointment-booking-backup wp-content/plugins/appointment-booking

# Reactivate
wp plugin activate appointment-booking
```

### Option 2: Manual Table Deletion

```sql
-- Only if you want to start fresh
DROP TABLE IF EXISTS wp_nobat_history;
DROP TABLE IF EXISTS wp_nobat_appointments;
DROP TABLE IF EXISTS wp_nobat_slots;
DROP TABLE IF EXISTS wp_nobat_working_hours;
DROP TABLE IF EXISTS wp_nobat_schedules;

-- Delete version option
DELETE FROM wp_options WHERE option_name = 'appointment_booking_db_version';
```

Then reactivate the plugin to recreate tables.

## Data Migration Notes

### For New Installations

New installations start fresh with v2.0 schema. No migration needed.

### For Existing v1.x Installations (Future)

If upgrading from v1.x with data:

**Important:** Current version does NOT migrate old JSON data automatically. Since the plugin is in development, there are no existing installations.

For future migrations, you would need to:

1. Export old schedule data (JSON format)
2. Parse and transform to new structure
3. Insert into normalized tables
4. Validate all relationships

**Migration script template** (for reference):

```php
// This would be in includes/database/migrate-v1-to-v2.php
function migrate_old_schedules_to_new_schema() {
    global $wpdb;
    
    // Get old schedules (example - adjust based on actual old schema)
    $old_schedules = $wpdb->get_results(
        "SELECT * FROM {$wpdb->prefix}schedules_old",
        ARRAY_A
    );
    
    foreach ($old_schedules as $old_schedule) {
        // Decode JSON
        $weekly_hours = json_decode($old_schedule['weekly_hours'], true);
        $timeslots = json_decode($old_schedule['timeslots'], true);
        
        // Create new schedule
        $schedule_id = create_new_schedule($old_schedule);
        
        // Create working hours from JSON
        create_working_hours($schedule_id, $weekly_hours);
        
        // Create slots from JSON
        create_slots($schedule_id, $timeslots);
    }
}
```

## Breaking Changes

### API Changes

**Old (v1 API):**
```javascript
// Still supported for backward compatibility
POST /wp-json/appointment-booking/v1/appointments
{
    "client_name": "John Doe",
    "client_phone": "123456789",
    "appointment_date": "2024-11-25",
    "time_slot": "09:00-09:30"
}
```

**New (v2 API):**
```javascript
POST /wp-json/appointment-booking/v2/appointments
Headers: {
    "Cookie": "wordpress_logged_in_..." // Authentication required
}
{
    "slot_id": 123,
    "schedule_id": 1,
    "note": "Optional note"
}
```

### Database Structure

**Old:**
```sql
CREATE TABLE wp_schedules (
    id bigint(20),
    name varchar(255),
    admin_id bigint(20),
    weekly_hours text,  -- JSON
    timeslots longtext, -- JSON
    ...
);
```

**New:**
```sql
-- Normalized into 5 tables
CREATE TABLE wp_nobat_schedules (
    id bigint(20),
    name varchar(255),
    -- no admin_id, no JSON
    ...
);

CREATE TABLE wp_nobat_working_hours (...);
CREATE TABLE wp_nobat_slots (...);
CREATE TABLE wp_nobat_appointments (...);
CREATE TABLE wp_nobat_history (...);
```

### Frontend Changes

**Removed:**
- `client_name` input field
- `client_phone` input field
- Anonymous booking

**Added:**
- Login requirement check
- `note` textarea field
- Appointment limit indicator (3 max)
- "My Appointments" view
- Cancellation request button

## Troubleshooting

### Database Tables Not Created

**Symptoms:** Tables missing after activation

**Solution:**
```bash
# Check database version
wp option get appointment_booking_db_version

# Force database update
wp eval 'require_once("wp-content/plugins/appointment-booking/includes/database/DatabaseManager.php"); $db = new Appointment_Booking_Database_Manager(); $db->update_database(); echo "Done\n";'
```

### Permission Errors

**Symptoms:** "Access denied" errors

**Solution:**
```bash
# Check database user permissions
GRANT ALL PRIVILEGES ON database_name.* TO 'db_user'@'localhost';
FLUSH PRIVILEGES;
```

### Foreign Key Errors

**Symptoms:** Cannot create tables with foreign keys

**Solution:**
```sql
-- Check InnoDB engine
SHOW VARIABLES LIKE 'default_storage_engine';

-- Should be InnoDB for foreign key support
-- If not, update my.cnf and restart MySQL
```

### Slots Not Generating

**Symptoms:** Schedule created but no slots

**Solution:**
1. Check working hours are defined
2. Verify date range includes future dates
3. Check error log for `SlotGenerator` errors
4. Test slot generation manually:
```bash
wp eval-file wp-content/plugins/appointment-booking/includes/database/test-data.php
```

### Authentication Issues

**Symptoms:** "Not logged in" errors

**Solution:**
1. Verify user is actually logged in
2. Check session cookies enabled
3. Test with different browser
4. Verify WordPress auth working:
```php
// In theme functions.php temporarily
add_action('init', function() {
    error_log('User ID: ' . get_current_user_id());
    error_log('Logged in: ' . (is_user_logged_in() ? 'yes' : 'no'));
});
```

## Performance Optimization

After upgrade, optimize for performance:

### 1. Database Optimization

```sql
-- Analyze tables
ANALYZE TABLE wp_nobat_schedules, wp_nobat_working_hours, wp_nobat_slots, wp_nobat_appointments, wp_nobat_history;

-- Optimize tables
OPTIMIZE TABLE wp_nobat_schedules, wp_nobat_working_hours, wp_nobat_slots, wp_nobat_appointments, wp_nobat_history;
```

### 2. Object Caching

Enable WordPress object caching (Redis, Memcached) for better performance.

### 3. Index Verification

```sql
-- Check indexes
SHOW INDEX FROM wp_nobat_slots;
SHOW INDEX FROM wp_nobat_appointments;
```

## Post-Upgrade Checklist

- [ ] All tables created successfully
- [ ] Verification script passes
- [ ] Test schedule creation
- [ ] Test slot generation
- [ ] Test appointment booking (logged-in user)
- [ ] Test cancellation workflow
- [ ] Test admin completion
- [ ] Check error logs for issues
- [ ] Verify frontend displays correctly
- [ ] Test API endpoints
- [ ] Clear all caches
- [ ] Document any customizations made

## Support

If you encounter issues:

1. **Check error logs** (`wp-content/debug.log`)
2. **Run verification script**
3. **Test on staging site first**
4. **Backup before attempting fixes**
5. **Consult documentation** in `docs/` folder

## Version History

- **v3.0** - Table prefixing (`nobat_`)
- **v2.0** - Normalized database schema
- **v1.0.1** - Added Jalali date column
- **v1.0.0** - Initial release

## Future Upgrades

For future version upgrades:

1. Always backup first
2. Test on staging
3. Check CHANGELOG.md for breaking changes
4. Follow upgrade instructions
5. Verify functionality after upgrade

## Conclusion

This upgrade represents a major architectural improvement:
- Better performance (no JSON parsing)
- Better data integrity (foreign keys)
- Better scalability (normalized schema)
- Professional architecture (repositories, services, DI)

The automatic migration makes it seamless for future installations. Always test thoroughly before deploying to production!

