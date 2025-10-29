# Testing Guide - Nobat Booking Plugin

This guide provides comprehensive testing procedures for the Nobat appointment booking system.

## 🔍 Testing Checklist

### 1. Authentication & Access Control

#### Guest User Testing

- [ ] Visit booking page as logged-out user
- [ ] **Verify:** LoginRequired component displays correctly
- [ ] **Verify:** "Log In" button links to correct login URL
- [ ] **Verify:** "Register" button links to correct registration URL
- [ ] **Verify:** No console errors related to authentication

#### Logged-in User Testing

- [ ] Login with valid WordPress user credentials
- [ ] **Verify:** Main component renders (not LoginRequired)
- [ ] **Verify:** Toggle button appears ("Book New Appointment" / "View My Appointments")
- [ ] **Verify:** No authentication-related console errors

---

### 2. Booking Form Testing

#### Form Fields & Validation

**Initial State:**

- [ ] **Verify:** Form loads with empty state
- [ ] **Verify:** "Book Appointment" button is disabled initially
- [ ] **Verify:** Time slot selector shows loading state or schedule data
- [ ] **Verify:** Notes textarea is empty and optional

**Day Selection:**

- [ ] Click on a day button
- [ ] **Verify:** Selected day is highlighted/active
- [ ] **Verify:** Time slots for selected day appear below
- [ ] **Verify:** Previous slot selection is cleared when changing day
- [ ] **Verify:** Console shows no errors during selection

**Time Slot Selection:**

- [ ] Click on an available time slot
- [ ] **Verify:** Selected slot is highlighted/active
- [ ] **Verify:** Form validation updates (button should enable)
- [ ] **Verify:** Selected day remains selected
- [ ] **Verify:** No JavaScript errors in console

**Notes Field:**

- [ ] Type text into notes textarea
- [ ] **Verify:** Text is saved correctly
- [ ] **Verify:** Form remains valid with notes
- [ ] **Verify:** Can submit with or without notes

**Form Submission:**

- [ ] Fill form completely (day + slot selected)
- [ ] Click "Book Appointment" button
- [ ] **Verify:** Button shows loading state during submission
- [ ] **Verify:** Success message displays if booking successful
- [ ] **Verify:** Error message displays if booking fails
- [ ] **Verify:** Form resets or redirects after success
- [ ] **Verify:** Console shows no errors (except expected API errors)

#### Test Data Scenarios

**Valid Data:**

```javascript
{
  day: "1403/01/15",
  slot: { id: 123, time: "10:00" },
  notes: "Test appointment - valid data"
}
```

- [ ] Submit with valid data
- [ ] **Verify:** Booking succeeds
- [ ] **Verify:** Success message appears

**Invalid Scenarios:**

- [ ] Submit without selecting day
- [ ] **Verify:** Error message: "Please select a time slot"
- [ ] **Verify:** Button remains disabled until valid selection

- [ ] Submit without selecting time slot (day selected but no slot)
- [ ] **Verify:** Error message appears
- [ ] **Verify:** Form does not submit

- [ ] Try to book already-booked slot
- [ ] **Verify:** Error message explains slot unavailable
- [ ] **Verify:** No console errors

**Edge Cases:**

- [ ] Select day with no available slots
- [ ] **Verify:** "No available time slots for this day" message displays
- [ ] **Verify:** Form button remains disabled

- [ ] Submit with very long notes (1000+ characters)
- [ ] **Verify:** Notes are truncated or validated appropriately
- [ ] **Verify:** No performance issues

---

### 3. My Appointments View Testing

#### Display & Navigation

**Initial Load:**

- [ ] Navigate to "My Appointments" tab/view
- [ ] **Verify:** Appointments load from API
- [ ] **Verify:** Loading state displays while fetching
- [ ] **Verify:** No console errors during load

**Tabs:**

- [ ] Click "Upcoming" tab
- [ ] **Verify:** Only upcoming appointments shown
- [ ] **Verify:** Count badge shows correct number

- [ ] Click "Cancelled" tab
- [ ] **Verify:** Only cancelled appointments shown
- [ ] **Verify:** Count badge accurate

- [ ] Click "Past" tab
- [ ] **Verify:** Only past appointments shown
- [ ] **Verify:** Count badge accurate

**Empty States:**

- [ ] Test with user having no appointments
- [ ] **Verify:** EmptyAppointmentsState component displays
- [ ] **Verify:** Helpful message shown to user
- [ ] **Verify:** "Book New Appointment" button/link works

#### Appointment Actions

**Cancellation Flow:**

- [ ] Click cancel button on upcoming appointment
- [ ] **Verify:** Cancellation request sent
- [ ] **Verify:** Confirmation message appears
- [ ] **Verify:** Appointment status updates (if instant) or shows pending
- [ ] **Verify:** No console errors

**View Details:**

- [ ] Click on appointment row/card
- [ ] **Verify:** Appointment details display correctly
- [ ] **Verify:** Date/time formatted correctly (Jalali/Georgian)
- [ ] **Verify:** Status badge displays correctly

---

### 4. View Toggling

- [ ] Click "Book New Appointment" from My Appointments view
- [ ] **Verify:** View switches to BookingForm
- [ ] **Verify:** Button text changes to "View My Appointments"

- [ ] Click "View My Appointments" from BookingForm view
- [ ] **Verify:** View switches to MyAppointments
- [ ] **Verify:** Button text changes to "Book New Appointment"

- [ ] Toggle back and forth multiple times
- [ ] **Verify:** No state persistence issues
- [ ] **Verify:** Forms reset appropriately
- [ ] **Verify:** No memory leaks (check React DevTools)

---

### 5. Error Handling & Messages

#### API Error Scenarios

**Network Errors:**

- [ ] Disable network connection
- [ ] Attempt to load appointments
- [ ] **Verify:** Error message displays: "Failed to fetch appointments. Please try again."
- [ ] **Verify:** Console shows error (expected)
- [ ] **Verify:** Error is user-friendly, not technical

**401 Unauthorized:**

- [ ] Test with expired/invalid session
- [ ] **Verify:** Redirects to login or shows auth error
- [ ] **Verify:** Appropriate error message

**404 Not Found:**

- [ ] Access schedule/slot that doesn't exist
- [ ] **Verify:** Error message displays
- [ ] **Verify:** User can retry or go back

**409 Conflict (Slot Already Booked):**

- [ ] Try to book slot that was just booked
- [ ] **Verify:** Error message explains conflict
- [ ] **Verify:** Form allows selecting new slot

**500 Server Error:**

- [ ] Simulate server error (if possible)
- [ ] **Verify:** User-friendly error message
- [ ] **Verify:** No technical error details exposed
- [ ] **Verify:** Retry option available (if applicable)

#### Form Validation Errors

- [ ] Submit empty form
- [ ] **Verify:** Validation error appears
- [ ] **Verify:** Focus moves to first invalid field (if applicable)
- [ ] **Verify:** Error is dismissible/clearable

---

### 6. Responsive Design Testing

#### Desktop Testing (1920px+)

- [ ] **Verify:** Layout uses full width appropriately
- [ ] **Verify:** Cards and forms are centered or properly sized
- [ ] **Verify:** Grid layouts (days/slots) display in full grid
- [ ] **Verify:** Spacing is comfortable (not too cramped)

#### Tablet Testing (768px - 1024px)

- [ ] **Verify:** Time slot grid adapts (2-3 columns)
- [ ] **Verify:** Day selector grid wraps appropriately
- [ ] **Verify:** Forms remain readable and usable
- [ ] **Verify:** Cards maintain proper width (not full screen)
- [ ] **Verify:** Touch targets are adequately sized (44px+)

#### Mobile Testing (320px - 767px)

- [ ] **Verify:** Time slot grid stacks or shows 1-2 columns
- [ ] **Verify:** Day selector scrolls horizontally or stacks
- [ ] **Verify:** Form inputs are full width or properly sized
- [ ] **Verify:** Buttons are large enough for touch (min 44x44px)
- [ ] **Verify:** Text is readable (minimum 16px)
- [ ] **Verify:** No horizontal scrolling (overflow hidden)
- [ ] **Verify:** Modals/notices adapt to small screen
- [ ] **Verify:** Tabs are accessible and usable

#### Orientation Testing

- [ ] **Portrait mode:** Test all mobile scenarios
- [ ] **Landscape mode:** Verify layout still works
- [ ] **Verify:** Keyboard doesn't cover form inputs (if applicable)

#### Browser Zoom Testing

- [ ] Test at 50% zoom
- [ ] Test at 150% zoom
- [ ] Test at 200% zoom
- [ ] **Verify:** Layout doesn't break
- [ ] **Verify:** Text remains readable
- [ ] **Verify:** Interactive elements remain usable

---

### 7. JavaScript Console Monitoring

#### During All Tests - Monitor Console For:

**Critical Errors (Should Never Appear):**

- [ ] `Uncaught TypeError` - ❌ **FAIL if found**
- [ ] `Uncaught ReferenceError` - ❌ **FAIL if found**
- [ ] `Maximum call stack exceeded` - ❌ **FAIL if found**
- [ ] React warnings about memory leaks - ❌ **FAIL if found**
- [ ] Infinite loop indicators - ❌ **FAIL if found**

**Warning-Level Issues (Should Be Minimal):**

- [ ] React deprecation warnings - ⚠️ **Review and fix**
- [ ] PropTypes validation warnings - ⚠️ **Review and fix**
- [ ] `console.warn` calls - ⚠️ **Review context**

**Expected Console Output (OK):**

- [ ] `console.log` for debugging (can be removed in production)
- [ ] `console.error` for API failures (expected, but should be handled gracefully)
- [ ] Network request logs (expected)

**Specific Console Checks:**

- [ ] Open console before page load
- [ ] Navigate through entire workflow
- [ ] **Verify:** No errors on initial page load
- [ ] **Verify:** No errors when switching views
- [ ] **Verify:** No errors during form interaction
- [ ] **Verify:** No errors on form submission
- [ ] **Verify:** No errors when API calls succeed
- [ ] **Verify:** Errors logged gracefully when API calls fail
- [ ] **Verify:** No memory leak warnings
- [ ] **Verify:** No React strict mode warnings

**Performance Monitoring:**

- [ ] Check console for performance warnings
- [ ] Monitor network tab for excessive API calls
- [ ] **Verify:** No unnecessary re-renders (check React DevTools)
- [ ] **Verify:** API calls are not duplicated

---

### 8. Cross-Browser Testing

#### Chrome/Chromium

- [ ] Test all scenarios above
- [ ] **Verify:** All features work

#### Firefox

- [ ] Test all scenarios above
- [ ] **Verify:** CSS Grid/Flexbox works correctly
- [ ] **Verify:** No Firefox-specific console errors

#### Safari

- [ ] Test all scenarios above
- [ ] **Verify:** Date handling works (Safari has quirks)
- [ ] **Verify:** CSS properties supported

#### Edge

- [ ] Test all scenarios above
- [ ] **Verify:** All features compatible

---

### 9. RTL (Right-to-Left) Testing

Since the plugin supports Persian/Farsi:

- [ ] **Verify:** Layout flips correctly in RTL mode
- [ ] **Verify:** Day selector aligns right
- [ ] **Verify:** Time slots align correctly
- [ ] **Verify:** Text alignment is right-to-left
- [ ] **Verify:** Forms and buttons align properly
- [ ] **Verify:** Jalali dates display correctly

---

### 10. Accessibility Testing

#### Keyboard Navigation

- [ ] Tab through all interactive elements
- [ ] **Verify:** Focus indicators are visible
- [ ] **Verify:** Tab order is logical
- [ ] **Verify:** All interactive elements are keyboard accessible
- [ ] **Verify:** Enter/Space activates buttons
- [ ] **Verify:** Esc closes modals (if any)

#### Screen Reader Testing

- [ ] Test with screen reader (NVDA/JAWS/VoiceOver)
- [ ] **Verify:** Form labels are announced
- [ ] **Verify:** Error messages are announced
- [ ] **Verify:** Status messages are announced
- [ ] **Verify:** Navigation is clear

#### Color Contrast

- [ ] **Verify:** Text meets WCAG AA contrast ratios (4.5:1 for normal, 3:1 for large)
- [ ] **Verify:** Button text is readable on button backgrounds
- [ ] **Verify:** Error/success messages have sufficient contrast

---

### 11. Data Persistence & State Management

#### Form State

- [ ] Fill form partially
- [ ] Switch views
- [ ] **Verify:** Form state resets (or preserves, depending on design)
- [ ] **Verify:** No data loss when switching views

#### API Data Caching

- [ ] Load appointments
- [ ] Switch views and come back
- [ ] **Verify:** Data refreshes appropriately
- [ ] **Verify:** No stale data displayed
- [ ] **Verify:** Loading states show during refresh

---

### 12. Integration Testing

#### WordPress Integration

- [ ] **Verify:** Shortcode `[nobat_booking]` renders correctly
- [ ] **Verify:** Container element `#nobat-new` exists
- [ ] **Verify:** WordPress REST API authentication works
- [ ] **Verify:** Nonce verification works (if applicable)
- [ ] **Verify:** User capabilities checked correctly

#### Plugin Conflicts

- [ ] Test with other common WordPress plugins active
- [ ] **Verify:** No JavaScript conflicts
- [ ] **Verify:** CSS doesn't conflict
- [ ] **Verify:** API endpoints don't conflict

---

## 📋 Quick Test Scenarios

### Scenario 1: Happy Path - Complete Booking

1. Log in as valid user
2. Navigate to booking page
3. Select a day
4. Select a time slot
5. Add optional notes
6. Submit form
7. **Verify:** Success message appears
8. **Verify:** Can view appointment in "My Appointments"

### Scenario 2: Error Recovery

1. Submit form without selecting slot
2. **Verify:** Error message appears
3. Select day and slot
4. **Verify:** Error clears
5. Submit again
6. **Verify:** Booking succeeds

### Scenario 3: Responsive Flow

1. Open page on desktop
2. Complete booking workflow
3. Resize to tablet size
4. **Verify:** Layout adapts
5. Resize to mobile size
6. **Verify:** Layout works on mobile
7. Complete booking on mobile
8. **Verify:** All interactions work

### Scenario 4: Multiple Appointments

1. Book first appointment
2. Navigate to "My Appointments"
3. **Verify:** Appointments list updates
4. Click "Book New Appointment"
5. Book second appointment
6. **Verify:** Both appointments visible
7. **Verify:** Tabs show correct counts

---

## 🐛 Known Issues to Verify Are Fixed

Based on code review, watch for:

- [ ] Console.log statements in production code (should be removed)
- [ ] Error handling for edge cases in date conversion
- [ ] Proper loading states during API calls
- [ ] Form validation feedback is immediate and clear

---

## 📝 Test Data

### Sample Appointment Data (for testing)

```javascript
{
  id: 1,
  slot_id: 123,
  schedule_id: 1,
  user_id: 1,
  status: 'confirmed',
  note: 'Test appointment notes',
  created_at: '2024-01-15T10:00:00',
  jalali_date: '1403/01/15'
}
```

### Sample Schedule Data

```javascript
{
  id: 1,
  title: 'Test Schedule',
  is_active: true,
  days: [
    {
      jalali_date: '1403/01/15',
      slots: [
        { id: 123, time: '10:00', status: 'available' },
        { id: 124, time: '11:00', status: 'available' }
      ]
    }
  ]
}
```

---

## ✅ Pass/Fail Criteria

**PASS Requirements:**

- ✅ No JavaScript errors in console
- ✅ All forms work with valid data
- ✅ All error messages display correctly
- ✅ Responsive design works on all breakpoints
- ✅ All workflows complete without breaking
- ✅ Loading states display appropriately
- ✅ User feedback is clear and immediate

**FAIL Criteria:**

- ❌ Any uncaught JavaScript exceptions
- ❌ Forms submit invalid data
- ❌ Errors don't display to users
- ❌ Layout breaks on mobile
- ❌ Workflows get stuck or don't complete
- ❌ No loading feedback during API calls
- ❌ User sees technical error messages

---

## 📊 Test Report Template

```markdown
# Test Report - [Date]

## Environment

- Browser: [Browser/Version]
- Screen Size: [Desktop/Tablet/Mobile]
- WordPress Version: [Version]
- Plugin Version: [Version]

## Test Results

### Authentication: [PASS/FAIL]

Notes:

### Booking Form: [PASS/FAIL]

Notes:

### My Appointments: [PASS/FAIL]

Notes:

### Responsive Design: [PASS/FAIL]

Notes:

### Error Handling: [PASS/FAIL]

Notes:

### Console Errors: [PASS/FAIL]

Errors Found:

## Overall Status: [PASS/FAIL]
```

---

**Last Updated:** 2024-01-15
**Maintained By:** Development Team
