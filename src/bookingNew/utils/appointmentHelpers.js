/**
 * Sort appointments by date (oldest first)
 * @param {Array} appointments - Array of appointment objects
 * @returns {Array} Sorted appointments array
 */
export const sortAppointmentsByDate = (appointments) => {
  return appointments.sort((a, b) => {
    const dateA = new Date(`${a.slot_date} ${a.start_time}`);
    const dateB = new Date(`${b.slot_date} ${b.start_time}`);
    return dateA - dateB; // Oldest first
  });
};

/**
 * Check if appointment can be cancelled
 * @param {Object} appointment - Appointment object
 * @returns {boolean}
 */
export const userAllowedToCancelAppointment = (appointment) => {
  if (!appointment) return false;

  // Can't cancel if already cancelled or completed
  if (
    appointment.status === "cancelled" ||
    appointment.status === "completed" || 
    appointment.status === "cancel_requested"
  ) {
    return false;
  }

  // Check if appointment date is in the future
  const appointmentDate = new Date(appointment.slot_date);
  const today = new Date();

  return appointmentDate >= today;
};

/**
 * Categorize appointments based on status and date, with sorting applied
 * @param {Array} appointments - Array of appointment objects
 * @returns {Object} Object with categorized and sorted appointments
 */
export const categorizeAppointments = (appointments) => {
  const now = new Date();

  const categorized = appointments.reduce(
    (acc, appointment) => {
      const appointmentDateTime = new Date(
        `${appointment.slot_date} ${appointment.start_time}`
      );

      if (appointment.status === "completed" || appointmentDateTime < now) {
        // All past appointments (completed or past date/time) go to past tab
        acc.past.push(appointment);
      } else if (appointment.status === "cancelled") {
        // Only future cancelled appointments stay in cancelled tab
        acc.cancelled.push(appointment);
      } else {
        acc.upcoming.push(appointment);
      }

      return acc;
    },
    { upcoming: [], cancelled: [], past: [] }
  );

  // Apply sorting to each category
  categorized.upcoming = sortAppointmentsByDate(categorized.upcoming);
  categorized.cancelled = sortAppointmentsByDate(categorized.cancelled);
  categorized.past = sortAppointmentsByDate(categorized.past);

  return categorized;
};
