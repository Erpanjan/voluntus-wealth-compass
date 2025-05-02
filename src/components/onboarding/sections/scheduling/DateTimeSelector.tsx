
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface DateTimeSelectorProps {
  selectedDate: string;
  selectedTime: string;
  setSelectedDate: (date: string) => void;
  setSelectedTime: (time: string) => void;
  availableDates: Array<{ id: string; value: string; label: string }>;
  availableTimes: Array<{ id: string; value: string; label: string }>;
}

const DateTimeSelector: React.FC<DateTimeSelectorProps> = ({
  selectedDate,
  selectedTime,
  setSelectedDate,
  setSelectedTime,
  availableDates,
  availableTimes
}) => {
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
                  onClick={() => setSelectedDate(date.value)}
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
                    onClick={() => setSelectedTime(time.value)}
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

export default DateTimeSelector;
