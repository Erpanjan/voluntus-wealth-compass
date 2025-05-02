
// Validation and time conversion utilities for the DateTimeSelector

// Convert 12-hour time format to 24-hour format
export const convertTo24Hour = (hour: string, minute: string, period: string): string => {
  const hourNum = parseInt(hour, 10);
  if (isNaN(hourNum) || hourNum < 1 || hourNum > 12) return '';
  
  let hour24 = hourNum;
  if (period === 'PM' && hourNum < 12) hour24 += 12;
  if (period === 'AM' && hourNum === 12) hour24 = 0;
  
  return `${hour24.toString().padStart(2, '0')}:${minute}`;
};

// Validate time format and operating hours (7AM to 9PM)
export const validateTimeInput = (time24: string, period: string): boolean => {
  if (!time24) return false;
  
  // Check the time format
  if (!/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time24)) {
    return false;
  }
  
  // Convert to minutes since midnight for easier comparison
  const [hours, minutes] = time24.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes;
  
  // Operating hours: 7AM to 9PM (420 to 1260 minutes)
  const minTime = 7 * 60; // 7:00 AM in minutes
  const maxTime = 21 * 60; // 9:00 PM in minutes
  
  return totalMinutes >= minTime && totalMinutes <= maxTime;
};

// Validate the time range (end after start and max 4 hours)
export const validateTimeRange = (start24: string, end24: string): boolean => {
  if (!start24 || !end24) return false;
  
  // Parse times
  const [startHours, startMinutes] = start24.split(':').map(Number);
  const [endHours, endMinutes] = end24.split(':').map(Number);
  
  // Calculate minutes since midnight
  const startTotalMinutes = startHours * 60 + startMinutes;
  const endTotalMinutes = endHours * 60 + endMinutes;
  
  // Check if end time is after start time
  if (endTotalMinutes <= startTotalMinutes) {
    return false;
  }
  
  // Calculate duration in minutes and check if within 4 hours (240 minutes)
  const durationMinutes = endTotalMinutes - startTotalMinutes;
  return durationMinutes <= 240;
};

// Input validation functions
export const validateHourInput = (value: string): boolean => {
  const hour = parseInt(value, 10);
  return !isNaN(hour) && hour >= 1 && hour <= 12;
};

export const validateMinuteInput = (value: string): boolean => {
  const minute = parseInt(value, 10);
  return !isNaN(minute) && minute >= 0 && minute <= 59;
};
