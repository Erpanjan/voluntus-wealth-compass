
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import ConsultationTypeSelector from './sections/scheduling/ConsultationTypeSelector';
import DateTimeSelector from './sections/scheduling/DateTimeSelector';
import ConsultationConfirmationDialog from './sections/scheduling/ConsultationConfirmationDialog';
import { getAvailableDates, getAvailableTimes, getDateLabel, getTimeLabel } from './sections/scheduling/utils';
import { Check } from 'lucide-react';

interface ConsultationSchedulingProps {
  setCompleted: (completed: boolean) => void;
}

const ConsultationScheduling = ({ setCompleted }: ConsultationSchedulingProps) => {
  const { toast } = useToast();
  const [consultationType, setConsultationType] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Get data for available dates and times
  const availableDates = getAvailableDates();
  const availableTimes = getAvailableTimes();

  const handleSchedule = () => {
    if (!consultationType || !selectedDate || !selectedTime) {
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
    toast({
      title: "Consultation Scheduled",
      description: `Your ${consultationType} consultation has been scheduled for ${getDateLabel(selectedDate, availableDates)} at ${getTimeLabel(selectedTime, availableTimes)}.`,
    });
    setCompleted(true);
    setIsDialogOpen(false);
  };

  // Display confirmation after scheduling is complete
  const renderConfirmation = () => {
    if (!setCompleted) return null;
    
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
        <div className="flex items-center">
          <div className="bg-green-500 rounded-full p-1 mr-3">
            <Check className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="font-medium">Consultation Scheduled</p>
            <p className="text-sm text-gray-600">
              {consultationType === 'virtual' ? 'Virtual Meeting' : 'In-Person Meeting'} on {getDateLabel(selectedDate, availableDates)} at {getTimeLabel(selectedTime, availableTimes)}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Schedule a Consultation</h1>
      <p className="text-lg mb-8">
        Meet with one of our advisors to discuss your financial goals and investment strategy. This step is required to activate your account.
      </p>

      <div className="space-y-8">
        {/* Consultation Type Selection */}
        <ConsultationTypeSelector
          consultationType={consultationType}
          setConsultationType={setConsultationType}
        />

        {/* Date and Time Selection */}
        {consultationType && (
          <DateTimeSelector
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            setSelectedDate={setSelectedDate}
            setSelectedTime={setSelectedTime}
            availableDates={availableDates}
            availableTimes={availableTimes}
          />
        )}

        <Button onClick={handleSchedule} className="w-full md:w-auto">
          Schedule Consultation
        </Button>
      </div>

      {/* Confirmation Dialog */}
      <ConsultationConfirmationDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        consultationType={consultationType}
        dateLabel={getDateLabel(selectedDate, availableDates)}
        timeLabel={getTimeLabel(selectedTime, availableTimes)}
        onConfirm={confirmSchedule}
      />
    </div>
  );
};

export default ConsultationScheduling;
