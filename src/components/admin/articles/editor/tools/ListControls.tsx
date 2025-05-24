
import React from 'react';
import { List, ListOrdered, Indent, Outdent } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ListControlsProps {
  applyFormat: (command: string, value?: string) => void;
}

const ListControls: React.FC<ListControlsProps> = ({ applyFormat }) => {
  return (
    <>
      <Button 
        onClick={() => applyFormat('bulletList')}
        variant="ghost" 
        size="sm"
        className="h-8 w-8 p-0 hover:bg-[#E5DEFF] hover:text-[#8B5CF6]"
        title="Bullet List"
        type="button"
      >
        <List size={16} />
      </Button>
      
      <Button 
        onClick={() => applyFormat('orderedList')}
        variant="ghost" 
        size="sm"
        className="h-8 w-8 p-0 hover:bg-[#E5DEFF] hover:text-[#8B5CF6]"
        title="Numbered List"
        type="button"
      >
        <ListOrdered size={16} />
      </Button>

      <Button 
        onClick={() => applyFormat('indent')}
        variant="ghost" 
        size="sm"
        className="h-8 w-8 p-0 hover:bg-[#E5DEFF] hover:text-[#8B5CF6]"
        title="Increase Indent"
        type="button"
      >
        <Indent size={16} />
      </Button>

      <Button 
        onClick={() => applyFormat('outdent')}
        variant="ghost" 
        size="sm"
        className="h-8 w-8 p-0 hover:bg-[#E5DEFF] hover:text-[#8B5CF6]"
        title="Decrease Indent"
        type="button"
      >
        <Outdent size={16} />
      </Button>
    </>
  );
};

export default ListControls;
