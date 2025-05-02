
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { OnboardingFormData } from '@/hooks/use-onboarding-form';
import OnboardingReview from '../sections/consolidated/OnboardingReview';

interface PreviewDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  formData: OnboardingFormData;
  handleSubmit: () => void;
}

const PreviewDialog: React.FC<PreviewDialogProps> = ({
  isOpen,
  setIsOpen,
  formData,
  handleSubmit,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Review Your Application</DialogTitle>
        </DialogHeader>
        
        <OnboardingReview formData={formData} />
        
        <DialogFooter className="pt-6">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Close
          </Button>
          <Button onClick={handleSubmit}>
            Submit Application
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewDialog;
