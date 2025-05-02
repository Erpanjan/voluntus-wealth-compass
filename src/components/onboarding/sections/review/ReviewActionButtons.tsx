
import React from 'react';
import { Button } from '@/components/ui/button';

interface ReviewActionButtonsProps {
  navigateTo: (section: string) => void;
  handleSaveDraft: () => void;
  handleSubmit: () => void;
  canSubmit: boolean;
}

const ReviewActionButtons: React.FC<ReviewActionButtonsProps> = ({
  navigateTo,
  handleSaveDraft,
  handleSubmit,
  canSubmit
}) => {
  return (
    <div className="flex justify-between">
      <Button 
        variant="outline" 
        onClick={() => navigateTo('consultation')}
      >
        Back
      </Button>
      <Button variant="outline" onClick={handleSaveDraft}>
        Save Draft
      </Button>
      <Button 
        onClick={handleSubmit}
        disabled={!canSubmit}
      >
        Submit Application
      </Button>
    </div>
  );
};

export default ReviewActionButtons;
