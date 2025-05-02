
import { format } from 'date-fns';

// Type definitions
export interface TimeOption {
  value: string;
  label: string;
}

// Helper functions to get readable formats
export const getReadableDateFormat = (date: Date | undefined): string => {
  if (!date) return '';
  return format(date, 'EEEE, MMMM d, yyyy');
};

export const getReadableTimeFormat = (time: string): string => {
  if (!time) return '';
  
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12; // Convert 0 to 12 for 12 AM
  
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
};

// Get duration in a readable format
export const getReadableDuration = (startTime: string, endTime: string): string => {
  if (!startTime || !endTime) return '';
  
  const startMinutes = getTimeInMinutes(startTime);
  const endMinutes = getTimeInMinutes(endTime);
  const durationMinutes = endMinutes - startMinutes;
  
  if (durationMinutes <= 0) return '';
  
  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;
  
  let result = '';
  if (hours > 0) {
    result += `${hours} hour${hours > 1 ? 's' : ''}`;
  }
  
  if (minutes > 0) {
    result += `${hours > 0 ? ' ' : ''}${minutes} minute${minutes > 1 ? 's' : ''}`;
  }
  
  return result;
};

// Convert time string (HH:MM) to minutes for easier comparison
export const getTimeInMinutes = (timeString: string): number => {
  if (!timeString) return 0;
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
};

// Available times data
export const getAvailableTimes = (): TimeOption[] => {
  return [
    { value: '07:00', label: '7:00 AM' },
    { value: '07:30', label: '7:30 AM' },
    { value: '08:00', label: '8:00 AM' },
    { value: '08:30', label: '8:30 AM' },
    { value: '09:00', label: '9:00 AM' },
    { value: '09:30', label: '9:30 AM' },
    { value: '10:00', label: '10:00 AM' },
    { value: '10:30', label: '10:30 AM' },
    { value: '11:00', label: '11:00 AM' },
    { value: '11:30', label: '11:30 AM' },
    { value: '12:00', label: '12:00 PM' },
    { value: '12:30', label: '12:30 PM' },
    { value: '13:00', label: '1:00 PM' },
    { value: '13:30', label: '1:30 PM' },
    { value: '14:00', label: '2:00 PM' },
    { value: '14:30', label: '2:30 PM' },
    { value: '15:00', label: '3:00 PM' },
    { value: '15:30', label: '3:30 PM' },
    { value: '16:00', label: '4:00 PM' },
    { value: '16:30', label: '4:30 PM' },
    { value: '17:00', label: '5:00 PM' },
    { value: '17:30', label: '5:30 PM' },
    { value: '18:00', label: '6:00 PM' },
    { value: '18:30', label: '6:30 PM' },
    { value: '19:00', label: '7:00 PM' },
    { value: '19:30', label: '7:30 PM' },
    { value: '20:00', label: '8:00 PM' },
    { value: '20:30', label: '8:30 PM' },
    { value: '21:00', label: '9:00 PM' },
    { value: '21:30', label: '9:30 PM' },
    { value: '22:00', label: '10:00 PM' },
  ];
};
