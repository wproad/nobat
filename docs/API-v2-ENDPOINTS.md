# Appointment Booking API v2 - Endpoints Documentation

## Base URL
```
/wp-json/appointment-booking/v2
```

## Authentication
- 🔓 **Public**: No authentication required
- 🔐 **User**: Requires logged-in user
- 👑 **Admin**: Requires administrator role

---

## 📅 Appointment Endpoints

### Create Appointment
**POST** `/appointments`  
🔐 **Auth Required**: User must be logged in

Creates a new appointment for the current user.

**Body Parameters:**
```json
{
  "slot_id": 123,
  "schedule_id": 5,
  "note": "Optional note" 
}
```

**Response** (201):
```json
{
  "success": true,
  "message": "Appointment booked successfully!",
  "appointment": {
    "id": 45,
    "user_id": 7,
    "slot_id": 123,
    "schedule_id": 5,
    "note": "Optional note",
    "status": "pending",
    "user_name": "John Doe",
    "user_email": "john@example.com",
    "slot_date": "2025-11-15",
    "slot_date_jalali": "1404/08/24",
    "start_time": "09:00:00",
    "end_time": "09:30:00"
  }
}
```

**Error Responses:**
- `400` - Max appointments reached (3 limit)
- `400` - Slot not available
- `400` - Already booked this slot
- `401` - Not logged in

---

### Get My Appointments
**GET** `/appointments/my`  
🔐 **Auth Required**: User must be logged in

Returns all appointments for the current user.

**Query Parameters:**
- `status` (optional): Filter by status (pending, confirmed, completed, cancelled, cancel_requested)

**Response** (200):
```json
{
  "success": true,
  "appointments": [
    {
      "id": 45,
      "user_id": 7,
      "status": "pending",
      "note": "Optional note",
      "slot_date": "2025-11-15",
      "slot_date_jalali": "1404/08/24",
      "start_time": "09:00:00",
      "end_time": "09:30:00",
      "schedule_name": "November Schedule",
      "created_at": "2025-10-22 10:30:00"
    }
  ],
  "count": 1
}
```

---

### Get All Appointments
**GET** `/appointments`  
👑 **Auth Required**: Admin

Returns all appointments with optional filters.

**Query Parameters:**
- `status` (optional): Filter by status
- `date_from` (optional): Start date (Y-m-d)
- `date_to` (optional): End date (Y-m-d)
- `schedule_id` (optional): Filter by schedule

**Response** (200):
```json
{
  "success": true,
  "appointments": [...],
  "count": 25
}
```

---

### Get Single Appointment
**GET** `/appointments/{id}`  
🔐 **Auth Required**: User (own) or Admin

Returns details for a specific appointment.

**Response** (200):
```json
{
  "success": true,
  "appointment": {
    "id": 45,
    "user_id": 7,
    "user_name": "John Doe",
    "user_email": "john@example.com",
    "status": "pending",
    "slot_date": "2025-11-15",
    "assigned_admin_id": null,
    "admin_name": null
  }
}
```

---

### Request Cancellation
**POST** `/appointments/{id}/request-cancel`  
🔐 **Auth Required**: User (own) or Admin

User requests to cancel their appointment.

**Body Parameters:**
```json
{
  "reason": "Optional cancellation reason"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Cancellation request submitted. An admin will review your request."
}
```

**Error Responses:**
- `403` - Not your appointment
- `400` - Invalid status (already cancelled)

---

### Confirm Appointment
**POST** `/appointments/{id}/confirm`  
👑 **Auth Required**: Admin

Admin confirms a pending appointment.

**Response** (200):
```json
{
  "success": true,
  "message": "Appointment confirmed successfully."
}
```

---

### Complete Appointment
**POST** `/appointments/{id}/complete`  
👑 **Auth Required**: Admin

Admin marks appointment as completed and assigns themselves.

**Response** (200):
```json
{
  "success": true,
  "message": "Appointment marked as completed."
}
```

**Note**: Sets `assigned_admin_id` to current admin and `completed_at` timestamp.

---

### Cancel Appointment
**POST** `/appointments/{id}/cancel`  
👑 **Auth Required**: Admin

Admin cancels an appointment (slot becomes available again).

**Body Parameters:**
```json
{
  "reason": "Optional cancellation reason"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Appointment cancelled successfully."
}
```

---

### Get Cancellation Requests
**GET** `/appointments/cancellation-requests`  
👑 **Auth Required**: Admin

Returns all appointments with `cancel_requested` status.

**Response** (200):
```json
{
  "success": true,
  "requests": [
    {
      "id": 45,
      "user_id": 7,
      "user_name": "John Doe",
      "status": "cancel_requested",
      "cancellation_reason": "User provided reason",
      "cancellation_requested_at": "2025-10-22 14:30:00",
      "slot_date": "2025-11-15"
    }
  ],
  "count": 1
}
```

---

### Get Appointment History
**GET** `/appointments/{id}/history`  
👑 **Auth Required**: Admin

Returns audit trail for an appointment.

**Response** (200):
```json
{
  "success": true,
  "history": [
    {
      "id": 1,
      "appointment_id": 45,
      "user_id": 7,
      "user_name": "John Doe",
      "action": "created",
      "notes": "Appointment created",
      "created_at": "2025-10-22 10:30:00"
    },
    {
      "id": 2,
      "appointment_id": 45,
      "user_id": 1,
      "user_name": "Admin",
      "action": "confirmed",
      "notes": "Appointment confirmed by admin",
      "created_at": "2025-10-22 11:00:00"
    }
  ]
}
```

---

## 📊 Schedule Endpoints

### Create Schedule
**POST** `/schedules`  
👑 **Auth Required**: Admin

Creates a new schedule with working hours and slots.

**Body Parameters:**
```json
{
  "name": "November Schedule",
  "is_active": true,
  "start_date": "2025-11-01",
  "start_date_jalali": "1404/08/10",
  "end_date": "2025-11-30",
  "end_date_jalali": "1404/09/09",
  "meeting_duration": 30,
  "buffer_time": 0,
  "working_hours": [
    {
      "day_of_week": "mon",
      "start_time": "09:00",
      "end_time": "17:00"
    },
    {
      "day_of_week": "tue",
      "start_time": "09:00",
      "end_time": "17:00"
    }
  ]
}
```

**Response** (201):
```json
{
  "success": true,
  "message": "Schedule created successfully.",
  "schedule": {
    "id": 5,
    "name": "November Schedule",
    "is_active": 1,
    "start_date": "2025-11-01",
    "working_hours": [...]
  }
}
```

**Note**: Automatically generates all time slots based on working hours.

---

### Get All Schedules
**GET** `/schedules`  
👑 **Auth Required**: Admin

Returns all schedules.

**Response** (200):
```json
{
  "success": true,
  "schedules": [...],
  "count": 3
}
```

---

### Get Active Schedule
**GET** `/schedules/active`  
🔓 **Public**: No authentication required

Returns the currently active schedule.

**Response** (200):
```json
{
  "success": true,
  "schedule": {
    "id": 5,
    "name": "November Schedule",
    "is_active": 1,
    "start_date": "2025-11-01",
    "end_date": "2025-11-30",
    "meeting_duration": 30,
    "buffer_time": 0,
    "working_hours": [...]
  }
}
```

---

### Get Single Schedule
**GET** `/schedules/{id}`  
👑 **Auth Required**: Admin

Returns details for a specific schedule.

---

### Activate Schedule
**POST** `/schedules/{id}/activate`  
👑 **Auth Required**: Admin

Activates a schedule (deactivates all others).

**Response** (200):
```json
{
  "success": true,
  "message": "Schedule activated successfully."
}
```

---

### Delete Schedule
**DELETE** `/schedules/{id}`  
👑 **Auth Required**: Admin

Deletes a schedule (will fail if it has appointments).

**Response** (200):
```json
{
  "success": true,
  "message": "Schedule deleted successfully."
}
```

---

## 🕐 Slot Endpoints

### Get Available Slots
**GET** `/slots/available`  
🔓 **Public**: No authentication required

Returns available slots for the next N days.

**Query Parameters:**
- `days` (optional, default: 7): Number of days to retrieve

**Response** (200):
```json
{
  "success": true,
  "days": [
    {
      "date": "2025-11-15",
      "date_jalali": "1404/08/24",
      "slots": [
        {
          "id": 123,
          "start_time": "09:00:00",
          "end_time": "09:30:00",
          "status": "available"
        },
        {
          "id": 124,
          "start_time": "09:30:00",
          "end_time": "10:00:00",
          "status": "available"
        }
      ]
    }
  ]
}
```

---

### Get Slots by Date
**GET** `/slots/by-date`  
🔓 **Public**: No authentication required

Returns all slots for a specific date.

**Query Parameters:**
- `date` (required): Date in Y-m-d format
- `schedule_id` (optional): Specific schedule

**Response** (200):
```json
{
  "success": true,
  "date": "2025-11-15",
  "slots": [...]
}
```

---

### Get Slots by Schedule
**GET** `/slots/by-schedule`  
👑 **Auth Required**: Admin

Returns slots for a specific schedule with filters.

**Query Parameters:**
- `schedule_id` (required)
- `status` (optional): Filter by status
- `date_from` (optional)
- `date_to` (optional)

---

### Block Slot
**POST** `/slots/{id}/block`  
👑 **Auth Required**: Admin

Blocks a slot from being booked.

**Response** (200):
```json
{
  "success": true,
  "message": "Slot blocked successfully."
}
```

**Error**:
- `400` - Cannot block already booked slot

---

### Unblock Slot
**POST** `/slots/{id}/unblock`  
👑 **Auth Required**: Admin

Unblocks a previously blocked slot.

**Response** (200):
```json
{
  "success": true,
  "message": "Slot unblocked successfully."
}
```

---

## 🔑 Authentication & Errors

### Authentication Errors

**401 Unauthorized** - User not logged in:
```json
{
  "code": "not_logged_in",
  "message": "You must be logged in to book appointments. Please log in and try again.",
  "data": {
    "status": 401
  }
}
```

**403 Forbidden** - Insufficient permissions:
```json
{
  "code": "no_permission",
  "message": "You do not have permission to perform this action.",
  "data": {
    "status": 403
  }
}
```

### Business Logic Errors

**Max Appointments Reached**:
```json
{
  "code": "max_appointments_reached",
  "message": "You have reached the maximum of 3 active appointments. Please cancel or complete an existing appointment before booking a new one.",
  "data": {
    "status": 400
  }
}
```

**Slot Not Available**:
```json
{
  "code": "booking_failed",
  "message": "This time slot is no longer available.",
  "data": {
    "status": 400
  }
}
```

---

## 📊 Status Values

### Appointment Statuses
- `pending` - Newly created, awaiting confirmation
- `confirmed` - Admin confirmed
- `completed` - Session completed (admin assigned)
- `cancelled` - Cancelled by admin
- `cancel_requested` - User requested cancellation

### Slot Statuses
- `available` - Can be booked
- `booked` - Reserved by an appointment
- `blocked` - Manually blocked by admin

---

## 🔄 Workflow Examples

### User Books Appointment

1. **GET** `/slots/available?days=7` - Get available slots
2. **POST** `/appointments` - Book a slot
   ```json
   {
     "slot_id": 123,
     "schedule_id": 5,
     "note": "First appointment"
   }
   ```
3. Status: `pending`
4. Slot status: `available` → `booked`

### User Requests Cancellation

1. **POST** `/appointments/45/request-cancel`
   ```json
   {
     "reason": "Can't make it"
   }
   ```
2. Status: `pending/confirmed` → `cancel_requested`
3. Admin reviews via **GET** `/appointments/cancellation-requests`
4. Admin approves via **POST** `/appointments/45/cancel`
5. Status: `cancel_requested` → `cancelled`
6. Slot status: `booked` → `available`

### Admin Completes Appointment

1. **POST** `/appointments/45/complete`
2. Status: `pending/confirmed` → `completed`
3. `assigned_admin_id` set to current admin
4. `completed_at` timestamp recorded
5. Slot remains `booked` (history preserved)

---

## 🧪 Testing

### Using cURL

**Book Appointment:**
```bash
curl -X POST https://yoursite.com/wp-json/appointment-booking/v2/appointments \
  -H "Content-Type: application/json" \
  -b "wordpress_logged_in_cookie=..." \
  -d '{
    "slot_id": 123,
    "schedule_id": 5,
    "note": "Test appointment"
  }'
```

**Get Available Slots:**
```bash
curl https://yoursite.com/wp-json/appointment-booking/v2/slots/available?days=7
```

---

## 📝 Migration from v1

### Key Changes

| v1 Endpoint | v2 Endpoint | Changes |
|-------------|-------------|---------|
| `POST /appointments` | `POST /appointments` | - Removed `client_name`, `client_phone`<br>- Added `note`<br>- Requires login |
| `GET /available-slots` | `GET /slots/available` | - New structure (grouped by date)<br>- Returns objects, not strings |
| `POST /schedule` | `POST /schedules` | - Removed `admin_id`<br>- Renamed `selectedAdmin` → removed<br>- Renamed `weeklyHours` → `working_hours` |

### Response Structure Changes

**v1 Slots:**
```json
["09:00-09:30", "09:30-10:00"]
```

**v2 Slots:**
```json
[
  {
    "id": 123,
    "start_time": "09:00:00",
    "end_time": "09:30:00",
    "status": "available"
  }
]
```

---

**API Version**: 2.0.0  
**Last Updated**: October 2025

