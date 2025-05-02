
// Data for available dates and times
export const getAvailableDates = () => [
  { id: 'date-1', value: '2025-05-05', label: 'Monday, May 5' },
  { id: 'date-2', value: '2025-05-06', label: 'Tuesday, May 6' },
  { id: 'date-3', value: '2025-05-07', label: 'Wednesday, May 7' },
  { id: 'date-4', value: '2025-05-08', label: 'Thursday, May 8' },
  { id: 'date-5', value: '2025-05-09', label: 'Friday, May 9' }
];

export const getAvailableTimes = () => [
  { id: 'time-1', value: '09:00', label: '9:00 AM' },
  { id: 'time-2', value: '10:00', label: '10:00 AM' },
  { id: 'time-3', value: '11:00', label: '11:00 AM' },
  { id: 'time-4', value: '14:00', label: '2:00 PM' },
  { id: 'time-5', value: '15:00', label: '3:00 PM' },
  { id: 'time-6', value: '16:00', label: '4:00 PM' },
];

// Helper functions to get display labels for dates and times
export const getDateLabel = (selectedDate: string, availableDates: Array<{ value: string; label: string }>) => {
  const date = availableDates.find(d => d.value === selectedDate);
  return date?.label || selectedDate;
};

export const getTimeLabel = (selectedTime: string, availableTimes: Array<{ value: string; label: string }>) => {
  const time = availableTimes.find(t => t.value === selectedTime);
  return time?.label || selectedTime;
};
