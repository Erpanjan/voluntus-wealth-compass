
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ConsultationConfirmationDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  consultationType: string;
  dateLabel: string;
  timeLabel: string;
  onConfirm: () => void;
}

const ConsultationConfirmationDialog: React.FC<ConsultationConfirmationDialogProps> = ({
  isOpen,
  setIsOpen,
  consultationType,
  dateLabel,
  timeLabel,
  onConfirm
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
              <span className="font-medium">{dateLabel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Time:</span>
              <span className="font-medium">{timeLabel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Duration:</span>
              <span className="font-medium">45 minutes</span>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>
            Confirm Booking
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConsultationConfirmationDialog;
