
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

  // Available consultation types
  const consultationTypes = [
    { id: 'virtual', label: 'Virtual Meeting', description: 'Schedule a video call with one of our advisors. Discuss your financial goals from the comfort of your home.' },
    { id: 'in-person', label: 'In-Person Meeting', description: 'Visit our office for a face-to-face consultation with our financial experts.' }
  ];

  // Available dates and times for scheduling
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

  const handleTypeSelection = (type: string) => {
    updateConsultationData({ type });
  };

  const handleDateSelection = (date: string) => {
    updateConsultationData({ date });
  };

  const handleTimeSelection = (time: string) => {
    updateConsultationData({ time });
  };

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
    
    // Get the label versions for the toast
    const dateLabel = availableDates.find(d => d.value === consultationData.date)?.label || consultationData.date;
    const timeLabel = availableTimes.find(t => t.value === consultationData.time)?.label || consultationData.time;
    
    toast({
      title: "Consultation Scheduled",
      description: `Your ${consultationData.type} consultation has been scheduled for ${dateLabel} at ${timeLabel}.`,
    });
  };

  return (
    <div className="space-y-8">
      {/* Consultation Type Selection */}
      <div>
        <h3 className="text-lg font-medium mb-4">Select Consultation Type</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {consultationTypes.map(type => (
            <div 
              key={type.id}
              onClick={() => handleTypeSelection(type.id)} 
              className={`border rounded-lg p-5 cursor-pointer transition-all relative
                ${consultationData.type === type.id 
                  ? 'border-black ring-2 ring-black ring-opacity-10' 
                  : 'hover:border-gray-400'}`}
            >
              {consultationData.type === type.id && (
                <div className="absolute top-3 right-3 bg-black text-white rounded-full p-1">
                  <Check className="h-3 w-3" />
                </div>
              )}
              <h4 className="font-medium text-lg mb-2">{type.label}</h4>
              <p className="text-gray-600 text-sm">{type.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Date Selection */}
      {consultationData.type && (
        <div>
          <h3 className="text-lg font-medium mb-4">Select Date</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {availableDates.map(date => (
              <Button
                key={date.id}
                variant={consultationData.date === date.value ? 'default' : 'outline'}
                className={`w-full ${consultationData.date === date.value ? '' : 'hover:border-gray-400'}`}
                onClick={() => handleDateSelection(date.value)}
              >
                {date.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Time Selection */}
      {consultationData.type && consultationData.date && (
        <div>
          <h3 className="text-lg font-medium mb-4">Select Time</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {availableTimes.map(time => (
              <Button
                key={time.id}
                variant={consultationData.time === time.value ? 'default' : 'outline'}
                className={`w-full ${consultationData.time === time.value ? '' : 'hover:border-gray-400'}`}
                onClick={() => handleTimeSelection(time.value)}
              >
                {time.label}
              </Button>
            ))}
          </div>
        </div>
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
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
          <div className="flex items-center">
            <div className="bg-green-500 rounded-full p-1 mr-3">
              <Check className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="font-medium">Consultation Scheduled</p>
              <p className="text-sm text-gray-600">
                {consultationData.type === 'virtual' ? 'Virtual Meeting' : 'In-Person Meeting'} on {
                  availableDates.find(d => d.value === consultationData.date)?.label
                } at {
                  availableTimes.find(t => t.value === consultationData.time)?.label
                }
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultationFormSection;
