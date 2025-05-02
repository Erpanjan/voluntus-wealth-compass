
import React, { useState, useEffect } from 'react';
import { CalendarIcon, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

interface DateTimeSelectorProps {
  selectedDate: Date | undefined;
  selectedStartTime: string;
  selectedEndTime: string;
  onDateChange: (date: Date | undefined) => void;
  onTimeRangeChange: (startTime: string, endTime: string) => void;
}

const DateTimeSelector: React.FC<DateTimeSelectorProps> = ({
  selectedDate,
  selectedStartTime,
  selectedEndTime,
  onDateChange,
  onTimeRangeChange
}) => {
  const { toast } = useToast();
  const [timeError, setTimeError] = useState<string | null>(null);
  const [startTime, setStartTime] = useState(selectedStartTime);
  const [endTime, setEndTime] = useState(selectedEndTime);
  
  // Time regex validation for HH:MM in 24h format
  const timeRegex = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;
  
  // Operating hours range (7:00 to 22:00)
  const minTimeMinutes = 7 * 60;
  const maxTimeMinutes = 22 * 60;

  // Get readable format for selected date
  const getReadableDateFormat = () => {
    if (!selectedDate) return '';
    return format(selectedDate, 'EEEE, MMMM d, yyyy');
  };

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

  // Handle start time input change
  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setStartTime(value);
    
    if (value && !timeRegex.test(value)) {
      return;
    }
    
    if (timeRegex.test(value)) {
      validateAndUpdateTimes(value, endTime);
    }
  };

  // Handle end time input change
  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEndTime(value);
    
    if (value && !timeRegex.test(value)) {
      return;
    }
    
    if (timeRegex.test(value)) {
      validateAndUpdateTimes(startTime, value);
    }
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

  // Initialize form with existing values
  useEffect(() => {
    setStartTime(selectedStartTime);
  }, [selectedStartTime]);
  
  useEffect(() => {
    setEndTime(selectedEndTime);
  }, [selectedEndTime]);

  // Helper function to get duration text
  const getDurationText = () => {
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

  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Select Date & Time</h3>
      <p className="text-sm text-gray-500 mb-4">
        Choose a convenient date and time for your consultation.
      </p>
      
      <div className="space-y-6">
        {/* Date Selector */}
        <div>
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
        
        {selectedDate && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Start Time Input */}
              <div className="flex-1">
                <label className="text-sm font-medium mb-1 block">Start Time (24h format)</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    value={startTime}
                    onChange={handleStartTimeChange}
                    className="pl-10"
                    placeholder="HH:MM (e.g. 09:00)"
                  />
                </div>
                {startTime && timeRegex.test(startTime) && (
                  <p className="text-xs text-gray-500 mt-1">{getReadableTimeFormat(startTime)}</p>
                )}
              </div>
              
              {/* End Time Input */}
              <div className="flex-1">
                <label className="text-sm font-medium mb-1 block">End Time (24h format)</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    value={endTime}
                    onChange={handleEndTimeChange}
                    className="pl-10"
                    placeholder="HH:MM (e.g. 10:00)"
                  />
                </div>
                {endTime && timeRegex.test(endTime) && (
                  <p className="text-xs text-gray-500 mt-1">{getReadableTimeFormat(endTime)}</p>
                )}
              </div>
            </div>
            
            {timeError && (
              <Alert variant="warning">
                <AlertDescription>{timeError}</AlertDescription>
              </Alert>
            )}
            
            {!timeError && timeRegex.test(startTime) && timeRegex.test(endTime) && 
             getTimeInMinutes(endTime) > getTimeInMinutes(startTime) && (
              <p className="text-sm text-gray-500">
                Consultation duration: {getDurationText()}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DateTimeSelector;
