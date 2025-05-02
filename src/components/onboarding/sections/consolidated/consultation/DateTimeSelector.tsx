
import React, { useState, useEffect } from 'react';
import { CalendarIcon, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface DateTimeSelectorProps {
  selectedDate: Date | undefined;
  selectedTime: string;
  onDateChange: (date: Date | undefined) => void;
  onTimeChange: (time: string) => void;
}

const DateTimeSelector: React.FC<DateTimeSelectorProps> = ({
  selectedDate,
  selectedTime,
  onDateChange,
  onTimeChange
}) => {
  const { toast } = useToast();
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  
  // States for validation feedback
  const [startTimeValid, setStartTimeValid] = useState<boolean | null>(null);
  const [endTimeValid, setEndTimeValid] = useState<boolean | null>(null);
  const [rangeValid, setRangeValid] = useState<boolean | null>(null);

  // Parse the selected time on component load
  useEffect(() => {
    if (selectedTime && selectedTime.includes('-')) {
      const [start, end] = selectedTime.split('-');
      setStartTime(start);
      setEndTime(end);
    }
  }, []);

  // Update the selected time when start or end time changes
  useEffect(() => {
    if (startTime && endTime) {
      // Only update if both times are valid
      if (startTimeValid && endTimeValid && rangeValid) {
        // Format is HH:MM-HH:MM
        onTimeChange(`${startTime}-${endTime}`);
      }
    }
  }, [startTime, endTime, startTimeValid, endTimeValid, rangeValid, onTimeChange]);

  // Get readable format for selected date
  const getReadableDateFormat = () => {
    if (!selectedDate) return '';
    return format(selectedDate, 'EEEE, MMMM d, yyyy');
  };

  // Validate the time format and range
  const validateTimeInput = (time: string): boolean => {
    // Check format (HH:MM in 24-hour format)
    if (!/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
      return false;
    }

    // Convert to minutes since midnight for easier comparison
    const [hours, minutes] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;

    // Check if within operating hours (7AM to 9PM)
    const minTime = 7 * 60; // 7:00 AM in minutes
    const maxTime = 21 * 60; // 9:00 PM in minutes

    return totalMinutes >= minTime && totalMinutes <= maxTime;
  };

  // Check the time difference constraint (max 4 hours)
  const validateTimeRange = (): boolean => {
    if (!startTime || !endTime) return false;

    // Parse times
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);

    // Calculate minutes since midnight
    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;

    // Check if end time is after start time
    if (endTotalMinutes <= startTotalMinutes) {
      return false;
    }

    // Calculate duration in minutes
    const durationMinutes = endTotalMinutes - startTotalMinutes;

    // Check if duration is within 4 hours (240 minutes)
    return durationMinutes <= 240;
  };

  // Handle start time change with inline validation
  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setStartTime(newTime);
    
    // Validate the time format and range
    if (newTime === '') {
      setStartTimeValid(null);
    } else {
      const isValid = validateTimeInput(newTime);
      setStartTimeValid(isValid);
    }
    
    // Update range validation if both times are present
    if (newTime && endTime && validateTimeInput(newTime) && endTimeValid) {
      setRangeValid(validateTimeRange());
    } else {
      setRangeValid(null);
    }
  };

  // Handle end time change with inline validation
  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setEndTime(newTime);
    
    // Validate the time format and range
    if (newTime === '') {
      setEndTimeValid(null);
    } else {
      const isValid = validateTimeInput(newTime);
      setEndTimeValid(isValid);
    }
    
    // Update range validation if both times are present
    if (startTime && newTime && startTimeValid && validateTimeInput(newTime)) {
      setRangeValid(validateTimeRange());
    } else {
      setRangeValid(null);
    }
  };

  // Get border color based on validation state
  const getBorderColor = (isValid: boolean | null) => {
    if (isValid === null) return '';
    return isValid ? 'border-green-500' : 'border-red-500';
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Select Date & Time</h3>
      <p className="text-sm text-gray-500 mb-4">
        Choose a convenient date and time for your consultation.
      </p>
      
      <div className="flex flex-col gap-4">
        {/* Date Selector */}
        <div className="mb-4">
          <Label className="mb-2 block">Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? getReadableDateFormat() : <span>Select a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={onDateChange}
                disabled={(date) => date < new Date()}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
        
        {/* Time Selection - Always visible */}
        <div className="space-y-4">
          <h4 className="font-medium">Consultation Time (7AM-9PM)</h4>
          <p className="text-sm text-gray-500 mb-3">
            Enter times in 24-hour format (e.g., 09:00 for 9AM, 14:30 for 2:30PM)
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startTime" className="mb-2 block">Start Time</Label>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-gray-500" />
                <Input
                  id="startTime"
                  type="text"
                  placeholder="HH:MM (e.g. 09:00)"
                  value={startTime}
                  onChange={handleStartTimeChange}
                  className={cn("w-full", getBorderColor(startTimeValid))}
                />
              </div>
              {startTimeValid === false && (
                <p className="text-xs text-red-500 mt-1">
                  Please enter a valid time between 7:00 and 21:00 in format HH:MM
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="endTime" className="mb-2 block">End Time</Label>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-gray-500" />
                <Input
                  id="endTime"
                  type="text"
                  placeholder="HH:MM (e.g. 10:30)"
                  value={endTime}
                  onChange={handleEndTimeChange}
                  className={cn("w-full", getBorderColor(endTimeValid))}
                />
              </div>
              {endTimeValid === false && (
                <p className="text-xs text-red-500 mt-1">
                  Please enter a valid time between 7:00 and 21:00 in format HH:MM
                </p>
              )}
            </div>
          </div>
          
          {/* Time range validation message */}
          {startTimeValid && endTimeValid && rangeValid === false && (
            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">
                Invalid time range. Make sure the end time is after the start time and the duration is not longer than 4 hours.
              </p>
            </div>
          )}
          
          {startTimeValid && endTimeValid && rangeValid === true && (
            <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-600">
                Valid time range selected!
              </p>
            </div>
          )}
          
          <p className="text-xs text-gray-500 mt-2">
            Note: Maximum consultation duration is 4 hours. Operating hours are from 7:00 AM to 9:00 PM.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DateTimeSelector;
