
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import ConsultationTypeSelector from './consultation/ConsultationTypeSelector';
import DateTimeSelector from './consultation/DateTimeSelector';
import ConsultationConfirmation from './consultation/ConsultationConfirmation';
import { getReadableDateFormat, getReadableTimeFormat, getAvailableTimes } from './consultation/utils';

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
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    consultationData.date ? new Date(consultationData.date) : undefined
  );
  
  // Available times for scheduling reference
  const availableTimes = getAvailableTimes();

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

  // Confirm consultation booking
  const confirmConsultation = () => {
    if (!consultationData.type || !consultationData.date || !consultationData.time) {
      toast({
        title: "Incomplete Selection",
        description: "Please select consultation type, date and time.",
        variant: "destructive"
      });
      return;
    }

    updateConsultationData({ completed: true });
    
    toast({
      title: "Consultation Scheduled",
      description: `Your ${consultationData.type === 'virtual' ? 'Virtual Meeting' : 'In-Person Meeting'} consultation has been scheduled for ${getReadableDateFormat(selectedDate)} at ${getReadableTimeFormat(consultationData.time, availableTimes)}.`,
    });
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

      {/* Confirm Button */}
      {consultationData.type && consultationData.date && consultationData.time && !consultationData.completed && (
        <div className="pt-4">
          <Button onClick={confirmConsultation} className="ml-auto block">
            Confirm Consultation
          </Button>
        </div>
      )}

      {/* Confirmation Display */}
      {consultationData.completed && (
        <ConsultationConfirmation
          consultationType={consultationData.type}
          dateText={getReadableDateFormat(selectedDate)}
          timeText={getReadableTimeFormat(consultationData.time, availableTimes)}
        />
      )}
    </div>
  );
};

export default ConsultationFormSection;
