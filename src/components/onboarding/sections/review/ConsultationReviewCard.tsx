
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getDateLabel, getTimeLabel } from './utils';

interface ConsultationReviewCardProps {
  consultation: {
    completed: boolean;
    type: string;
    date: string;
    time: string;
  };
  navigateTo: (section: string) => void;
}

const ConsultationReviewCard: React.FC<ConsultationReviewCardProps> = ({ consultation, navigateTo }) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Consultation Details</span>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigateTo('consultation')}
          >
            Edit
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {consultation.completed ? (
          <div className="space-y-2">
            <div className="grid grid-cols-2">
              <span className="text-gray-500">Consultation Type:</span>
              <span>{consultation.type === 'virtual' ? 'Virtual Meeting' : 'In-Person Meeting'}</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="text-gray-500">Date:</span>
              <span>{getDateLabel(consultation.date)}</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="text-gray-500">Time:</span>
              <span>{getTimeLabel(consultation.time)}</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="text-gray-500">Duration:</span>
              <span>45 minutes</span>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-amber-50 text-amber-700 rounded-md">
            <p className="font-medium">Consultation not scheduled</p>
            <p className="text-sm mt-1">
              A consultation is required to submit your application.
              Please schedule a consultation to proceed.
            </p>
            <Button 
              className="mt-3"
              variant="outline"
              onClick={() => navigateTo('consultation')}
            >
              Schedule Now
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ConsultationReviewCard;
