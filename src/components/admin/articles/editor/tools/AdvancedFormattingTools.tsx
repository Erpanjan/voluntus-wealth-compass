
import React from 'react';
import { 
  Superscript, 
  Subscript,
  Highlighter,
  Quote,
  Code2,
  FileVideo,
  Paperclip
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdvancedFormattingToolsProps {
  applyFormat: (command: string, value?: string) => void;
  onVideoInsert: () => void;
  onFileAttach: () => void;
}

const AdvancedFormattingTools: React.FC<AdvancedFormattingToolsProps> = ({ 
  applyFormat, 
  onVideoInsert, 
  onFileAttach 
}) => {
  return (
    <>
      <Button 
        onClick={() => applyFormat('superscript')} 
        variant="ghost" 
        size="sm"
        className="h-8 w-8 p-0 hover:bg-[#E5DEFF] hover:text-[#8B5CF6]"
        title="Superscript"
      >
        <Superscript size={16} />
      </Button>
      
      <Button 
        onClick={() => applyFormat('subscript')} 
        variant="ghost" 
        size="sm"
        className="h-8 w-8 p-0 hover:bg-[#E5DEFF] hover:text-[#8B5CF6]"
        title="Subscript"
      >
        <Subscript size={16} />
      </Button>
      
      <Button 
        onClick={() => applyFormat('highlight')} 
        variant="ghost" 
        size="sm"
        className="h-8 w-8 p-0 hover:bg-[#E5DEFF] hover:text-[#8B5CF6]"
        title="Highlight"
      >
        <Highlighter size={16} />
      </Button>
      
      <Button 
        onClick={() => applyFormat('blockquote')} 
        variant="ghost" 
        size="sm"
        className="h-8 w-8 p-0 hover:bg-[#E5DEFF] hover:text-[#8B5CF6]"
        title="Quote"
      >
        <Quote size={16} />
      </Button>
      
      <Button 
        onClick={() => applyFormat('codeBlock')} 
        variant="ghost" 
        size="sm"
        className="h-8 w-8 p-0 hover:bg-[#E5DEFF] hover:text-[#8B5CF6]"
        title="Code Block"
      >
        <Code2 size={16} />
      </Button>
      
      <Button 
        onClick={onVideoInsert}
        variant="ghost" 
        size="sm"
        className="h-8 w-8 p-0 hover:bg-[#E5DEFF] hover:text-[#8B5CF6]"
        title="Insert Video"
      >
        <FileVideo size={16} />
      </Button>
      
      <Button 
        onClick={onFileAttach}
        variant="ghost" 
        size="sm"
        className="h-8 w-8 p-0 hover:bg-[#E5DEFF] hover:text-[#8B5CF6]"
        title="Attach File"
      >
        <Paperclip size={16} />
      </Button>
    </>
  );
};

export default AdvancedFormattingTools;
