
import React from 'react';

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
    <div className="bg-white border border-gray-200 rounded-lg p-5 mt-4 shadow-sm">
      <h3 className="font-semibold text-lg">Consultation Scheduled</h3>
      <p className="text-gray-700 mt-1">
        Your {consultationType === 'virtual' ? 'Virtual Meeting' : 'In-Person Meeting'} consultation has been scheduled for {dateText} at {timeText}.
      </p>
    </div>
  );
};

export default ConsultationConfirmation;
