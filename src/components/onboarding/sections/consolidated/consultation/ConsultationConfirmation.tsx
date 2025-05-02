
import React from 'react';
import { Check } from 'lucide-react';

interface ConsultationConfirmationProps {
  consultationType: string;
  dateText: string;
  timeText: string;
}

const ConsultationConfirmation: React.FC<ConsultationConfirmationProps> = ({
  consultationType,
  dateText,
  timeText
}) => {
  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
      <div className="flex items-center">
        <div className="bg-green-500 rounded-full p-1 mr-3">
          <Check className="h-4 w-4 text-white" />
        </div>
        <div>
          <p className="font-medium">Consultation Scheduled</p>
          <p className="text-sm text-gray-600">
            {consultationType === 'virtual' ? 'Virtual Meeting' : 'In-Person Meeting'} on {dateText} at {timeText}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConsultationConfirmation;
