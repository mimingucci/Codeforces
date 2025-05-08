import {
  parseISO,
  formatDistance,
  format,
  differenceInHours,
  differenceInMinutes,
  addHours,
} from "date-fns";

/**
 * Format a date for display in contest tables
 * @param {string} isoString - ISO date string
 * @returns {string} Formatted date string (e.g., "Apr 28, 2024 15:30")
 */
export const formatContestDate = (isoString) => {
  try {
    const date = parseISO(isoString);
    return format(date, "MMM dd, yyyy HH:mm");
  } catch (error) {
    console.error("Invalid date format:", error);
    return "Invalid date";
  }
};

/**
 * Calculate duration between two dates in hours and minutes
 * @param {string} startTime - ISO start time
 * @param {string} endTime - ISO end time
 * @returns {string} Formatted duration (e.g., "2h 30m")
 */
export const calculateDuration = (startTime, endTime) => {
  try {
    const start = parseISO(startTime);
    const end = parseISO(endTime);

    const hours = differenceInHours(end, start);
    const minutes = differenceInMinutes(end, start) % 60;

    if (minutes === 0) {
      return `${hours}h`;
    }
    return `${hours}h ${minutes}m`;
  } catch (error) {
    console.error("Error calculating duration:", error);
    return "N/A";
  }
};

/**
 * Format contest duration in hours with decimals
 * @param {string} startTime - ISO start time
 * @param {string} endTime - ISO end time
 * @returns {string} Formatted duration (e.g., "3 hours" or "3.5 hours")
 */
export const formatContestDurationHours = (startTime, endTime) => {
  try {
    const start = parseISO(startTime);
    const end = parseISO(endTime);

    const hours = differenceInHours(end, start);
    const minutes = differenceInMinutes(end, start) % 60;

    const totalHours = hours + minutes / 60;

    // If duration is whole number of hours
    if (minutes === 0) {
      return `${hours} hour${hours !== 1 ? "s" : ""}`;
    }

    // For partial hours, show one decimal place
    return `${totalHours.toFixed(1)} hours`;
  } catch (error) {
    console.error("Error formatting contest duration:", error);
    return "N/A";
  }
};

/**
 * Get relative time from now
 * @param {string} isoString - ISO date string
 * @returns {string} Relative time (e.g., "starts in 2 days" or "ended 3 hours ago")
 */
export const getRelativeTime = (isoString) => {
  try {
    const date = parseISO(isoString);
    return formatDistance(date, new Date(), { addSuffix: true });
  } catch (error) {
    console.error("Error calculating relative time:", error);
    return "N/A";
  }
};

/**
 * Calculate contest end time from start time and duration
 * @param {string} startTime - ISO start time
 * @param {number} durationHours - Duration in hours
 * @returns {string} ISO end time
 */
export const calculateEndTime = (startTime, durationHours) => {
  try {
    const start = parseISO(startTime);
    return addHours(start, durationHours).toISOString();
  } catch (error) {
    console.error("Error calculating end time:", error);
    return null;
  }
};

export const convertUnixTimestamp = (timestamp) => {
  // Split into seconds and nanoseconds
  const [seconds, nanos] = String(timestamp).split(".");
  // Convert to milliseconds
  return new Date(parseInt(seconds) * 1000);
};
