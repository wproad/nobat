import { __ } from "../../utils/i18n.js";

/**
 * Get color for status badge based on appointment status
 * Maps each status to a corresponding CSS custom property color
 * @param {string} status - Appointment status value (pending, confirmed, completed, cancelled, etc.)
 * @returns {string} CSS color variable or default gray
 */
export const getStatusColor = (status) => {
  switch (status) {
    case "pending":
      return "var(--color-warning-300)";
    case "confirmed":
      return "var(--color-success-300)";
    case "completed":
      return "var(--color-success-300)";
    case "cancelled":
      return "var(--color-error-300)";
    case "cancel_requested":
      return "var(--color-secondary-300)";
    default:
      return "var(--color-secondary-300)";
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
