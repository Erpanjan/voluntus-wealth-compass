
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface ConsultationSchedulingProps {
  setCompleted: (completed: boolean) => void;
}

const ConsultationScheduling = ({ setCompleted }: ConsultationSchedulingProps) => {
  const { toast } = useToast();
  const [consultationType, setConsultationType] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
      description: `Your ${consultationType} consultation has been scheduled for ${getDateLabel()} at ${getTimeLabel()}.`,
    });
    setCompleted(true);
    setIsDialogOpen(false);
  };

  const getDateLabel = () => {
    const date = availableDates.find(d => d.value === selectedDate);
    return date?.label || selectedDate;
  };

  const getTimeLabel = () => {
    const time = availableTimes.find(t => t.value === selectedTime);
    return time?.label || selectedTime;
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6">Schedule a Consultation</h1>
      <p className="text-lg mb-8">
        Meet with one of our advisors to discuss your financial goals and investment strategy. This step is required to activate your account.
      </p>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Select Consultation Type</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup 
              value={consultationType} 
              onValueChange={setConsultationType}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div className="flex">
                <div className="border rounded-lg p-4 w-full hover:border-black transition-colors cursor-pointer">
                  <RadioGroupItem value="virtual" id="virtual" className="sr-only" />
                  <Label htmlFor="virtual" className="cursor-pointer">
                    <div className="font-medium text-lg mb-2">Virtual Meeting</div>
                    <p className="text-gray-600">
                      Schedule a video call with one of our advisors. Discuss your financial goals from the comfort of your home.
                    </p>
                  </Label>
                </div>
              </div>

              <div className="flex">
                <div className="border rounded-lg p-4 w-full hover:border-black transition-colors cursor-pointer">
                  <RadioGroupItem value="in-person" id="in-person" className="sr-only" />
                  <Label htmlFor="in-person" className="cursor-pointer">
                    <div className="font-medium text-lg mb-2">In-Person Meeting</div>
                    <p className="text-gray-600">
                      Visit our office for a face-to-face consultation with our financial experts.
                    </p>
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {consultationType && (
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
        )}

        <Button onClick={handleSchedule} className="w-full md:w-auto">
          Schedule Consultation
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Your Consultation</DialogTitle>
            <DialogDescription>
              Please review the details of your scheduled consultation.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Consultation Type:</span>
                <span className="font-medium">{consultationType === 'virtual' ? 'Virtual Meeting' : 'In-Person Meeting'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Date:</span>
                <span className="font-medium">{getDateLabel()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Time:</span>
                <span className="font-medium">{getTimeLabel()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Duration:</span>
                <span className="font-medium">45 minutes</span>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmSchedule}>
              Confirm Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ConsultationScheduling;
