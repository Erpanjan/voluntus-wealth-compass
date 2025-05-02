
import React, { useState } from 'react';
import ConsultationTypeSelector from './consultation/ConsultationTypeSelector';
import DateTimeSelector from './consultation/DateTimeSelector';
import { getReadableDateFormat } from './consultation/utils';

interface ConsultationFormSectionProps {
  consultationData: {
    completed: boolean;
    type: string;
    date: string;
    time: string;
  };
  updateConsultationData: (data: Partial<ConsultationFormSectionProps['consultationData']>) => void;
}

const ConsultationFormSection: React.FC<ConsultationFormSectionProps> = ({
  consultationData,
  updateConsultationData
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    consultationData.date ? new Date(consultationData.date) : undefined
  );
  
  // Handle consultation type selection
  const handleTypeSelection = (type: string) => {
    updateConsultationData({ type });
  };

  // Handle date selection from calendar
  const handleDateSelection = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      updateConsultationData({ date: date.toISOString().split('T')[0] });
    }
  };

  // Handle time selection
  const handleTimeSelection = (time: string) => {
    updateConsultationData({ time });
    
    // Auto-complete the consultation when type, date, and time are all selected
    if (consultationData.type && selectedDate && time) {
      updateConsultationData({ completed: true });
    }
  };

  return (
    <div className="space-y-8">
      {/* Consultation Type Selection */}
      <ConsultationTypeSelector 
        selectedType={consultationData.type}
        onTypeChange={handleTypeSelection}
      />

      {/* Date and Time Selection */}
      {consultationData.type && (
        <DateTimeSelector
          selectedDate={selectedDate}
          selectedTime={consultationData.time}
          onDateChange={handleDateSelection}
          onTimeChange={handleTimeSelection}
        />
      )}
    </div>
  );
};

export default ConsultationFormSection;
