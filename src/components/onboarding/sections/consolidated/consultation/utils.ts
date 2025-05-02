
import { format } from 'date-fns';

// Type definitions
export interface TimeOption {
  value: string;
  label: string;
}

export interface TimeGroup {
  label: string;
  times: TimeOption[];
}

// Helper functions to get readable formats
export const getReadableDateFormat = (date: Date | undefined): string => {
  if (!date) return '';
  return format(date, 'EEEE, MMMM d, yyyy');
};

export const getReadableTimeFormat = (time: string, availableTimes: TimeGroup[]): string => {
  if (!time) return '';
  for (const group of availableTimes) {
    const foundTime = group.times.find(t => t.value === time);
    if (foundTime) return foundTime.label;
  }
  return time;
};

// Available times data
export const getAvailableTimes = (): TimeGroup[] => {
  return [
    {
      label: 'Morning',
      times: [
        { value: '07:00', label: '7:00 AM' },
        { value: '08:00', label: '8:00 AM' },
        { value: '09:00', label: '9:00 AM' },
        { value: '10:00', label: '10:00 AM' },
        { value: '11:00', label: '11:00 AM' },
      ]
    },
    {
      label: 'Afternoon',
      times: [
        { value: '12:00', label: '12:00 PM' },
        { value: '13:00', label: '1:00 PM' },
        { value: '14:00', label: '2:00 PM' },
        { value: '15:00', label: '3:00 PM' },
        { value: '16:00', label: '4:00 PM' },
        { value: '17:00', label: '5:00 PM' },
      ]
    },
    {
      label: 'Evening',
      times: [
        { value: '18:00', label: '6:00 PM' },
        { value: '19:00', label: '7:00 PM' },
        { value: '20:00', label: '8:00 PM' },
        { value: '21:00', label: '9:00 PM' },
        { value: '22:00', label: '10:00 PM' },
      ]
    }
  ];
};
