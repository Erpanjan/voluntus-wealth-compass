
import React from 'react';
import { AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AlignmentControlsProps {
  applyFormat: (command: string, value?: string) => void;
}

const AlignmentControls: React.FC<AlignmentControlsProps> = ({ applyFormat }) => {
  return (
    <>
      <Button 
        onClick={() => applyFormat('alignLeft')} 
        variant="ghost" 
        size="sm"
        className="h-8 w-8 p-0 hover:bg-[#E5DEFF] hover:text-[#8B5CF6]"
        title="Align Left"
      >
        <AlignLeft size={16} />
      </Button>
      
      <Button 
        onClick={() => applyFormat('alignCenter')} 
        variant="ghost" 
        size="sm"
        className="h-8 w-8 p-0 hover:bg-[#E5DEFF] hover:text-[#8B5CF6]"
        title="Align Center"
      >
        <AlignCenter size={16} />
      </Button>
      
      <Button 
        onClick={() => applyFormat('alignRight')} 
        variant="ghost" 
        size="sm"
        className="h-8 w-8 p-0 hover:bg-[#E5DEFF] hover:text-[#8B5CF6]"
        title="Align Right"
      >
        <AlignRight size={16} />
      </Button>
      
      <Button 
        onClick={() => applyFormat('alignJustify')} 
        variant="ghost" 
        size="sm"
        className="h-8 w-8 p-0 hover:bg-[#E5DEFF] hover:text-[#8B5CF6]"
        title="Justify"
      >
        <AlignJustify size={16} />
      </Button>
    </>
  );
};

export default AlignmentControls;
