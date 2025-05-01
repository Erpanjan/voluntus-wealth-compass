
import React from 'react';
import { 
  Bold, 
  Italic, 
  Underline,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TextFormattingToolsProps {
  applyFormat: (command: string, value?: string) => void;
}

const TextFormattingTools: React.FC<TextFormattingToolsProps> = ({ applyFormat }) => {
  return (
    <>
      <Button 
        onClick={() => applyFormat('bold')} 
        variant="ghost" 
        size="sm"
        className="h-8 w-8 p-0 hover:bg-[#E5DEFF] hover:text-[#8B5CF6]"
        title="Bold"
      >
        <Bold size={16} />
      </Button>
      <Button 
        onClick={() => applyFormat('italic')} 
        variant="ghost" 
        size="sm"
        className="h-8 w-8 p-0 hover:bg-[#E5DEFF] hover:text-[#8B5CF6]"
        title="Italic"
      >
        <Italic size={16} />
      </Button>
      <Button 
        onClick={() => applyFormat('underline')} 
        variant="ghost" 
        size="sm"
        className="h-8 w-8 p-0 hover:bg-[#E5DEFF] hover:text-[#8B5CF6]"
        title="Underline"
      >
        <Underline size={16} />
      </Button>
    </>
  );
};

export default TextFormattingTools;
