
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import Section from '@/components/ui/Section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

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
          <Card>
            <CardHeader>
              <CardTitle>Select Consultation Type</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                value={consultationData.type} 
                onValueChange={(value) => updateConsultationData({ type: value })}
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

          {consultationData.type && (
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
                          variant={consultationData.date === date.value ? 'default' : 'outline'}
                          className="w-full flex-grow"
                          onClick={() => updateConsultationData({ date: date.value })}
                        >
                          {date.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {consultationData.date && (
                    <div>
                      <Label className="block mb-3">Available Times</Label>
                      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                        {availableTimes.map(time => (
                          <Button
                            key={time.id}
                            variant={consultationData.time === time.value ? 'default' : 'outline'}
                            className="w-full"
                            onClick={() => updateConsultationData({ time: time.value })}
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
                <span className="font-medium">{consultationData.type === 'virtual' ? 'Virtual Meeting' : 'In-Person Meeting'}</span>
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
    </Section>
  );
};

export default ConsultationSection;
