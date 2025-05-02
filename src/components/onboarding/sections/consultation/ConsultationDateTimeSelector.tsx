
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface ConsultationDateTimeSelectorProps {
  selectedDate: string;
  selectedTime: string;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
}

const ConsultationDateTimeSelector: React.FC<ConsultationDateTimeSelectorProps> = ({
  selectedDate,
  selectedTime,
  onDateChange,
  onTimeChange
}) => {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Date & Time</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <Label className="block mb-3">Available Dates</Label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {availableDates.map(date => (
                <Button
                  key={date.id}
                  variant={selectedDate === date.value ? 'default' : 'outline'}
                  className="w-full flex-grow"
                  onClick={() => onDateChange(date.value)}
                >
                  {date.label}
                </Button>
              ))}
            </div>
          </div>

          {selectedDate && (
            <div>
              <Label className="block mb-3">Available Times</Label>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                {availableTimes.map(time => (
                  <Button
                    key={time.id}
                    variant={selectedTime === time.value ? 'default' : 'outline'}
                    className="w-full"
                    onClick={() => onTimeChange(time.value)}
                  >
                    {time.label}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ConsultationDateTimeSelector;
