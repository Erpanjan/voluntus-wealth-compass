
import React from 'react';
import { Undo, Redo } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HistoryControlsProps {
  applyFormat: (command: string, value?: string) => void;
}

const HistoryControls: React.FC<HistoryControlsProps> = ({ applyFormat }) => {
  return (
    <>
      <Button 
        onClick={() => applyFormat('undo')} 
        variant="ghost" 
        size="sm"
        className="h-8 w-8 p-0 hover:bg-[#E5DEFF] hover:text-[#8B5CF6]"
        title="Undo"
      >
        <Undo size={16} />
      </Button>
      
      <Button 
        onClick={() => applyFormat('redo')} 
        variant="ghost" 
        size="sm"
        className="h-8 w-8 p-0 hover:bg-[#E5DEFF] hover:text-[#8B5CF6]"
        title="Redo"
      >
        <Redo size={16} />
      </Button>
    </>
  );
};

export default HistoryControls;
