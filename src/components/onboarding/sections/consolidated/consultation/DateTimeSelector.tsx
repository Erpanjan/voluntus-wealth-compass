
import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import CalendarSelector from './CalendarSelector';
import TimeInput from './TimeInput';
import { useTimeValidation } from '@/hooks/useTimeValidation';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  const [startTime, setStartTime] = useState(selectedStartTime);
  const [endTime, setEndTime] = useState(selectedEndTime);
  
  const {
    timeError,
    validateAndUpdateTimes,
    getReadableTimeFormat,
    getDurationText,
    timeRegex
  } = useTimeValidation(selectedStartTime, selectedEndTime, onTimeRangeChange);

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

  // Initialize form with existing values
  useEffect(() => {
    setStartTime(selectedStartTime);
  }, [selectedStartTime]);
  
  useEffect(() => {
    setEndTime(selectedEndTime);
  }, [selectedEndTime]);

  return (
    <div>
      <h3 className={`${isMobile ? 'text-xl' : 'text-lg'} font-medium mb-2`}>Select Date & Time</h3>
      <p className="text-sm text-gray-500 mb-4">
        Choose a convenient date and time for your consultation.
      </p>
      
      <div className="space-y-6">
        {/* Date Selector */}
        <CalendarSelector 
          selectedDate={selectedDate} 
          onDateChange={onDateChange} 
        />
        
        {selectedDate && (
          <div className="space-y-4">
            <div className={`flex flex-col ${!isMobile ? 'sm:flex-row' : ''} gap-4`}>
              {/* Start Time Input */}
              <TimeInput
                label="Start Time"
                value={startTime}
                onChange={handleStartTimeChange}
                readableFormat={startTime && timeRegex.test(startTime) ? getReadableTimeFormat(startTime) : undefined}
              />
              
              {/* End Time Input */}
              <TimeInput
                label="End Time"
                value={endTime}
                onChange={handleEndTimeChange}
                readableFormat={endTime && timeRegex.test(endTime) ? getReadableTimeFormat(endTime) : undefined}
              />
            </div>
            
            {timeError && (
              <Alert variant="warning" className={`${isMobile ? 'p-3' : ''}`}>
                <AlertDescription className={`${isMobile ? 'text-sm' : ''}`}>{timeError}</AlertDescription>
              </Alert>
            )}
            
            {!timeError && timeRegex.test(startTime) && timeRegex.test(endTime) && (
              <p className={`${isMobile ? 'text-base' : 'text-sm'} text-gray-500`}>
                Consultation duration: {getDurationText(startTime, endTime)}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DateTimeSelector;
