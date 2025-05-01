
import React from 'react';
import { Undo2, Redo2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HistoryControlsProps {
  applyFormat: (command: string, value?: string) => void;
}

const HistoryControls: React.FC<HistoryControlsProps> = ({ applyFormat }) => {
  const handleUndo = (e: React.MouseEvent) => {
    e.preventDefault();
    applyFormat('undo');
  };

  const handleRedo = (e: React.MouseEvent) => {
    e.preventDefault();
    applyFormat('redo');
  };

  return (
    <>
      <Button 
        onClick={handleUndo}
        variant="ghost" 
        size="sm"
        className="h-8 w-8 p-0 hover:bg-[#E5DEFF] hover:text-[#8B5CF6]"
        title="Undo"
        type="button"
      >
        <Undo2 size={16} />
      </Button>
      
      <Button 
        onClick={handleRedo}
        variant="ghost" 
        size="sm"
        className="h-8 w-8 p-0 hover:bg-[#E5DEFF] hover:text-[#8B5CF6]"
        title="Redo"
        type="button"
      >
        <Redo2 size={16} />
      </Button>
    </>
  );
};

export default HistoryControls;
