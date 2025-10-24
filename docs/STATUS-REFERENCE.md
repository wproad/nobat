# Status Reference Guide

This document explains all status values used in the Nobat appointment booking system.

---

## 📅 Slot Statuses (Database)

Slots represent time blocks that users can book. There are **3 slot statuses**:

### 1. `available` 
**Purpose:** Slot is open and can be booked by users  
**Color:** Green  
**When set:**
- Initial state when schedule is created
- When appointment is cancelled
- When admin unblocks a slot

**Actions allowed:**
- Users can book this slot
- Admin can block it

---

### 2. `booked`
**Purpose:** Slot is reserved by an active appointment  
**Color:** Blue/Orange (depends on appointment status)  
**When set:**
- User creates an appointment
- Slot remains booked even after appointment is completed (for history)

**Actions allowed:**
- Admin can view appointment details
- Admin can change appointment status
- Admin can cancel appointment (returns slot to `available`)

**Note:** This represents slots with actual appointments attached

---

### 3. `blocked`
**Purpose:** Admin manually blocked this slot - users cannot book it  
**Color:** Gray/Red  
**When set:**
- Admin manually blocks a time slot (e.g., lunch break, holiday, emergency)
- Slot is **inside working hours** but needs to be temporarily unavailable

**Actions allowed:**
- Admin can unblock it (returns to `available`)

**Use cases:**
- Block lunch hours (e.g., work 9-5, but block 12-1 for lunch)
- Block specific dates (vacation, holidays)
- Emergency closures
- Maintenance periods

**❓ Difference from `unavailable`:**
- `blocked` = Inside working hours, but you manually disabled it (stored in database)
- `unavailable` = Outside working hours (not stored, just display)
- Example: Schedule is 9 AM - 5 PM
  - 8 AM slot = `unavailable` (not in schedule)
  - 12 PM slot = `blocked` (in schedule, but you blocked it for lunch)

---

## 📋 Appointment Statuses (Database)

Appointments track user bookings. There are **5 appointment statuses**:

### 1. `pending` 
**Purpose:** New appointment waiting for admin confirmation  
**Color:** Orange (#f0ad4e)  
**When set:**
- User books an appointment (initial state)

**Transitions to:**
- `confirmed` - Admin confirms
- `cancelled` - Admin cancels
- `cancel_requested` - User requests cancellation

**Actions allowed:**
- Admin can confirm
- Admin can cancel
- User can request cancellation

---

### 2. `confirmed`
**Purpose:** Admin has confirmed the appointment  
**Color:** Green (#5cb85c)  
**When set:**
- Admin clicks "Confirm" on a pending appointment

**Transitions to:**
- `completed` - Admin marks as done
- `cancelled` - Admin cancels
- `cancel_requested` - User requests cancellation

**Actions allowed:**
- Admin can mark as completed
- Admin can cancel
- User can request cancellation

---

### 3. `completed`
**Purpose:** Appointment session was completed  
**Color:** Blue (#337ab7)  
**When set:**
- Admin marks appointment as completed after the session

**Special fields set:**
- `completed_at` - Timestamp
- `assigned_admin_id` - Which admin completed it

**Transitions to:**
- None (final state)

**Note:** Slot remains `booked` for historical record

---

### 4. `cancelled`
**Purpose:** Appointment was cancelled  
**Color:** Red (#d9534f)  
**When set:**
- Admin cancels appointment
- Admin approves user's cancellation request

**Special fields:**
- `cancelled_at` - Timestamp
- `cancellation_reason` - Optional reason

**Effect on slot:**
- Slot status returns to `available`

**Transitions to:**
- None (final state)

---

### 5. `cancel_requested`
**Purpose:** User requested cancellation, waiting for admin approval  
**Color:** Orange/Yellow  
**When set:**
- User clicks "Request Cancellation"

**Special fields set:**
- `cancellation_requested_at` - Timestamp
- `cancellation_reason` - User's reason

**Transitions to:**
- `cancelled` - Admin approves
- Back to `pending/confirmed` - Admin denies (not implemented yet)

**Admin view:**
- Shows in "Cancellation Requests" page

---

## 🎨 Frontend-Only Statuses

These statuses are used in the calendar UI but **not stored in database**:

### `unavailable`
**Purpose:** Display-only status for time slots **outside working hours**  
**When shown:**
- Time slot exists in calendar grid but is not in working hours
- Acts as placeholder/padding in calendar view
- Example: If your schedule is 9 AM - 5 PM, all slots before 9 AM and after 5 PM show as `unavailable`

**Color:** Light gray, not clickable  
**Note:** Not a real slot - just UI element

**❓ Difference from `blocked`:**
- `unavailable` = Outside your working hours (automatically shown)
- `blocked` = Inside your working hours, but you manually disabled it (database status)

---

## 📊 Status Flow Diagrams

### Slot Lifecycle
```
available ─┬─> booked ──> [appointment cancelled] ──> available
           │
           └─> blocked ──> [admin unblocks] ──> available
```

### Appointment Lifecycle (Happy Path)
```
[User books] 
    ↓
pending 
    ↓ [admin confirms]
confirmed 
    ↓ [admin completes]
completed (FINAL)
```

### Appointment Cancellation Flow
```
pending/confirmed 
    ↓ [user requests]
cancel_requested 
    ↓ [admin approves]
cancelled (FINAL)
    ↓ [side effect]
slot: booked → available
```

### Direct Admin Cancellation
```
pending/confirmed 
    ↓ [admin cancels directly]
cancelled (FINAL)
    ↓ [side effect]
slot: booked → available
```

---

## 🔧 Common Use Cases

### Blocking Lunch Break
1. Admin blocks slots from 12:00-13:00
2. Slot status: `available` → `blocked`
3. Users cannot book these slots
4. Shows as "Blocked" in calendar

### User Books Appointment
1. User selects available slot
2. Slot status: `available` → `booked`
3. Appointment status: `pending`
4. Shows in calendar as orange/pending

### Admin Confirms Appointment
1. Admin views pending appointment
2. Clicks "Confirm"
3. Appointment status: `pending` → `confirmed`
4. Slot remains: `booked`
5. Shows in calendar as green/confirmed

### User Cancels Appointment
1. User requests cancellation
2. Appointment status: `pending/confirmed` → `cancel_requested`
3. Admin reviews request
4. Admin approves
5. Appointment status: `cancel_requested` → `cancelled`
6. Slot status: `booked` → `available`

### Admin Blocks Emergency Day
1. Admin selects date range
2. All slots for that date: `available` → `blocked`
3. Users see no availability
4. Later, admin can unblock

---

## 💡 Best Practices

### When to Use Each Slot Status

**Use `available`:**
- Default for all working hours
- After cancellations
- After unblocking

**Use `booked`:**
- Never set manually - automatically set when appointment created
- Keep even after completion for history

**Use `blocked`:**
- Lunch breaks
- Holidays/vacation days
- Emergency closures
- Staff meetings
- Maintenance periods

### When to Use Each Appointment Status

**`pending`:**
- All new bookings start here
- Requires admin review

**`confirmed`:**
- After admin verifies appointment
- Sends confirmation to user

**`cancel_requested`:**
- User initiated cancellation
- Requires admin approval
- Allows admin to contact user first

**`cancelled`:**
- Admin approved cancellation
- Direct admin cancellation
- Releases the slot

**`completed`:**
- Session finished successfully
- Tracks which admin handled it
- Historical record

---

## 🚫 What NOT to Do

❌ Don't change slot status manually when there's an appointment  
✅ Cancel the appointment instead (it auto-updates slot)

❌ Don't use `blocked` for booked slots  
✅ Use appointment system

❌ Don't delete appointments  
✅ Cancel them (preserves history)

❌ Don't set appointment to `completed` if user didn't show  
✅ Set to `cancelled` with reason "No show"

---

## 📝 Database Fields Reference

### Slot Table (`nobat_slots`)
- `status`: ENUM-like VARCHAR(20)
  - Values: `available`, `booked`, `blocked`
  - Default: `available`

### Appointment Table (`nobat_appointments`)
- `status`: ENUM-like VARCHAR(20)
  - Values: `pending`, `confirmed`, `cancel_requested`, `cancelled`, `completed`
  - Default: `pending`

### Related Timestamp Fields
- `confirmed_at`: Set when status → `confirmed`
- `completed_at`: Set when status → `completed`
- `cancelled_at`: Set when status → `cancelled`
- `cancellation_requested_at`: Set when status → `cancel_requested`

---

## 🎯 Quick Reference

| Entity | Status | Color | Bookable? | Purpose |
|--------|--------|-------|-----------|---------|
| Slot | `available` | Green | ✅ Yes | Open for booking |
| Slot | `booked` | Varies | ❌ No | Has appointment |
| Slot | `blocked` | Gray | ❌ No | Admin blocked |
| Appointment | `pending` | Orange | - | New, needs confirmation |
| Appointment | `confirmed` | Green | - | Admin confirmed |
| Appointment | `cancel_requested` | Yellow | - | User wants to cancel |
| Appointment | `cancelled` | Red | - | Cancelled (final) |
| Appointment | `completed` | Blue | - | Done (final) |

---

*Last updated: Based on plugin v2.0.0 schema*

