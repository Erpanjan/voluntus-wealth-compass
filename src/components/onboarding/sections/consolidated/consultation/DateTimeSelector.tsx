
import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import DateSelector from './date-time/DateSelector';
import TimeInput from './date-time/TimeInput';
import ValidationMessages from './date-time/ValidationMessages';
import { 
  convertTo24Hour,
  validateTimeInput, 
  validateTimeRange,
  validateHourInput,
  validateMinuteInput
} from './date-time/timeUtils';

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

  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Select Date & Time</h3>
      <p className="text-sm text-gray-500 mb-4">
        Choose a convenient date and time for your consultation.
      </p>
      
      <div className="flex flex-col gap-4">
        {/* Date Selector Component */}
        <DateSelector
          selectedDate={selectedDate}
          onDateChange={onDateChange}
        />
        
        {/* Time Selection */}
        <div>
          <h4 className="font-medium mb-2">Consultation Time (7AM-9PM)</h4>
          <p className="text-sm text-gray-500 mb-3">
            Select your preferred consultation time. Maximum duration is 4 hours.
          </p>
          
          {/* Start Time Input Component */}
          <TimeInput 
            id="startTime"
            label="Start Time"
            hourValue={startHour}
            minuteValue={startMinute}
            periodValue={startPeriod}
            onHourChange={handleStartHourChange}
            onMinuteChange={handleStartMinuteChange}
            onPeriodChange={setStartPeriod}
            isValid={startTimeValid}
          />
          
          {/* End Time Input Component */}
          <TimeInput 
            id="endTime"
            label="End Time"
            hourValue={endHour}
            minuteValue={endMinute}
            periodValue={endPeriod}
            onHourChange={handleEndHourChange}
            onMinuteChange={handleEndMinuteChange}
            onPeriodChange={setEndPeriod}
            isValid={endTimeValid}
          />
          
          {/* Validation Messages Component */}
          <ValidationMessages 
            startTimeValid={startTimeValid}
            endTimeValid={endTimeValid}
            rangeValid={rangeValid}
          />
        </div>
      </div>
    </div>
  );
};

export default DateTimeSelector;
