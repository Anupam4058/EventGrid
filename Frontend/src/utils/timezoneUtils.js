import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Convert a date/time from a specific timezone to UTC
 * @param {string|Date} dateTime - The date/time to convert
 * @param {string} fromTimezone - Source timezone
 * @returns {string} ISO string in UTC
 */
export const toUTC = (dateTime, fromTimezone) => {
    return dayjs.tz(dateTime, fromTimezone).utc().toISOString();
};

/**
 * Convert a UTC date to a specific timezone and return dayjs object
 * @param {string|Date} utcDate - UTC date
 * @param {string} toTimezone - Target timezone
 * @returns {Object} dayjs object in target timezone
 */
export const fromUTC = (utcDate, toTimezone) => {
    return dayjs.utc(utcDate).tz(toTimezone);
};

/**
 * Format a UTC date in a specific timezone
 * @param {string|Date} utcDate - UTC date
 * @param {string} timezone - Target timezone
 * @param {string} format - Format string (default: 'MMM DD, YYYY h:mm A')
 * @returns {string} Formatted date string
 */
export const formatInTimezone = (utcDate, timezone, format = 'MMM DD, YYYY h:mm A') => {
    return dayjs.utc(utcDate).tz(timezone).format(format);
};

/**
 * Get timezone abbreviation (e.g., EST, PST)
 * @param {string} timezone - Timezone identifier
 * @returns {string} Timezone abbreviation
 */
export const getTimezoneAbbr = (timezone) => {
    return dayjs().tz(timezone).format('z');
};

/**
 * Convert datetime-local input value to UTC
 * @param {string} datetimeLocal - Value from datetime-local input (YYYY-MM-DDTHH:mm)
 * @param {string} timezone - User's timezone
 * @returns {string} ISO string in UTC
 */
export const datetimeLocalToUTC = (datetimeLocal, timezone) => {
    return dayjs.tz(datetimeLocal, timezone).utc().toISOString();
};

/**
 * Convert UTC date to datetime-local input format
 * @param {string|Date} utcDate - UTC date
 * @param {string} timezone - User's timezone
 * @returns {string} Format: YYYY-MM-DDTHH:mm
 */
export const utcToDatetimeLocal = (utcDate, timezone) => {
    return dayjs.utc(utcDate).tz(timezone).format('YYYY-MM-DDTHH:mm');
};

/**
 * Get list of common timezones grouped by region
 * @returns {Array} Array of timezone objects
 */
export const getTimezoneList = () => {
    const timezones = [
        // Americas
        { value: 'America/New_York', label: 'Eastern Time (ET)', region: 'Americas' },
        { value: 'America/Chicago', label: 'Central Time (CT)', region: 'Americas' },
        { value: 'America/Denver', label: 'Mountain Time (MT)', region: 'Americas' },
        { value: 'America/Los_Angeles', label: 'Pacific Time (PT)', region: 'Americas' },
        { value: 'America/Anchorage', label: 'Alaska Time (AKT)', region: 'Americas' },
        { value: 'Pacific/Honolulu', label: 'Hawaii Time (HT)', region: 'Americas' },
        { value: 'America/Phoenix', label: 'Arizona Time (MST)', region: 'Americas' },
        { value: 'America/Toronto', label: 'Toronto', region: 'Americas' },
        { value: 'America/Vancouver', label: 'Vancouver', region: 'Americas' },
        { value: 'America/Sao_Paulo', label: 'São Paulo', region: 'Americas' },
        { value: 'America/Mexico_City', label: 'Mexico City', region: 'Americas' },
        { value: 'America/Argentina/Buenos_Aires', label: 'Buenos Aires', region: 'Americas' },
        
        // Europe
        { value: 'Europe/London', label: 'London (GMT/BST)', region: 'Europe' },
        { value: 'Europe/Paris', label: 'Paris (CET/CEST)', region: 'Europe' },
        { value: 'Europe/Berlin', label: 'Berlin (CET/CEST)', region: 'Europe' },
        { value: 'Europe/Rome', label: 'Rome (CET/CEST)', region: 'Europe' },
        { value: 'Europe/Madrid', label: 'Madrid (CET/CEST)', region: 'Europe' },
        { value: 'Europe/Amsterdam', label: 'Amsterdam (CET/CEST)', region: 'Europe' },
        { value: 'Europe/Brussels', label: 'Brussels (CET/CEST)', region: 'Europe' },
        { value: 'Europe/Vienna', label: 'Vienna (CET/CEST)', region: 'Europe' },
        { value: 'Europe/Zurich', label: 'Zurich (CET/CEST)', region: 'Europe' },
        { value: 'Europe/Athens', label: 'Athens (EET/EEST)', region: 'Europe' },
        { value: 'Europe/Istanbul', label: 'Istanbul (TRT)', region: 'Europe' },
        { value: 'Europe/Moscow', label: 'Moscow (MSK)', region: 'Europe' },
        
        // Asia
        { value: 'Asia/Dubai', label: 'Dubai (GST)', region: 'Asia' },
        { value: 'Asia/Kolkata', label: 'India (IST)', region: 'Asia' },
        { value: 'Asia/Shanghai', label: 'China (CST)', region: 'Asia' },
        { value: 'Asia/Tokyo', label: 'Tokyo (JST)', region: 'Asia' },
        { value: 'Asia/Seoul', label: 'Seoul (KST)', region: 'Asia' },
        { value: 'Asia/Hong_Kong', label: 'Hong Kong (HKT)', region: 'Asia' },
        { value: 'Asia/Singapore', label: 'Singapore (SGT)', region: 'Asia' },
        { value: 'Asia/Bangkok', label: 'Bangkok (ICT)', region: 'Asia' },
        { value: 'Asia/Jakarta', label: 'Jakarta (WIB)', region: 'Asia' },
        { value: 'Asia/Manila', label: 'Manila (PHT)', region: 'Asia' },
        
        // Pacific
        { value: 'Australia/Sydney', label: 'Sydney (AEDT/AEST)', region: 'Pacific' },
        { value: 'Australia/Melbourne', label: 'Melbourne (AEDT/AEST)', region: 'Pacific' },
        { value: 'Australia/Brisbane', label: 'Brisbane (AEST)', region: 'Pacific' },
        { value: 'Australia/Perth', label: 'Perth (AWST)', region: 'Pacific' },
        { value: 'Pacific/Auckland', label: 'Auckland (NZDT/NZST)', region: 'Pacific' },
        
        // Africa
        { value: 'Africa/Cairo', label: 'Cairo (EET)', region: 'Africa' },
        { value: 'Africa/Johannesburg', label: 'Johannesburg (SAST)', region: 'Africa' },
        { value: 'Africa/Lagos', label: 'Lagos (WAT)', region: 'Africa' },
        { value: 'Africa/Nairobi', label: 'Nairobi (EAT)', region: 'Africa' },
        
        // UTC
        { value: 'UTC', label: 'UTC (Coordinated Universal Time)', region: 'UTC' }
    ];
    
    return timezones;
};

/**
 * Get timezone options grouped by region for select dropdowns
 * @returns {Object} Object with regions as keys and timezone arrays as values
 */
export const getGroupedTimezones = () => {
    const timezones = getTimezoneList();
    const grouped = {};
    
    timezones.forEach(tz => {
        if (!grouped[tz.region]) {
            grouped[tz.region] = [];
        }
        grouped[tz.region].push(tz);
    });
    
    return grouped;
};

