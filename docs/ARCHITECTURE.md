# Appointment Booking Plugin - Architecture Documentation

## Overview

The Appointment Booking Plugin follows a clean, layered architecture with proper separation of concerns, using modern PHP patterns and best practices.

## Architecture Layers

```
┌─────────────────────────────────────────────┐
│           Presentation Layer                 │
│  (React Components, WordPress Admin Pages)  │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│            API Layer                         │
│  (REST Controllers, Middleware)              │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│          Business Logic Layer                │
│  (Services: Auth, Schedule, Appointment)     │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│         Data Access Layer                    │
│  (Repositories: Schedule, Slot, etc.)        │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│           Database Layer                     │
│  (MySQL with normalized schema)              │
└──────────────────────────────────────────────┘
```

## Core Components

### 1. Database Layer

**Normalized Schema** - 5 main tables:

- `wp_nobat_schedules` - Schedule information
- `wp_nobat_working_hours` - Working hours per day
- `wp_nobat_slots` - Individual bookable time slots
- `wp_nobat_appointments` - User appointments
- `wp_nobat_history` - Audit trail

**Benefits:**
- No JSON storage
- Proper foreign key relationships
- Optimized indexes for performance
- Data integrity via constraints

### 2. Repository Layer

**Purpose:** Abstract database operations and provide a clean interface for data access.

**Location:** `includes/repositories/`

**Base Repository** (`BaseRepository.php`):
- Common CRUD operations
- Query building helpers
- Transaction support
- Error handling

**Domain Repositories:**
- `ScheduleRepository.php` - Schedule queries
- `WorkingHoursRepository.php` - Working hours data
- `SlotRepository.php` - Slot availability queries
- `AppointmentRepository.php` - Appointment management
- `AppointmentHistoryRepository.php` - Audit trail
- `UserRepository.php` - WordPress user wrapper

**Responsibilities:**
- Execute queries using prepared statements
- Return domain-friendly data structures
- Handle database errors
- No business logic

### 3. Service Layer

**Purpose:** Implement business logic and coordinate between repositories.

**Location:** `includes/services/`

**Services:**

**AuthService** (`AuthService.php`):
- User authentication checks
- Permission verification
- Current user retrieval

**ScheduleService** (`ScheduleService.php`):
- Create/update schedules
- Generate slots from working hours
- Activate/deactivate schedules
- Coordinate schedule, working hours, and slots

**SlotService** (`SlotService.php`):
- Get available slots
- Block/unblock slots
- Check slot availability

**AppointmentService** (`AppointmentService.php`):
- Book appointments with business rules
- Enforce 3-appointment limit
- Request/approve cancellations
- Complete appointments with admin assignment
- Manage appointment lifecycle

**Responsibilities:**
- Business logic validation
- Coordinate multiple repositories
- Manage transactions
- Return meaningful errors

### 4. API Layer

**Purpose:** Handle HTTP requests and responses.

**Location:** `includes/rest/`

**Controllers** (`controllers/`):
- `AppointmentController.php` - Appointment endpoints
- `ScheduleController.php` - Schedule management
- `SlotController.php` - Slot queries

**Middleware** (`middleware/`):
- `AuthMiddleware.php` - Authentication checks

**Routes** (`routes.php`):
- v2 API endpoint registration
- Permission mapping
- Middleware application

**Responsibilities:**
- Validate input (basic)
- Call appropriate service
- Format response
- Handle HTTP status codes

### 5. Utility Layer

**Purpose:** Reusable helper functions and classes.

**Location:** `includes/utilities/`

**Utilities:**

**DateTimeHelper** (`DateTimeHelper.php`):
- Jalali/Gregorian conversion
- Persian digit conversion
- Time manipulation
- Calendar metadata generation

**Validator** (`Validator.php`):
- Input validation
- Data sanitization
- Type checking
- Business rule validation

**SlotGenerator** (`SlotGenerator.php`):
- Generate slots from working hours
- Calculate slot counts
- Validate slot overlaps

**Responsibilities:**
- Stateless operations
- No side effects
- Reusable across layers

### 6. Dependency Injection

**Purpose:** Manage service dependencies and lifecycle.

**Container** (`includes/core/Container.php`):
- Service registration
- Dependency resolution
- Singleton pattern support

**Bootstrap** (`includes/bootstrap.php`):
- Initialize container
- Register all services
- Wire dependencies

**Benefits:**
- Loose coupling
- Easy testing with mocks
- Clear dependency declarations
- Single source of truth

## Data Flow

### Example: Booking an Appointment

```
User Interaction (React Component)
        ↓
    HTTP POST /wp-json/appointment-booking/v2/appointments
        ↓
    AuthMiddleware (check login)
        ↓
    AppointmentController::create()
        ↓
    AppointmentService::book_appointment()
      ├─→ Check user appointment limit (via AppointmentRepository)
      ├─→ Verify slot availability (via SlotRepository)
      ├─→ Start database transaction
      ├─→ Update slot status to 'booked'
      ├─→ Create appointment record
      ├─→ Create history entry
      └─→ Commit transaction
        ↓
    Return appointment data (JSON)
        ↓
    Update React UI
```

## Design Patterns

### Repository Pattern
- **Purpose**: Abstract data access
- **Implementation**: BaseRepository + domain repositories
- **Benefits**: Testable, swappable data sources

### Service Layer Pattern
- **Purpose**: Encapsulate business logic
- **Implementation**: Service classes with injected repositories
- **Benefits**: Reusable, testable, maintainable

### Dependency Injection
- **Purpose**: Manage dependencies
- **Implementation**: Simple DI container
- **Benefits**: Loose coupling, easy testing

### Factory Pattern
- **Purpose**: Create slot instances
- **Implementation**: SlotGenerator
- **Benefits**: Centralized generation logic

## Transaction Management

**DatabaseTransaction** (`includes/database/DatabaseTransaction.php`):

```php
$transaction->execute(function() use ($data) {
    // Multiple database operations
    $this->slotRepo->update($slot_id, ['status' => 'booked']);
    $this->appointmentRepo->insert($appointment_data);
    $this->historyRepo->insert($history_data);
    
    // All succeed or all rollback
});
```

**Used in:**
- Appointment booking
- Schedule creation with slots
- Appointment cancellation

## Security

### Input Validation
- All inputs sanitized via WordPress functions
- Type validation via Validator utility
- Business rule validation in services

### SQL Injection Prevention
- All queries use prepared statements
- Repository layer abstracts wpdb
- No raw SQL in controllers or services

### Authentication
- WordPress user system
- AuthMiddleware for protected endpoints
- Role-based permissions

### Authorization
- Admin actions require `manage_options` capability
- User actions check ownership
- Service layer enforces business rules

## Performance Optimizations

### Database
- Proper indexes on frequently queried columns
- Foreign keys for referential integrity
- Composite indexes for common query patterns
- No N+1 queries (grouped fetches)

### Caching
- Repository instances reused (singletons)
- Service instances reused (singletons)
- Lazy loading via DI container

### Queries
- Optimized with proper JOINs
- Limited result sets
- Indexed WHERE clauses

## Error Handling

### Layers
1. **Database**: wpdb errors logged in repositories
2. **Repositories**: Return false on errors, log issues
3. **Services**: Return WP_Error with meaningful messages
4. **Controllers**: Convert WP_Error to HTTP responses
5. **Frontend**: Display user-friendly messages

### Example Error Flow
```php
// Repository
if ($result === false) {
    error_log('Repository insert failed: ' . $wpdb->last_error);
    return false;
}

// Service
if (!$result) {
    return new WP_Error('insert_failed', 'Could not create appointment');
}

// Controller
if (is_wp_error($result)) {
    return new WP_REST_Response([
        'message' => $result->get_error_message()
    ], 500);
}
```

## Testing Strategy

### Unit Tests (Planned)
- **Repositories**: Mock wpdb
- **Services**: Inject mock repositories
- **Utilities**: Test pure functions
- **Validators**: Test all validation rules

### Integration Tests (Planned)
- **API Endpoints**: Test full request/response
- **Database**: Test queries on test database
- **Transactions**: Test rollback scenarios

### Manual Testing
- **Functional**: All features tested manually
- **Browser**: Cross-browser compatibility
- **Performance**: Load testing for large datasets

## Backward Compatibility

### V1 API (Legacy)
- Still supported for admin interface
- Acts as compatibility layer
- Transforms data for old React components
- Will be deprecated after Phase 8

### V2 API (Current)
- Uses normalized schema directly
- Clean RESTful design
- Proper authentication
- Used by new frontend components

## Extension Points

### Adding New Features

**1. New Entity (e.g., Service Types):**
```
1. Add database table
2. Create repository
3. Create service (if needed)
4. Create controller
5. Register routes
6. Update frontend
```

**2. New Business Rule:**
```
1. Add validation in Validator utility
2. Implement in appropriate service
3. Add tests
```

**3. New API Endpoint:**
```
1. Add method in controller
2. Register route in routes.php
3. Apply middleware if needed
4. Document in API-v2-ENDPOINTS.md
```

## File Organization

```
appointment-booking/
├── appointment-booking.php (main plugin file, loads bootstrap)
├── includes/
│   ├── bootstrap.php (DI container initialization)
│   ├── core/
│   │   └── Container.php (DI container)
│   ├── database/
│   │   ├── DatabaseManager.php (schema management)
│   │   ├── DatabaseTransaction.php (transaction support)
│   │   ├── test-data.php (test data generation)
│   │   └── verify-migration.php (verification script)
│   ├── repositories/
│   │   ├── BaseRepository.php
│   │   ├── ScheduleRepository.php
│   │   ├── WorkingHoursRepository.php
│   │   ├── SlotRepository.php
│   │   ├── AppointmentRepository.php
│   │   ├── AppointmentHistoryRepository.php
│   │   └── UserRepository.php
│   ├── services/
│   │   ├── AuthService.php
│   │   ├── ScheduleService.php
│   │   ├── SlotService.php
│   │   └── AppointmentService.php
│   ├── utilities/
│   │   ├── DateTimeHelper.php
│   │   ├── Validator.php
│   │   └── SlotGenerator.php
│   ├── rest/
│   │   ├── controllers/
│   │   │   ├── AppointmentController.php
│   │   │   ├── ScheduleController.php
│   │   │   └── SlotController.php
│   │   ├── middleware/
│   │   │   └── AuthMiddleware.php
│   │   ├── routes.php (v2 API routes)
│   │   ├── register.php (v1 API routes - legacy)
│   │   ├── appointment-api.php (v1 handlers - legacy)
│   │   └── schedule-api.php (v1 handlers - legacy)
│   ├── activation.php (plugin activation, DB check)
│   ├── helpers.php (legacy wrapper functions)
│   ├── admin-menu.php
│   ├── admin-page.php
│   ├── admin-settings.php
│   └── enqueue-scripts.php
├── src/
│   ├── admin/ (React admin components)
│   └── frontend/ (React booking components)
└── docs/ (comprehensive documentation)
```

## Best Practices Followed

1. **Separation of Concerns**: Each layer has clear responsibilities
2. **Dependency Inversion**: Services depend on abstractions (repositories)
3. **Single Responsibility**: Each class has one job
4. **DRY Principle**: Reusable utilities and base classes
5. **KISS**: Simple, readable code over clever solutions
6. **Security First**: All inputs validated, all queries prepared
7. **Error Handling**: Consistent error flow from DB to UI
8. **Testability**: Mockable dependencies, injectable services
9. **Documentation**: Code documented, architecture explained
10. **WordPress Standards**: Follows WordPress coding standards

## Future Improvements

### Short Term
- Complete Phase 8 (Admin Interface Updates)
- Add comprehensive unit tests
- Performance benchmarking

### Long Term
- Multi-location support
- Advanced scheduling (recurring appointments)
- Email notifications
- Calendar synchronization (iCal, Google Calendar)
- Service provider management
- Appointment types/categories
- Custom fields for appointments
- Payment integration

## Conclusion

This architecture provides a solid foundation for a maintainable, scalable, and secure appointment booking system. The clean separation of concerns, proper use of design patterns, and comprehensive error handling make it easy to extend and modify while maintaining code quality.

