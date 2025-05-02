
import React, { useState, useEffect } from 'react';
import { CalendarIcon, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  
  // Available times for scheduling, organized by time periods
  const availableTimes = [
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

  // Get readable format for selected date
  const getReadableDateFormat = () => {
    if (!selectedDate) return '';
    return format(selectedDate, 'EEEE, MMMM d, yyyy');
  };

  // Handle start time change and validate time range
  const handleStartTimeChange = (startTime: string) => {
    let newEndTime = selectedEndTime;
    
    // Check if current end time would exceed 3 hour limit
    if (selectedEndTime) {
      const startMinutes = getTimeInMinutes(startTime);
      const endMinutes = getTimeInMinutes(selectedEndTime);
      
      if (endMinutes - startMinutes > 180) {
        // Find a valid end time within 3 hours
        const maxEndTimeMinutes = startMinutes + 180;
        const endTimeOption = availableTimes.find(time => 
          getTimeInMinutes(time.value) <= maxEndTimeMinutes && 
          getTimeInMinutes(time.value) > startMinutes
        );
        
        newEndTime = endTimeOption ? endTimeOption.value : '';
      } else if (endMinutes <= startMinutes) {
        // Find a new end time that's after the start time
        const endTimeOption = availableTimes.find(time => 
          getTimeInMinutes(time.value) > startMinutes &&
          getTimeInMinutes(time.value) <= startMinutes + 180
        );
        
        newEndTime = endTimeOption ? endTimeOption.value : '';
      }
    }
    
    onTimeRangeChange(startTime, newEndTime);
    validateTimeRange(startTime, newEndTime);
  };

  // Handle end time change and validate
  const handleEndTimeChange = (endTime: string) => {
    onTimeRangeChange(selectedStartTime, endTime);
    validateTimeRange(selectedStartTime, endTime);
  };

  // Convert time string (HH:MM) to minutes for easier comparison
  const getTimeInMinutes = (timeString: string): number => {
    if (!timeString) return 0;
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // Validate the time range is within 3 hours
  const validateTimeRange = (startTime: string, endTime: string) => {
    if (!startTime || !endTime) {
      setTimeError(null);
      return;
    }

    const startMinutes = getTimeInMinutes(startTime);
    const endMinutes = getTimeInMinutes(endTime);
    
    if (endMinutes <= startMinutes) {
      setTimeError('End time must be after start time');
      return;
    }
    
    const durationMinutes = endMinutes - startMinutes;
    
    if (durationMinutes > 180) {
      setTimeError('Consultation duration must be 3 hours or less');
    } else {
      setTimeError(null);
    }
  };

  // Filter available end times based on selected start time
  const getAvailableEndTimes = () => {
    if (!selectedStartTime) return [];
    
    const startMinutes = getTimeInMinutes(selectedStartTime);
    return availableTimes.filter(time => {
      const minutes = getTimeInMinutes(time.value);
      return minutes > startMinutes && minutes <= startMinutes + 180;
    });
  };

  // Find a valid end time when start time changes
  useEffect(() => {
    if (selectedStartTime && !selectedEndTime) {
      const availableEndTimes = getAvailableEndTimes();
      if (availableEndTimes.length > 0) {
        // Default to 1 hour consultation
        const oneHourLaterOption = availableTimes.find(time => 
          getTimeInMinutes(time.value) === getTimeInMinutes(selectedStartTime) + 60
        );
        
        onTimeRangeChange(
          selectedStartTime, 
          oneHourLaterOption ? oneHourLaterOption.value : availableEndTimes[0].value
        );
      }
    }
  }, [selectedStartTime]);

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
              {/* Start Time Selector */}
              <div className="flex-1">
                <label className="text-sm font-medium mb-1 block">Start Time</label>
                <Select value={selectedStartTime} onValueChange={handleStartTimeChange}>
                  <SelectTrigger className="w-full">
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Select start time" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {availableTimes.map(time => (
                      <SelectItem key={`start-${time.value}`} value={time.value}>
                        {time.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* End Time Selector */}
              <div className="flex-1">
                <label className="text-sm font-medium mb-1 block">End Time</label>
                <Select 
                  value={selectedEndTime} 
                  onValueChange={handleEndTimeChange}
                  disabled={!selectedStartTime}
                >
                  <SelectTrigger className="w-full">
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Select end time" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableEndTimes().map(time => (
                      <SelectItem key={`end-${time.value}`} value={time.value}>
                        {time.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {timeError && (
              <Alert variant="destructive">
                <AlertDescription>{timeError}</AlertDescription>
              </Alert>
            )}
            
            {selectedStartTime && selectedEndTime && !timeError && (
              <p className="text-sm text-gray-500">
                Consultation duration: {Math.floor((getTimeInMinutes(selectedEndTime) - getTimeInMinutes(selectedStartTime)) / 60)} hours
                {(getTimeInMinutes(selectedEndTime) - getTimeInMinutes(selectedStartTime)) % 60 > 0 ? 
                  ` ${(getTimeInMinutes(selectedEndTime) - getTimeInMinutes(selectedStartTime)) % 60} minutes` : ''}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DateTimeSelector;
