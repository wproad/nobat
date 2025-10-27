import { __ } from "../../utils/i18n.js";

/**
 * Get color for status badge
 * @param {string} status - Status value
 * @returns {string} CSS color variable
 */
export const getStatusColor = (status) => {
  switch (status) {
    case "pending":
      return "var(--color-warning-500)";
    case "confirmed":
      return "var(--color-success-500)";
    case "completed":
      return "var(--color-success-600)";
    case "cancelled":
      return "var(--color-error-500)";
    default:
      return "var(--color-secondary-400)";
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
      return __("در انتظار تایید", "nobat");
    case "confirmed":
      return __("تایید شده", "nobat");
    case "completed":
      return __("تکمیل شده", "nobat");
    case "cancelled":
      return __("لغو شده", "nobat");
    default:
      return status;
  }
};

/**
 * Format time string by removing seconds
 * @param {string} time - Time string (HH:MM:SS)
 * @returns {string} Formatted time (HH:MM)
 */
export const formatTime = (time) => {
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
  const formattedStart = formatTime(startTime);
  const formattedEnd = formatTime(endTime);
  return `${formattedStart} تا ${formattedEnd}`;
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
