
import React from 'react';
import { Heading } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem 
} from '@/components/ui/dropdown-menu';

interface HeadingDropdownProps {
  applyFormat: (command: string, value?: string) => void;
}

const HeadingDropdown: React.FC<HeadingDropdownProps> = ({ applyFormat }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="h-8 px-2 flex items-center gap-1 hover:bg-[#E5DEFF] hover:text-[#8B5CF6]"
        >
          <Heading size={16} />
          <span>Heading</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => applyFormat('formatBlock', 'h1')}>
          <span className="text-xl font-semibold">Heading 1</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => applyFormat('formatBlock', 'h2')}>
          <span className="text-lg font-semibold">Heading 2</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => applyFormat('formatBlock', 'h3')}>
          <span className="text-base font-semibold">Heading 3</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => applyFormat('formatBlock', 'p')}>
          <span className="text-sm">Paragraph</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default HeadingDropdown;
