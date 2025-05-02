
import React from 'react';
import { Button } from '@/components/ui/button';

interface ActionButtonsProps {
  handleSaveDraft: () => void;
  handleContinue: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  handleSaveDraft,
  handleContinue
}) => {
  return (
    <div className="flex justify-between pt-4">
      <Button variant="outline" onClick={handleSaveDraft}>
        Save Draft
      </Button>
      <Button onClick={handleContinue}>
        Continue
      </Button>
    </div>
  );
};

export default ActionButtons;
