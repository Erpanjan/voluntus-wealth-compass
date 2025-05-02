
import { useState, useEffect } from 'react';

interface TimeValidationResult {
  timeError: string | null;
  validateAndUpdateTimes: (start: string, end: string) => void;
  getTimeInMinutes: (timeString: string) => number;
  getReadableTimeFormat: (time: string) => string;
  getDurationText: (startTime: string, endTime: string) => string;
  timeRegex: RegExp;
}

export const useTimeValidation = (
  initialStartTime: string,
  initialEndTime: string,
  onTimeRangeChange: (startTime: string, endTime: string) => void
): TimeValidationResult => {
  const [timeError, setTimeError] = useState<string | null>(null);
  
  // Time regex validation for HH:MM in 24h format
  const timeRegex = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;
  
  // Operating hours range (7:00 to 22:00)
  const minTimeMinutes = 7 * 60;
  const maxTimeMinutes = 22 * 60;

  // Convert time string (HH:MM) to minutes for easier comparison
  const getTimeInMinutes = (timeString: string): number => {
    if (!timeString || !timeRegex.test(timeString)) return -1;
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // Get readable time format (12-hour format with AM/PM)
  const getReadableTimeFormat = (time: string): string => {
    if (!time || !timeRegex.test(time)) return '';
    
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12; // Convert 0 to 12 for 12 AM
    
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  // Validate time input and update if valid
  const validateAndUpdateTimes = (start: string, end: string) => {
    setTimeError(null);
    
    // Skip validation if either time is not properly formatted
    if (!timeRegex.test(start) || !timeRegex.test(end)) {
      return;
    }
    
    const startMinutes = getTimeInMinutes(start);
    const endMinutes = getTimeInMinutes(end);
    
    // Check if times are within operating hours
    if (startMinutes < minTimeMinutes || startMinutes > maxTimeMinutes) {
      setTimeError('Start time must be between 7:00 AM and 10:00 PM');
      return;
    }
    
    if (endMinutes < minTimeMinutes || endMinutes > maxTimeMinutes) {
      setTimeError('End time must be between 7:00 AM and 10:00 PM');
      return;
    }
    
    // Validate time range logic
    if (endMinutes <= startMinutes) {
      setTimeError('End time must be after start time');
      return;
    }
    
    const durationMinutes = endMinutes - startMinutes;
    if (durationMinutes > 180) {
      setTimeError('Consultation duration must be 3 hours or less');
      return;
    }
    
    // If we get here, the times are valid, update the parent
    onTimeRangeChange(start, end);
  };

  // Helper function to get duration text
  const getDurationText = (startTime: string, endTime: string): string => {
    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) return '';
    
    const startMinutes = getTimeInMinutes(startTime);
    const endMinutes = getTimeInMinutes(endTime);
    
    if (endMinutes <= startMinutes) return '';
    
    const durationMinutes = endMinutes - startMinutes;
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

  return {
    timeError,
    validateAndUpdateTimes,
    getTimeInMinutes,
    getReadableTimeFormat,
    getDurationText,
    timeRegex
  };
};
