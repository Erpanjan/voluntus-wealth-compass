
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import ConsultationTypeSelector from './consultation/ConsultationTypeSelector';
import DateTimeSelector from './consultation/DateTimeSelector';
import { useIsMobile } from '@/hooks/use-mobile';

interface ConsultationFormSectionProps {
  consultationData: {
    completed: boolean;
    type: string;
    date: string;
    startTime: string;
    endTime: string;
  };
  updateConsultationData: (data: Partial<ConsultationFormSectionProps['consultationData']>) => void;
}

const ConsultationFormSection: React.FC<ConsultationFormSectionProps> = ({
  consultationData,
  updateConsultationData
}) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
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

  // Handle time range selection
  const handleTimeRangeSelection = (startTime: string, endTime: string) => {
    updateConsultationData({ 
      startTime, 
      endTime 
    });
    
    // Auto-complete the consultation when all fields are selected
    if (consultationData.type && selectedDate && startTime && endTime) {
      updateConsultationData({ completed: true });
    }
  };

  return (
    <div className={`space-y-${isMobile ? '6' : '8'}`}>
      {/* Consultation Type Selection */}
      <ConsultationTypeSelector 
        selectedType={consultationData.type}
        onTypeChange={handleTypeSelection}
      />

      {/* Date and Time Selection */}
      {consultationData.type && (
        <DateTimeSelector
          selectedDate={selectedDate}
          selectedStartTime={consultationData.startTime}
          selectedEndTime={consultationData.endTime}
          onDateChange={handleDateSelection}
          onTimeRangeChange={handleTimeRangeSelection}
        />
      )}
    </div>
  );
};

export default ConsultationFormSection;
