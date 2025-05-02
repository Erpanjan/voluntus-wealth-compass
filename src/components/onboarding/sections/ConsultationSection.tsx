
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import Section from '@/components/ui/Section';
import { useToast } from '@/hooks/use-toast';
import ConsultationTypeSelector from './consultation/ConsultationTypeSelector';
import ConsultationDateTimeSelector from './consultation/ConsultationDateTimeSelector';
import ConsultationConfirmationDialog from './consultation/ConsultationConfirmationDialog';

interface ConsultationSectionProps {
  consultationData: {
    completed: boolean;
    type: string;
    date: string;
    time: string;
  };
  updateConsultationData: (data: Partial<ConsultationSectionProps['consultationData']>) => void;
  navigateToNext: () => void;
  navigateToPrev: () => void;
  handleSaveDraft: () => void;
}

const ConsultationSection: React.FC<ConsultationSectionProps> = ({
  consultationData,
  updateConsultationData,
  navigateToNext,
  navigateToPrev,
  handleSaveDraft
}) => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Available dates and times for scheduling (needed for label lookup)
  const availableDates = [
    { id: 'date-1', value: '2025-05-05', label: 'Monday, May 5' },
    { id: 'date-2', value: '2025-05-06', label: 'Tuesday, May 6' },
    { id: 'date-3', value: '2025-05-07', label: 'Wednesday, May 7' },
    { id: 'date-4', value: '2025-05-08', label: 'Thursday, May 8' },
    { id: 'date-5', value: '2025-05-09', label: 'Friday, May 9' }
  ];

  const availableTimes = [
    { id: 'time-1', value: '09:00', label: '9:00 AM' },
    { id: 'time-2', value: '10:00', label: '10:00 AM' },
    { id: 'time-3', value: '11:00', label: '11:00 AM' },
    { id: 'time-4', value: '14:00', label: '2:00 PM' },
    { id: 'time-5', value: '15:00', label: '3:00 PM' },
    { id: 'time-6', value: '16:00', label: '4:00 PM' },
  ];

  const handleSchedule = () => {
    if (!consultationData.type || !consultationData.date || !consultationData.time) {
      toast({
        title: "Incomplete Selection",
        description: "Please select consultation type, date and time.",
        variant: "destructive"
      });
      return;
    }

    setIsDialogOpen(true);
  };

  const confirmSchedule = () => {
    updateConsultationData({ completed: true });
    
    toast({
      title: "Consultation Scheduled",
      description: `Your ${consultationData.type} consultation has been scheduled for ${getDateLabel()} at ${getTimeLabel()}.`,
    });
    
    setIsDialogOpen(false);
    navigateToNext();
  };

  const getDateLabel = () => {
    const date = availableDates.find(d => d.value === consultationData.date);
    return date?.label || consultationData.date;
  };

  const getTimeLabel = () => {
    const time = availableTimes.find(t => t.value === consultationData.time);
    return time?.label || consultationData.time;
  };

  return (
    <Section
      title="Schedule a Consultation"
      subtitle="Meet with one of our advisors to discuss your financial goals and investment strategy. This step is required to activate your account."
    >
      <div className="w-full max-w-2xl mx-auto">
        <div className="space-y-8">
          {/* Consultation Type Selection */}
          <ConsultationTypeSelector
            selectedType={consultationData.type}
            onTypeChange={(value) => updateConsultationData({ type: value })}
          />

          {/* Date and Time Selection */}
          {consultationData.type && (
            <ConsultationDateTimeSelector
              selectedDate={consultationData.date}
              selectedTime={consultationData.time}
              onDateChange={(date) => updateConsultationData({ date })}
              onTimeChange={(time) => updateConsultationData({ time })}
            />
          )}
        </div>
        
        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={navigateToPrev}>
            Back
          </Button>
          <Button variant="outline" onClick={handleSaveDraft}>
            Save Draft
          </Button>
          <Button onClick={handleSchedule}>
            Schedule Consultation
          </Button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConsultationConfirmationDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        consultationType={consultationData.type}
        dateLabel={getDateLabel()}
        timeLabel={getTimeLabel()}
        onConfirm={confirmSchedule}
      />
    </Section>
  );
};

export default ConsultationSection;
