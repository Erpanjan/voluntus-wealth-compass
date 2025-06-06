
import React, { useState, useEffect } from 'react';
import ConsultationType from './consultation/ConsultationType';
import ConsultationDateTime from './consultation/ConsultationDateTime';

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
  };

  // Check if time format is valid (HH:MM-HH:MM)
  const isTimeValid = (time: string): boolean => {
    if (!time) return false;
    
    // Check if it contains the hyphen separator
    if (!time.includes('-')) return false;
    
    const [startTime, endTime] = time.split('-');
    
    // Basic format validation (not comprehensive)
    const timeFormat = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeFormat.test(startTime) && timeFormat.test(endTime);
  };

  // Effect to update completion status when all fields are filled
  useEffect(() => {
    if (consultationData.type && selectedDate && isTimeValid(consultationData.time)) {
      updateConsultationData({ completed: true });
    } else {
      updateConsultationData({ completed: false });
    }
  }, [consultationData.type, selectedDate, consultationData.time]);

  return (
    <div className="space-y-8">
      {/* Consultation Type Selection */}
      <ConsultationType 
        selectedType={consultationData.type}
        onTypeChange={handleTypeSelection}
      />

      {/* Date and Time Selection - Always visible when a type is selected */}
      {consultationData.type && (
        <ConsultationDateTime
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
