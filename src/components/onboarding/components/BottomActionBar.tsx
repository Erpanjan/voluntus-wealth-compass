
import React from 'react';
import { Button } from '@/components/ui/button';

interface BottomActionBarProps {
  handleSaveDraft: () => void;
  handlePreview: () => void;
  handleSubmit: () => void;
}

const BottomActionBar: React.FC<BottomActionBarProps> = ({
  handleSaveDraft,
  handlePreview,
  handleSubmit,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-4 px-6 z-[100]">
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        <Button variant="outline" onClick={handleSaveDraft}>
          Save Draft
        </Button>
        
        <div className="flex gap-3">
          <Button variant="secondary" onClick={handlePreview}>
            Preview
          </Button>
          <Button onClick={handleSubmit}>
            Submit Application
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BottomActionBar;
