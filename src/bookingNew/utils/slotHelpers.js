/**
 * Parse a Gregorian Y-m-d date as local midnight.
 * @param {string} date - Date string (YYYY-MM-DD)
 * @returns {Date|null}
 */
const parseLocalDate = (date) => {
  if (!date || typeof date !== "string") return null;

  const [year, month, day] = date.split("-").map(Number);
  if (!year || !month || !day) return null;

  return new Date(year, month - 1, day);
};

/**
 * Parse a Gregorian date + time as a local Date.
 * @param {string} date - Date string (YYYY-MM-DD)
 * @param {string} time - Time string (HH:MM or HH:MM:SS)
 * @returns {Date|null}
 */
const parseLocalDateTime = (date, time) => {
  const localDate = parseLocalDate(date);
  if (!localDate) return null;

  const [hours = 0, minutes = 0, seconds = 0] = String(time || "00:00:00")
    .split(":")
    .map(Number);

  localDate.setHours(hours, minutes, seconds, 0);
  return localDate;
};

/**
 * Filter schedule timeslots to only today/future days, and only future slots.
 * Past days are removed. On the current day, slots whose start time has passed
 * are removed. Days with no remaining slots are omitted.
 *
 * @param {Array} days - Timeslots grouped by day from the schedule API
 * @param {Date} [now=new Date()] - Reference time (injectable for tests)
 * @returns {Array} Filtered day objects with future slots only
 */
export const getBookableDays = (days, now = new Date()) => {
  if (!Array.isArray(days)) return [];

  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  return days
    .map((day) => {
      const dayDate = parseLocalDate(day?.date);
      if (!dayDate || dayDate < startOfToday) {
        return null;
      }

      const slots = Array.isArray(day.slots) ? day.slots : [];
      const futureSlots = slots.filter((slot) => {
        const slotDateTime = parseLocalDateTime(day.date, slot?.start_time);
        return slotDateTime && slotDateTime > now;
      });

      if (futureSlots.length === 0) {
        return null;
      }

      return {
        ...day,
        slots: futureSlots,
      };
    })
    .filter(Boolean);
};
