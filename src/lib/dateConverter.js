/**
 * Date conversion utilities
 * Convert between Jalali (Persian) and Gregorian calendars
 *
 * @package Nobat
 */

/**
 * Jalali to Gregorian conversion algorithm
 * Based on Kazimierz M. Borkowski algorithm
 * 
 * @param {number} jy - Jalali year
 * @param {number} jm - Jalali month (1-12)
 * @param {number} jd - Jalali day (1-31)
 * @returns {array} [year, month, day] in Gregorian calendar
 */
function jalaaliToGregorianCore(jy, jm, jd) {
  const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  
  let gy, gm, gd;
  
  if (jy > 979) {
    gy = 1600;
    jy -= 979;
  } else {
    gy = 621;
  }
  
  let days = (365 * jy) + (Math.floor((jy / 33) * 8) + Math.floor(((jy % 33) + 3) / 4)) + 78 + jd;
  
  if (jm < 7) {
    days += (jm - 1) * 31;
  } else {
    days += ((jm - 7) * 30) + 186;
  }
  
  gy += 400 * Math.floor(days / 146097);
  days %= 146097;
  
  let leap = true;
  if (days >= 36525) {
    days--;
    gy += 100 * Math.floor(days / 36524);
    days %= 36524;
    
    if (days >= 365) {
      days++;
    } else {
      leap = false;
    }
  }
  
  gy += 4 * Math.floor(days / 1461);
  days %= 1461;
  
  if (days >= 366) {
    leap = false;
    days--;
    gy += Math.floor(days / 365);
    days %= 365;
  }
  
  gd = days + 1;
  
  const sal_a = [0, 31, (leap ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  
  for (gm = 0; gm < 13 && gd > sal_a[gm]; gm++) {
    gd -= sal_a[gm];
  }
  
  return [gy, gm, gd];
}

function convertJalaliToGregorian( $jalaliDate ) {
  // Check if wp-parsidate plugin is installed and active
  if ( function_exists( 'gregdate' )  ) {
   try {
    // Use wp-parsidate plugin functions
     return gregdate( 'Y-m-d' , $jalaliDate);
   } catch ( error ) {
    return false;
   }
  }
 
        return false;
 }

/**
 * Convert Jalali date to Gregorian date
 *
 * @param {string} jalaliDate - Jalali date in format YYYY/MM/DD or YYYY-MM-DD
 * @returns {string} Gregorian date in format YYYY-MM-DD
 */
export function jalaliToGregorian(jalaliDate) {
  if (!jalaliDate || typeof jalaliDate !== 'string') {
    console.error('jalaliToGregorian: Invalid input', jalaliDate);
    return '';
  }

  // Parse Jalali date (format: YYYY/MM/DD or YYYY-MM-DD)
  const parts = jalaliDate.split(/[/-]/);
  if (parts.length !== 3) {
    console.error('jalaliToGregorian: Invalid date format', jalaliDate);
    return '';
  }

  const jYear = parseInt(parts[0], 10);
  const jMonth = parseInt(parts[1], 10);
  const jDay = parseInt(parts[2], 10);

  if (isNaN(jYear) || isNaN(jMonth) || isNaN(jDay)) {
    console.error('jalaliToGregorian: Invalid date values', jalaliDate);
    return '';
  }

  // Validate Jalali date ranges
  if (jYear < 1 || jYear > 3178 || jMonth < 1 || jMonth > 12 || jDay < 1 || jDay > 31) {
    console.error('jalaliToGregorian: Date out of range', jalaliDate);
    return '';
  }

  try {
    // Convert using core algorithm
    const [gYear, gMonth, gDay] = jalaaliToGregorianCore(jYear, jMonth, jDay);
    
    // Format as YYYY-MM-DD
    const year = String(gYear);
    const month = String(gMonth).padStart(2, '0');
    const day = String(gDay).padStart(2, '0');
    
    const result = `${year}-${month}-${day}`;
    // console.log('jalaliToGregorian: Converted', jalaliDate, '→', result);
    
    return result;
  } catch (error) {
    console.error('jalaliToGregorian: Conversion error', error);
    return '';
  }
}

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
  
  const gy2 = (gm > 2) ? (gy + 1) : gy;
  days = (365 * gy) + (Math.floor((gy2 + 3) / 4)) - (Math.floor((gy2 + 99) / 100)) + (Math.floor((gy2 + 399) / 400)) - 80 + gd + g_d_m[gm - 1];
  
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
  if (!gregorianDate || typeof gregorianDate !== 'string') {
    console.error('gregorianToJalali: Invalid input', gregorianDate);
    return '';
  }

  // Parse Gregorian date (format: YYYY-MM-DD)
  const parts = gregorianDate.split('-');
  if (parts.length !== 3) {
    console.error('gregorianToJalali: Invalid date format', gregorianDate);
    return '';
  }

  const gYear = parseInt(parts[0], 10);
  const gMonth = parseInt(parts[1], 10);
  const gDay = parseInt(parts[2], 10);

  if (isNaN(gYear) || isNaN(gMonth) || isNaN(gDay)) {
    console.error('gregorianToJalali: Invalid date values', gregorianDate);
    return '';
  }

  // Validate Gregorian date ranges
  if (gYear < 1 || gYear > 3000 || gMonth < 1 || gMonth > 12 || gDay < 1 || gDay > 31) {
    console.error('gregorianToJalali: Date out of range', gregorianDate);
    return '';
  }

  try {
    // Convert using core algorithm
    const [jYear, jMonth, jDay] = gregorianToJalaaliCore(gYear, gMonth, gDay);
    
    // Format as YYYY/MM/DD
    const year = String(jYear);
    const month = String(jMonth).padStart(2, '0');
    const day = String(jDay).padStart(2, '0');
    
    const result = `${year}/${month}/${day}`;
    console.log('gregorianToJalali: Converted', gregorianDate, '→', result);
    
    return result;
  } catch (error) {
    console.error('gregorianToJalali: Conversion error', error);
    return '';
  }
}

/**
 * Format a date object to Jalali string
 *
 * @param {Date} date - JavaScript Date object
 * @returns {string} Jalali date in format YYYY/MM/DD
 */
export function formatDateToJalali(date) {
  if (!(date instanceof Date) || isNaN(date)) {
    return '';
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  const gregorian = `${year}-${month}-${day}`;
  return gregorianToJalali(gregorian);
}

/**
 * Get current date in Jalali format
 *
 * @returns {string} Current Jalali date in format YYYY/MM/DD
 */
export function getCurrentJalaliDate() {
  return formatDateToJalali(new Date());
}

