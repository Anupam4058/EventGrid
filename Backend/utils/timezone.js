const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Convert a date from one timezone to UTC
 * @param {string|Date} date - The date to convert
 * @param {string} fromTimezone - Source timezone
 * @returns {Date} UTC date
 */
const toUTC = (date, fromTimezone) => {
    return dayjs.tz(date, fromTimezone).utc().toDate();
};

/**
 * Convert a UTC date to a specific timezone
 * @param {string|Date} utcDate - UTC date
 * @param {string} toTimezone - Target timezone
 * @returns {Object} dayjs object in target timezone
 */
const fromUTC = (utcDate, toTimezone) => {
    return dayjs.utc(utcDate).tz(toTimezone);
};

/**
 * Format a date in a specific timezone
 * @param {string|Date} date - Date to format
 * @param {string} timezone - Target timezone
 * @param {string} format - Format string (default: 'YYYY-MM-DD HH:mm:ss')
 * @returns {string} Formatted date string
 */
const formatInTimezone = (date, timezone, format = 'YYYY-MM-DD HH:mm:ss') => {
    return dayjs.utc(date).tz(timezone).format(format);
};

/**
 * Get current time in a specific timezone
 * @param {string} timezone - Target timezone
 * @returns {Object} dayjs object in target timezone
 */
const nowInTimezone = (timezone) => {
    return dayjs().tz(timezone);
};

module.exports = {
    toUTC,
    fromUTC,
    formatInTimezone,
    nowInTimezone
};

