
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { getAvailableDates, getAvailableTimes } from '../scheduling/utils';

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
  const availableDates = getAvailableDates();
  const availableTimes = getAvailableTimes();

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
