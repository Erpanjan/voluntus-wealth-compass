
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
        <DropdownMenuItem onClick={() => applyFormat('heading1')}>
          <span className="text-2xl font-bold">Heading 1</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => applyFormat('heading2')}>
          <span className="text-xl font-semibold">Heading 2</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => applyFormat('heading3')}>
          <span className="text-lg font-semibold">Heading 3</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => applyFormat('heading4')}>
          <span className="text-base font-semibold">Heading 4</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => applyFormat('heading5')}>
          <span className="text-sm font-semibold">Heading 5</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => applyFormat('heading6')}>
          <span className="text-xs font-semibold">Heading 6</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => applyFormat('paragraph')}>
          <span className="text-sm">Paragraph</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default HeadingDropdown;
