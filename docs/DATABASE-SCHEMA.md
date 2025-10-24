# Database Schema Documentation

## Overview

The Appointment Booking Plugin uses a normalized database schema with 5 main tables, all prefixed with `nobat_` (meaning "appointment" in Persian) to prevent conflicts.

**Database Version:** 3.0  
**Character Set:** utf8mb4  
**Collation:** utf8mb4_unicode_ci  

## Entity Relationship Diagram

```
┌─────────────────────┐
│  nobat_schedules    │
│  (Core schedule)    │
└──────────┬──────────┘
           │ 1
           │
           │ *
    ┌──────┴──────┬─────────────┬──────────────┐
    │             │             │              │
┌───▼────────┐ ┌──▼─────────┐ ┌▼──────────┐  │
│ nobat_     │ │  nobat_    │ │  nobat_   │  │
│ working_   │ │  slots     │ │  appoint- │  │
│ hours      │ │            │ │  ments    │  │
└────────────┘ └──────┬─────┘ └─────┬─────┘  │
                      │              │        │
                      │ 1            │ *      │ *
                      │              │        │
                      │             ┌▼────────▼──┐
                      └─────────────►  nobat_    │
                                    │  history   │
                                    │            │
                                    └────────────┘
```

## Tables

### 1. nobat_schedules

**Purpose:** Store core schedule information including date ranges and meeting settings.

**Full Name:** `wp_nobat_schedules`

```sql
CREATE TABLE wp_nobat_schedules (
    id bigint(20) NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    is_active tinyint(1) DEFAULT 0,
    start_date date NOT NULL,
    start_date_jalali varchar(10) NOT NULL,
    end_date date NOT NULL,
    end_date_jalali varchar(10) NOT NULL,
    meeting_duration int NOT NULL DEFAULT 30,
    buffer_time int NOT NULL DEFAULT 0,
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Columns:**
- `id` - Unique schedule identifier
- `name` - Schedule name (e.g., "November 2024 Schedule")
- `is_active` - Only one schedule should be active at a time
- `start_date` - Schedule start (Gregorian, Y-m-d)
- `start_date_jalali` - Schedule start (Jalali/Persian, YYYY/MM/DD)
- `end_date` - Schedule end (Gregorian)
- `end_date_jalali` - Schedule end (Jalali/Persian)
- `meeting_duration` - Duration of each appointment in minutes
- `buffer_time` - Gap between appointments in minutes
- `created_at` - When schedule was created
- `updated_at` - Last modification time

**Indexes:**
- PRIMARY KEY on `id`
- INDEX on `is_active` (for finding active schedule quickly)

**Business Rules:**
- Only one schedule should have `is_active = 1` at any time
- `end_date` must be greater than `start_date`
- `meeting_duration` must be greater than 0
- `buffer_time` can be 0

**Example Data:**
```sql
INSERT INTO wp_nobat_schedules VALUES (
    1,
    'آذر ۱۴۰۳',
    1,
    '2024-11-21',
    '1403/09/01',
    '2024-12-20',
    '1403/09/30',
    30,
    5,
    '2024-11-20 10:00:00',
    '2024-11-20 10:00:00'
);
```

---

### 2. nobat_working_hours

**Purpose:** Define working hours for each day of the week within a schedule.

**Full Name:** `wp_nobat_working_hours`

```sql
CREATE TABLE wp_nobat_working_hours (
    id bigint(20) NOT NULL AUTO_INCREMENT,
    schedule_id bigint(20) NOT NULL,
    day_of_week varchar(10) NOT NULL,
    start_time varchar(5) NOT NULL,
    end_time varchar(5) NOT NULL,
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY schedule_id (schedule_id),
    FOREIGN KEY (schedule_id) REFERENCES wp_nobat_schedules(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Columns:**
- `id` - Unique working hour entry identifier
- `schedule_id` - Parent schedule (FK)
- `day_of_week` - Day abbreviation: 'sat', 'sun', 'mon', 'tue', 'wed', 'thu', 'fri'
- `start_time` - Start time in HH:MM:SS format
- `end_time` - End time in HH:MM:SS format
- `created_at` - When record was created

**Indexes:**
- PRIMARY KEY on `id`
- FOREIGN KEY on `schedule_id` (CASCADE DELETE)
- INDEX on `schedule_id`

**Business Rules:**
- `end_time` must be greater than `start_time`
- Multiple periods can exist for the same day (e.g., 09:00-12:00 and 14:00-17:00)
- Days without working hours will have no slots generated

**Example Data:**
```sql
-- Saturday 09:00-12:00
INSERT INTO wp_nobat_working_hours VALUES (1, 1, 'sat', '09:00:00', '12:00:00', NOW());
-- Saturday 14:00-17:00
INSERT INTO wp_nobat_working_hours VALUES (2, 1, 'sat', '14:00:00', '17:00:00', NOW());
-- Sunday 09:00-17:00
INSERT INTO wp_nobat_working_hours VALUES (3, 1, 'sun', '09:00:00', '17:00:00', NOW());
```

---

### 3. nobat_slots

**Purpose:** Individual bookable time slots generated from working hours.

**Full Name:** `wp_nobat_slots`

```sql
CREATE TABLE wp_nobat_slots (
    id bigint(20) NOT NULL AUTO_INCREMENT,
    schedule_id bigint(20) NOT NULL,
    slot_date date NOT NULL,
    slot_date_jalali varchar(10) NOT NULL,
    start_time varchar(5) NOT NULL,
    end_time varchar(5) NOT NULL,
    status varchar(20) DEFAULT 'available',
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY schedule_id (schedule_id),
    KEY slot_date (slot_date),
    KEY status (status),
    UNIQUE KEY unique_slot (schedule_id, slot_date, start_time),
    FOREIGN KEY (schedule_id) REFERENCES wp_nobat_schedules(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Columns:**
- `id` - Unique slot identifier
- `schedule_id` - Parent schedule (FK)
- `slot_date` - Date of this slot (Gregorian, Y-m-d)
- `slot_date_jalali` - Date of this slot (Jalali/Persian)
- `start_time` - Slot start time (HH:MM:SS)
- `end_time` - Slot end time (HH:MM:SS)
- `status` - Current status: 'available', 'booked', 'blocked'
- `created_at` - When slot was generated
- `updated_at` - Last status change

**Indexes:**
- PRIMARY KEY on `id`
- FOREIGN KEY on `schedule_id` (CASCADE DELETE)
- INDEX on `slot_date` (for date-based queries)
- INDEX on `status` (for availability queries)
- UNIQUE on `(schedule_id, slot_date, start_time)` (prevent duplicates)

**Status Values:**
- `available` - Can be booked
- `booked` - Has an active appointment
- `blocked` - Admin blocked, cannot be booked

**Business Rules:**
- Automatically generated during schedule creation
- Status changes to 'booked' when appointment created
- Status returns to 'available' when appointment cancelled
- Cannot have duplicate slots for same schedule, date, and time

**Example Data:**
```sql
INSERT INTO wp_nobat_slots VALUES (
    1, 1, '2024-11-23', '1403/09/03', '09:00:00', '09:30:00', 'available', NOW(), NOW()
);
INSERT INTO wp_nobat_slots VALUES (
    2, 1, '2024-11-23', '1403/09/03', '09:30:00', '10:00:00', 'booked', NOW(), NOW()
);
```

---

### 4. nobat_appointments

**Purpose:** Store user appointment bookings with status tracking.

**Full Name:** `wp_nobat_appointments`

```sql
CREATE TABLE wp_nobat_appointments (
    id bigint(20) NOT NULL AUTO_INCREMENT,
    user_id bigint(20) NOT NULL,
    slot_id bigint(20) NOT NULL,
    schedule_id bigint(20) NOT NULL,
    assigned_admin_id bigint(20) DEFAULT NULL,
    note text,
    status varchar(20) DEFAULT 'pending',
    cancellation_reason text,
    cancellation_requested_at datetime DEFAULT NULL,
    confirmed_at datetime DEFAULT NULL,
    completed_at datetime DEFAULT NULL,
    cancelled_at datetime DEFAULT NULL,
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY user_id (user_id),
    KEY slot_id (slot_id),
    KEY schedule_id (schedule_id),
    KEY status (status),
    FOREIGN KEY (user_id) REFERENCES wp_users(ID) ON DELETE CASCADE,
    FOREIGN KEY (slot_id) REFERENCES wp_nobat_slots(id) ON DELETE CASCADE,
    FOREIGN KEY (schedule_id) REFERENCES wp_nobat_schedules(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Columns:**
- `id` - Unique appointment identifier
- `user_id` - WordPress user who booked (FK to wp_users)
- `slot_id` - Booked slot (FK)
- `schedule_id` - Parent schedule (FK, denormalized for easier queries)
- `assigned_admin_id` - Admin who completed the appointment (NULL until completed)
- `note` - Optional user note/description
- `status` - Current status (see below)
- `cancellation_reason` - Optional reason when cancelled
- `cancellation_requested_at` - When user requested cancellation
- `confirmed_at` - When admin confirmed
- `completed_at` - When admin marked as completed
- `cancelled_at` - When cancelled (by user or admin)
- `created_at` - When appointment was booked
- `updated_at` - Last status change

**Indexes:**
- PRIMARY KEY on `id`
- FOREIGN KEY on `user_id` (to wp_users)
- FOREIGN KEY on `slot_id` (CASCADE DELETE)
- FOREIGN KEY on `schedule_id` (CASCADE DELETE)
- INDEX on `user_id` (for user's appointments)
- INDEX on `status` (for status-based queries)

**Status Values & Workflow:**
1. `pending` - Initial state after booking
2. `confirmed` - Admin confirmed the appointment
3. `cancel_requested` - User requested cancellation (awaiting admin approval)
4. `cancelled` - Cancelled by admin or approved cancellation request
5. `completed` - Appointment was completed

**Status Transitions:**
```
pending → confirmed → completed
pending → cancel_requested → cancelled
pending → cancelled
confirmed → cancel_requested → cancelled
```

**Business Rules:**
- User can have max 3 "active" appointments (status: pending, confirmed, cancel_requested)
- User must be logged in to create appointments
- `assigned_admin_id` is set only when status changes to 'completed'
- When cancelled, associated slot status returns to 'available'

**Example Data:**
```sql
INSERT INTO wp_nobat_appointments VALUES (
    1, 5, 2, 1, NULL, 'اولین نوبت من', 'pending', 
    NULL, NULL, NULL, NULL, NULL,
    '2024-11-20 14:30:00', '2024-11-20 14:30:00'
);
```

---

### 5. nobat_history

**Purpose:** Audit trail for all appointment status changes.

**Full Name:** `wp_nobat_history`

```sql
CREATE TABLE wp_nobat_history (
    id bigint(20) NOT NULL AUTO_INCREMENT,
    appointment_id bigint(20) NOT NULL,
    user_id bigint(20) NOT NULL,
    action varchar(50) NOT NULL,
    notes text,
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY appointment_id (appointment_id),
    KEY user_id (user_id),
    FOREIGN KEY (appointment_id) REFERENCES wp_nobat_appointments(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES wp_users(ID) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Columns:**
- `id` - Unique history entry identifier
- `appointment_id` - Related appointment (FK)
- `user_id` - User who performed the action (FK to wp_users)
- `action` - Action type (see below)
- `notes` - Optional notes about the action
- `created_at` - When action occurred

**Indexes:**
- PRIMARY KEY on `id`
- FOREIGN KEY on `appointment_id` (CASCADE DELETE)
- FOREIGN KEY on `user_id` (CASCADE DELETE)
- INDEX on `appointment_id` (for appointment timeline)

**Action Values:**
- `created` - Appointment booked
- `confirmed` - Admin confirmed
- `cancel_requested` - User requested cancellation
- `cancel_request_approved` - Admin approved cancellation
- `cancel_request_denied` - Admin denied cancellation
- `cancelled` - Cancelled (by admin or user)
- `completed` - Marked as completed

**Business Rules:**
- Immutable records (no updates or deletes except cascade)
- Automatically created by AppointmentService
- Provides complete audit trail

**Example Data:**
```sql
INSERT INTO wp_nobat_history VALUES (
    1, 1, 5, 'created', 'User booked appointment', '2024-11-20 14:30:00'
);
INSERT INTO wp_nobat_history VALUES (
    2, 1, 1, 'confirmed', 'Admin confirmed appointment', '2024-11-20 15:00:00'
);
```

---

## Relationships

### One-to-Many

**schedules → working_hours**
- One schedule has many working hour periods
- Cascade delete: Deleting schedule removes all working hours

**schedules → slots**
- One schedule has many slots
- Cascade delete: Deleting schedule removes all slots

**schedules → appointments**
- One schedule has many appointments
- Cascade delete: Deleting schedule removes all appointments

**slots → appointments**
- One slot can have one active appointment (enforced by business logic)
- Cascade delete: Deleting slot removes appointments (shouldn't happen)

**appointments → history**
- One appointment has many history entries
- Cascade delete: Deleting appointment removes history

### Many-to-One

**appointments → users (WordPress)**
- Many appointments per user
- Cascade delete: Deleting user removes their appointments

## Queries

### Common Query Patterns

**Find Active Schedule:**
```sql
SELECT * FROM wp_nobat_schedules 
WHERE is_active = 1 
ORDER BY id DESC 
LIMIT 1;
```

**Get Available Slots for Date Range:**
```sql
SELECT * FROM wp_nobat_slots 
WHERE schedule_id = ? 
  AND slot_date BETWEEN ? AND ? 
  AND status = 'available'
ORDER BY slot_date, start_time;
```

**Count User's Active Appointments:**
```sql
SELECT COUNT(*) FROM wp_nobat_appointments 
WHERE user_id = ? 
  AND status IN ('pending', 'confirmed', 'cancel_requested');
```

**Get Appointment with Slot Details:**
```sql
SELECT 
    a.*,
    s.slot_date,
    s.slot_date_jalali,
    s.start_time,
    s.end_time
FROM wp_nobat_appointments a
INNER JOIN wp_nobat_slots s ON a.slot_id = s.id
WHERE a.id = ?;
```

**Get Appointment History:**
```sql
SELECT 
    h.*,
    u.display_name as user_name
FROM wp_nobat_history h
INNER JOIN wp_users u ON h.user_id = u.ID
WHERE h.appointment_id = ?
ORDER BY h.created_at ASC;
```

## Performance Considerations

### Indexes
All frequently queried columns are indexed:
- Foreign keys (for JOIN performance)
- Status columns (for filtering)
- Date columns (for range queries)
- Unique constraints (prevent duplicates)

### Query Optimization
- Use prepared statements (prevents SQL injection, enables query caching)
- Limit result sets with LIMIT clause
- Use specific column selection instead of SELECT *
- Index composite queries (schedule_id + slot_date)

### Storage
- Jalali dates stored as VARCHAR(10) for display purposes
- Gregorian dates stored as DATE for calculations
- Times stored as VARCHAR(5) (HH:MM) for simplicity
- Text fields use TEXT type (unlimited length)

## Migration History

**Version 1.0.0:** Initial JSON-based schema
- Schedules stored working hours as JSON
- Slots stored as JSON array

**Version 1.0.1:** Added appointment_date_jalali
- Schema mismatch fix

**Version 2.0.0:** Normalized schema
- Removed JSON storage
- Created 5 normalized tables
- Added foreign key constraints

**Version 3.0:** Table prefixing
- Added `nobat_` prefix to all tables
- Updated all references

## Backup Recommendations

### Daily Backups
- Full database backup
- Store offsite
- Test restore procedure

### Before Updates
- Always backup before:
  - Plugin updates
  - Schema changes
  - Data migrations

### Backup Commands
```bash
# Backup specific tables
wp db export --tables=wp_nobat_schedules,wp_nobat_working_hours,wp_nobat_slots,wp_nobat_appointments,wp_nobat_history backup.sql

# Restore
wp db import backup.sql
```

## Future Schema Enhancements

### Potential Additions
1. **nobat_services** - Different appointment types
2. **nobat_providers** - Multiple service providers
3. **nobat_locations** - Multiple office locations
4. **nobat_notifications** - Email/SMS notification queue
5. **nobat_payments** - Payment tracking

### Indexing Improvements
- Composite indexes for common query patterns
- Full-text search on appointment notes
- Partitioning for large datasets (date-based)

## Conclusion

This normalized schema provides:
- ✅ Data integrity via foreign keys
- ✅ Query performance via proper indexes
- ✅ Audit trail via history table
- ✅ Scalability for future features
- ✅ No JSON parsing overhead
- ✅ Standard relational database patterns

