import { __ } from "../../utils/i18n.js";

/**
 * Get CSS class for status badge based on appointment status
 * Maps each status to a corresponding CSS class for automatic styling
 * @param {string} status - Appointment status value (pending, confirmed, completed, cancelled, etc.)
 * @returns {string} CSS class name
 */
export const getStatusClass = (status) => {
  switch (status) {
    case "pending":
      return "status-pending";
    case "confirmed":
      return "status-confirmed";
    case "completed":
      return "status-completed";
    case "cancelled":
      return "status-cancelled";
    case "cancel_requested":
      return "status-cancel-requested";
    default:
      return "status-default";
  }
};

/**
 * Get localized status text
 * @param {string} status - Status value
 * @returns {string} Localized status text
 */
export const getStatusText = (status) => {
  switch (status) {
    case "pending":
      return __("Pending Confirmation", "nobat");
    case "confirmed":
      return __("Confirmed", "nobat");
    case "completed":
      return __("Completed", "nobat");
    case "cancelled":
      return __("Cancelled", "nobat");
    case "cancel_requested":
      return __("Cancel Requested", "nobat");
    default:
      return status;
  }
};

/**
 * Format time string by removing seconds
 * @param {string} time - Time string (HH:MM:SS)
 * @returns {string} Formatted time (HH:MM)
 */
export const stripSeconds = (time) => {
  if (!time) return "";
  return time.substring(0, 5); // Remove seconds
};

/**
 * Format time range from start and end time
 * @param {string} startTime - Start time
 * @param {string} endTime - End time
 * @returns {string} Formatted time range
 */
export const formatTimeRange = (startTime, endTime) => {
  const formattedStart = stripSeconds(startTime);
  const formattedEnd = stripSeconds(endTime);
  return `${formattedStart} ${__("to", "nobat")} ${formattedEnd}`;
};

/**
 * Get display name for user
 * @param {Object} user - User object
 * @returns {string} Display name
 */
export const getUserDisplayName = (user) => {
  if (!user) return "";

  return user.user_name || user.name || user.display_name || "";
};
