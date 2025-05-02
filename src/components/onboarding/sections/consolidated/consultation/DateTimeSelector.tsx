
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  
  // Time state
  const [startHour, setStartHour] = useState<string>('');
  const [startMinute, setStartMinute] = useState<string>('00');
  const [startPeriod, setStartPeriod] = useState<string>('AM');
  
  const [endHour, setEndHour] = useState<string>('');
  const [endMinute, setEndMinute] = useState<string>('00');
  const [endPeriod, setEndPeriod] = useState<string>('AM');
  
  // Validation states
  const [startTimeValid, setStartTimeValid] = useState<boolean | null>(null);
  const [endTimeValid, setEndTimeValid] = useState<boolean | null>(null);
  const [rangeValid, setRangeValid] = useState<boolean | null>(null);

  // Parse and set initial time values if selectedTime exists
  useEffect(() => {
    if (selectedTime && selectedTime.includes('-')) {
      const [startTimeStr, endTimeStr] = selectedTime.split('-');
      
      // Parse start time
      if (startTimeStr) {
        const [hours, minutes] = startTimeStr.split(':').map(Number);
        const isPM = hours >= 12;
        const displayHour = hours % 12 || 12;
        
        setStartHour(displayHour.toString());
        setStartMinute(minutes.toString().padStart(2, '0'));
        setStartPeriod(isPM ? 'PM' : 'AM');
      }
      
      // Parse end time
      if (endTimeStr) {
        const [hours, minutes] = endTimeStr.split(':').map(Number);
        const isPM = hours >= 12;
        const displayHour = hours % 12 || 12;
        
        setEndHour(displayHour.toString());
        setEndMinute(minutes.toString().padStart(2, '0'));
        setEndPeriod(isPM ? 'PM' : 'AM');
      }
    }
  }, []);
  
  // Convert 12-hour time format to 24-hour format
  const convertTo24Hour = (hour: string, minute: string, period: string): string => {
    const hourNum = parseInt(hour, 10);
    if (isNaN(hourNum) || hourNum < 1 || hourNum > 12) return '';
    
    let hour24 = hourNum;
    if (period === 'PM' && hourNum < 12) hour24 += 12;
    if (period === 'AM' && hourNum === 12) hour24 = 0;
    
    return `${hour24.toString().padStart(2, '0')}:${minute}`;
  };

  // Update the selected time when any time component changes
  useEffect(() => {
    if (startHour && startMinute && startPeriod && endHour && endMinute && endPeriod) {
      const start24 = convertTo24Hour(startHour, startMinute, startPeriod);
      const end24 = convertTo24Hour(endHour, endMinute, endPeriod);
      
      const isStartValid = validateTimeInput(start24, startPeriod);
      const isEndValid = validateTimeInput(end24, endPeriod);
      
      setStartTimeValid(isStartValid);
      setEndTimeValid(isEndValid);
      
      if (isStartValid && isEndValid) {
        const isRangeValid = validateTimeRange(start24, end24);
        setRangeValid(isRangeValid);
        
        if (isRangeValid) {
          onTimeChange(`${start24}-${end24}`);
        }
      }
    }
  }, [startHour, startMinute, startPeriod, endHour, endMinute, endPeriod, onTimeChange]);

  // Get readable format for selected date
  const getReadableDateFormat = () => {
    if (!selectedDate) return '';
    return format(selectedDate, 'EEEE, MMMM d, yyyy');
  };

  // Validate time format and operating hours (7AM to 9PM)
  const validateTimeInput = (time24: string, period: string): boolean => {
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
  const validateTimeRange = (start24: string, end24: string): boolean => {
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
  const validateHourInput = (value: string): boolean => {
    const hour = parseInt(value, 10);
    return !isNaN(hour) && hour >= 1 && hour <= 12;
  };

  const validateMinuteInput = (value: string): boolean => {
    const minute = parseInt(value, 10);
    return !isNaN(minute) && minute >= 0 && minute <= 59;
  };

  // Handle time input changes
  const handleStartHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || validateHourInput(value)) {
      setStartHour(value);
    }
  };

  const handleStartMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || validateMinuteInput(value)) {
      setStartMinute(value.padStart(2, '0'));
    }
  };

  const handleEndHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || validateHourInput(value)) {
      setEndHour(value);
    }
  };

  const handleEndMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || validateMinuteInput(value)) {
      setEndMinute(value.padStart(2, '0'));
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
        
        {/* Time Selection */}
        <div>
          <h4 className="font-medium mb-2">Consultation Time (7AM-9PM)</h4>
          <p className="text-sm text-gray-500 mb-3">
            Select your preferred consultation time. Maximum duration is 4 hours.
          </p>
          
          {/* Start Time */}
          <div className="mb-4">
            <Label htmlFor="startTime" className="mb-2 block">Start Time</Label>
            <div className="grid grid-cols-5 gap-2">
              {/* Hour Input */}
              <div className="col-span-1">
                <Label htmlFor="startHour" className="sr-only">Hour</Label>
                <Input
                  id="startHour"
                  type="text"
                  placeholder="Hour"
                  maxLength={2}
                  value={startHour}
                  onChange={handleStartHourChange}
                  className={cn("text-center", getBorderColor(startTimeValid))}
                />
              </div>
              
              <div className="col-span-1 flex items-center justify-center">
                <span className="text-gray-600">:</span>
              </div>
              
              {/* Minute Input */}
              <div className="col-span-1">
                <Label htmlFor="startMinute" className="sr-only">Minute</Label>
                <Input
                  id="startMinute"
                  type="text"
                  placeholder="Min"
                  maxLength={2}
                  value={startMinute}
                  onChange={handleStartMinuteChange}
                  className={cn("text-center", getBorderColor(startTimeValid))}
                />
              </div>
              
              {/* AM/PM Selector */}
              <div className="col-span-2">
                <Select 
                  value={startPeriod} 
                  onValueChange={setStartPeriod}
                >
                  <SelectTrigger className={getBorderColor(startTimeValid)}>
                    <SelectValue placeholder="AM/PM" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AM">AM</SelectItem>
                    <SelectItem value="PM">PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          {/* End Time */}
          <div className="mb-4">
            <Label htmlFor="endTime" className="mb-2 block">End Time</Label>
            <div className="grid grid-cols-5 gap-2">
              {/* Hour Input */}
              <div className="col-span-1">
                <Label htmlFor="endHour" className="sr-only">Hour</Label>
                <Input
                  id="endHour"
                  type="text"
                  placeholder="Hour"
                  maxLength={2}
                  value={endHour}
                  onChange={handleEndHourChange}
                  className={cn("text-center", getBorderColor(endTimeValid))}
                />
              </div>
              
              <div className="col-span-1 flex items-center justify-center">
                <span className="text-gray-600">:</span>
              </div>
              
              {/* Minute Input */}
              <div className="col-span-1">
                <Label htmlFor="endMinute" className="sr-only">Minute</Label>
                <Input
                  id="endMinute"
                  type="text"
                  placeholder="Min"
                  maxLength={2}
                  value={endMinute}
                  onChange={handleEndMinuteChange}
                  className={cn("text-center", getBorderColor(endTimeValid))}
                />
              </div>
              
              {/* AM/PM Selector */}
              <div className="col-span-2">
                <Select 
                  value={endPeriod} 
                  onValueChange={setEndPeriod}
                >
                  <SelectTrigger className={getBorderColor(endTimeValid)}>
                    <SelectValue placeholder="AM/PM" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AM">AM</SelectItem>
                    <SelectItem value="PM">PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          {/* Time validation messages */}
          {startTimeValid === false && (
            <p className="text-xs text-red-500 mt-1">
              Please enter a valid start time between 7:00 AM and 9:00 PM
            </p>
          )}
          
          {endTimeValid === false && (
            <p className="text-xs text-red-500 mt-1">
              Please enter a valid end time between 7:00 AM and 9:00 PM
            </p>
          )}
          
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
