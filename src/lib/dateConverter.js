/**
 * Date conversion utilities
 * Convert between Jalali (Persian) and Gregorian calendars
 *
 * @package Nobat
 */

/**
 * Gregorian to Jalali conversion algorithm
 * Based on Kazimierz M. Borkowski algorithm
 *
 * @param {number} gy - Gregorian year
 * @param {number} gm - Gregorian month (1-12)
 * @param {number} gd - Gregorian day (1-31)
 * @returns {array} [year, month, day] in Jalali calendar
 */
function gregorianToJalaaliCore(gy, gm, gd) {
  const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];

  let jy, jm, jd, days;

  if (gy > 1600) {
    jy = 979;
    gy -= 1600;
  } else {
    jy = 0;
    gy -= 621;
  }

  const gy2 = gm > 2 ? gy + 1 : gy;
  days =
    365 * gy +
    Math.floor((gy2 + 3) / 4) -
    Math.floor((gy2 + 99) / 100) +
    Math.floor((gy2 + 399) / 400) -
    80 +
    gd +
    g_d_m[gm - 1];

  jy += 33 * Math.floor(days / 12053);
  days %= 12053;

  jy += 4 * Math.floor(days / 1461);
  days %= 1461;

  if (days > 365) {
    jy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }

  if (days < 186) {
    jm = 1 + Math.floor(days / 31);
    jd = 1 + (days % 31);
  } else {
    jm = 7 + Math.floor((days - 186) / 30);
    jd = 1 + ((days - 186) % 30);
  }

  return [jy, jm, jd];
}

/**
 * Convert Gregorian date to Jalali date
 *
 * @param {string} gregorianDate - Gregorian date in format YYYY-MM-DD
 * @returns {string} Jalali date in format YYYY/MM/DD
 */
export function gregorianToJalali(gregorianDate) {
  if (!gregorianDate || typeof gregorianDate !== "string") {
    console.error("gregorianToJalali: Invalid input", gregorianDate);
    return "";
  }

  // Parse Gregorian date (format: YYYY-MM-DD)
  const parts = gregorianDate.split("-");
  if (parts.length !== 3) {
    console.error("gregorianToJalali: Invalid date format", gregorianDate);
    return "";
  }

  const gYear = parseInt(parts[0], 10);
  const gMonth = parseInt(parts[1], 10);
  const gDay = parseInt(parts[2], 10);

  if (isNaN(gYear) || isNaN(gMonth) || isNaN(gDay)) {
    console.error("gregorianToJalali: Invalid date values", gregorianDate);
    return "";
  }

  // Validate Gregorian date ranges
  if (
    gYear < 1 ||
    gYear > 3000 ||
    gMonth < 1 ||
    gMonth > 12 ||
    gDay < 1 ||
    gDay > 31
  ) {
    console.error("gregorianToJalali: Date out of range", gregorianDate);
    return "";
  }

  try {
    // Convert using core algorithm
    const [jYear, jMonth, jDay] = gregorianToJalaaliCore(gYear, gMonth, gDay);

    // Format as YYYY/MM/DD
    const year = String(jYear);
    const month = String(jMonth).padStart(2, "0");
    const day = String(jDay).padStart(2, "0");

    const result = `${year}/${month}/${day}`;
    console.log("gregorianToJalali: Converted", gregorianDate, "→", result);

    return result;
  } catch (error) {
    console.error("gregorianToJalali: Conversion error", error);
    return "";
  }
}
