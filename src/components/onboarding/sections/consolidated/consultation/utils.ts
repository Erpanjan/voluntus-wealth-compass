
import { format } from 'date-fns';

/**
 * Formats a date into a human-readable string
 * @param date The date to format
 * @returns Formatted date string
 */
export const getReadableDateFormat = (date: Date): string => {
  return format(date, 'EEEE, MMMM d, yyyy');
};
