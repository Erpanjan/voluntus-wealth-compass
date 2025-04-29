
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Calendar } from 'lucide-react';

interface ConsultationSchedulingProps {
  setCompleted: (completed: boolean) => void;
}

const ConsultationScheduling = ({ setCompleted }: ConsultationSchedulingProps) => {
  const { toast } = useToast();
  const [consultationType, setConsultationType] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleTypeSelect = (type: string) => {
    setConsultationType(type);
  };

  const handleTimeSelect = (time: string) => {
    setIsDialogOpen(true);
    setSelectedTime(time);
  };

  const confirmSchedule = () => {
    toast({
      title: "Consultation Scheduled",
      description: `Your ${consultationType} consultation has been scheduled.`,
    });
    setCompleted(true);
    setIsDialogOpen(false);
  };

  return (
    <div className="mt-4">
      <h3 className="font-medium mb-4">Consultation Options</h3>
      
      <div className="space-y-4">
        {/* Online Meeting Option */}
        <div className="bg-gray-100 p-4 rounded-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Calendar className="mr-2" size={18} />
              <span>Online Meeting</span>
            </div>
            <Button 
              variant="outline" 
              onClick={() => {
                handleTypeSelect('online');
                handleTimeSelect('Next available');
              }}
            >
              Select Time
            </Button>
          </div>
        </div>
        
        {/* In-Person Meeting Option */}
        <div className="bg-gray-100 p-4 rounded-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Calendar className="mr-2" size={18} />
              <span>In-Person Meeting</span>
            </div>
            <Button 
              variant="outline"
              onClick={() => {
                handleTypeSelect('in-person');
                handleTimeSelect('Next available');
              }}
            >
              Select Time
            </Button>
          </div>
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
                <span className="font-medium">{consultationType === 'online' ? 'Online Meeting' : 'In-Person Meeting'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Time:</span>
                <span className="font-medium">Next available slot</span>
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
