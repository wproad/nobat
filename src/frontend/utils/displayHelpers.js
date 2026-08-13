import { __ } from "../../utils/i18n.js";

/**
 * Get CSS class for Soft Slot status badge based on appointment status
 * @param {string} status - Appointment status value
 * @returns {string} Soft Slot badge modifier class
 */
export const getStatusClass = (status) => {
  switch (status) {
    case "pending":
      return "bf-badge--pending";
    case "confirmed":
      return "bf-badge--confirmed";
    case "completed":
      return "bf-badge--past";
    case "cancelled":
      return "bf-badge--cancelled";
    case "cancel_requested":
      return "bf-badge--cancelled";
    default:
      return "bf-badge--past";
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
      return __("در انتظار تأیید", "nobat");
    case "confirmed":
      return __("تأیید شده", "nobat");
    case "completed":
      return __("انجام‌شده", "nobat");
    case "cancelled":
      return __("لغو شده", "nobat");
    case "cancel_requested":
      return __("درخواست لغو", "nobat");
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
  return time.substring(0, 5);
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
  return `${formattedStart} ${__("تا", "nobat")} ${formattedEnd}`;
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
