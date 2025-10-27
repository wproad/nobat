/**
 * Check if appointment can be cancelled
 * @param {Object} appointment - Appointment object
 * @returns {boolean}
 */
export const canCancelAppointment = (appointment) => {
  if (!appointment) return false;

  // Can't cancel if already cancelled or completed
  if (
    appointment.status === "cancelled" ||
    appointment.status === "completed"
  ) {
    return false;
  }

  // Check if appointment date is in the future
  const appointmentDate = new Date(appointment.slot_date);
  const today = new Date();

  return appointmentDate >= today;
};
