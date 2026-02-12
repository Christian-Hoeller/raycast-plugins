import { formatDistanceToNow, parseISO, isPast, isToday, isTomorrow, isYesterday } from "date-fns";

/**
 * Format a date string to relative time (e.g., "in 3 days", "2 hours ago")
 */
export function formatRelativeDate(dateString: string): string {
  try {
    const date = parseISO(dateString);

    // Handle special cases for better readability
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    if (isYesterday(date)) return "Yesterday";

    // Use date-fns for relative formatting
    const distance = formatDistanceToNow(date, { addSuffix: true });
    return distance;
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
}

/**
 * Format a date to ISO 8601 string for API submission
 */
export function formatDateForAPI(date: Date): string {
  return date.toISOString();
}

/**
 * Check if a date is overdue
 */
export function isOverdue(dateString: string): boolean {
  try {
    const date = parseISO(dateString);
    return isPast(date) && !isToday(date);
  } catch (error) {
    console.error("Error checking if overdue:", error);
    return false;
  }
}
