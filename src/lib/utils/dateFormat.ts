/**
 * Timezone constant for EST/EDT (America/New_York)
 * This automatically handles EST (UTC-5) and EDT (UTC-4) transitions
 */
const EST_TIMEZONE = 'America/New_York';

/**
 * Converts a date to EST timezone and returns the date components
 */
function getDateInEST(date: Date) {
  // Format the date in EST timezone
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: EST_TIMEZONE,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  });
  
  const parts = formatter.formatToParts(date);
  const year = parseInt(parts.find(p => p.type === 'year')?.value || '0', 10);
  const month = parseInt(parts.find(p => p.type === 'month')?.value || '0', 10);
  const day = parseInt(parts.find(p => p.type === 'day')?.value || '0', 10);
  
  return { year, month, day };
}

/**
 * Formats a date string to "December 8" format
 * Handles various input formats:
 * - MM/DD (e.g., "12/08" -> "December 8")
 * - YYYY-MM-DD (e.g., "2000-12-08" -> "December 8")
 * - MM/DD/YYYY (e.g., "12/08/2000" -> "December 8")
 * - Already formatted dates (returns as-is if parsing fails)
 */
export function formatDateOfBirth(dateStr: string | null | undefined): string {
  if (!dateStr) return '';

  const trimmed = dateStr.trim();
  if (!trimmed) return '';

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Try parsing MM/DD format (e.g., "12/08")
  const mmddMatch = trimmed.match(/^(\d{1,2})\/(\d{1,2})(?:\/\d{4})?$/);
  if (mmddMatch) {
    const month = parseInt(mmddMatch[1], 10);
    const day = parseInt(mmddMatch[2], 10);
    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      return `${monthNames[month - 1]} ${day}`;
    }
  }

  // Try parsing YYYY-MM-DD format (e.g., "2000-12-08")
  const isoMatch = trimmed.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (isoMatch) {
    const month = parseInt(isoMatch[2], 10);
    const day = parseInt(isoMatch[3], 10);
    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      return `${monthNames[month - 1]} ${day}`;
    }
  }

  // Try parsing as a Date object and convert to EST
  const date = new Date(trimmed);
  if (!isNaN(date.getTime())) {
    const { month, day } = getDateInEST(date);
    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      return `${monthNames[month - 1]} ${day}`;
    }
  }

  // If all parsing fails, return the original string
  return trimmed;
}

/**
 * Formats a date string to a readable "Last updated" format in EST timezone
 * Examples: "December 8, 2024" or "January 15, 2024"
 */
export function formatLastUpdated(dateStr: string | null | undefined): string {
  if (!dateStr) return '';

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const { month, day, year } = getDateInEST(date);

  return `${monthNames[month - 1]} ${day}, ${year}`;
}

/**
 * Formats a date to a locale date string in EST timezone
 */
export function formatDateToEST(date: Date | string | null | undefined): string {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) return '';
  
  return dateObj.toLocaleDateString('en-US', {
    timeZone: EST_TIMEZONE,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });
}

/**
 * Formats a date to a locale time string in EST timezone
 */
export function formatTimeToEST(date: Date | string | null | undefined): string {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) return '';
  
  return dateObj.toLocaleTimeString('en-US', {
    timeZone: EST_TIMEZONE,
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}












