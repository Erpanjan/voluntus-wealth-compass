
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

  // Update the selected time when start or end time changes
  useEffect(() => {
    if (startTime && endTime) {
      // Format is HH:MM-HH:MM
      onTimeChange(`${startTime}-${endTime}`);
    }
  }, [startTime, endTime, onTimeChange]);

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
  const validateTimeRange = () => {
    if (!startTime || !endTime) return true;

    // Parse times
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);

    // Calculate minutes since midnight
    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;

    // Check if end time is after start time
    if (endTotalMinutes <= startTotalMinutes) {
      toast({
        title: "Invalid Time Range",
        description: "End time must be after start time",
        variant: "destructive"
      });
      return false;
    }

    // Calculate duration in minutes
    const durationMinutes = endTotalMinutes - startTotalMinutes;

    // Check if duration is within 4 hours (240 minutes)
    if (durationMinutes > 240) {
      toast({
        title: "Time Range Too Long",
        description: "Consultation cannot be longer than 4 hours",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  // Handle start time change
  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    if (newTime === '' || validateTimeInput(newTime)) {
      setStartTime(newTime);
      if (endTime && newTime && !validateTimeRange()) {
        setEndTime('');
      }
    }
  };

  // Handle end time change
  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    if (newTime === '' || validateTimeInput(newTime)) {
      setEndTime(newTime);
      if (startTime && newTime && !validateTimeRange()) {
        setEndTime('');
      }
    }
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Select Date & Time</h3>
      <p className="text-sm text-gray-500 mb-4">
        Choose a convenient date and time for your consultation.
      </p>
      
      <div className="flex flex-col gap-4">
        {/* Date Selector */}
        <div>
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
        
        {/* Time Selection */}
        {selectedDate && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="startTime" className="mb-2 block">Start Time (7AM-9PM)</Label>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-gray-500" />
                <Input
                  id="startTime"
                  type="text"
                  placeholder="HH:MM (e.g. 09:00)"
                  value={startTime}
                  onChange={handleStartTimeChange}
                  className="w-full"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Enter time in 24-hour format (e.g. 14:00 for 2PM)</p>
            </div>

            <div>
              <Label htmlFor="endTime" className="mb-2 block">End Time (7AM-9PM)</Label>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-gray-500" />
                <Input
                  id="endTime"
                  type="text"
                  placeholder="HH:MM (e.g. 10:30)"
                  value={endTime}
                  onChange={handleEndTimeChange}
                  className="w-full"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Maximum consultation duration is 4 hours</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DateTimeSelector;
