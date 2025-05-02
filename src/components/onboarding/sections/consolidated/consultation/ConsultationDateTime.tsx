
import React from 'react';
import DateTimeSelector from './DateTimeSelector';

interface ConsultationDateTimeProps {
  selectedDate: Date | undefined;
  selectedTime: string;
  onDateChange: (date: Date | undefined) => void;
  onTimeChange: (time: string) => void;
}

const ConsultationDateTime: React.FC<ConsultationDateTimeProps> = ({
  selectedDate,
  selectedTime,
  onDateChange,
  onTimeChange
}) => {
  return (
    <DateTimeSelector
      selectedDate={selectedDate}
      selectedTime={selectedTime}
      onDateChange={onDateChange}
      onTimeChange={onTimeChange}
    />
  );
};

export default ConsultationDateTime;
