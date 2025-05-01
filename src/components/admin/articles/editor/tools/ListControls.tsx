
import React from 'react';
import { List, ListOrdered } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ListControlsProps {
  applyFormat: (command: string, value?: string) => void;
}

const ListControls: React.FC<ListControlsProps> = ({ applyFormat }) => {
  return (
    <>
      <Button 
        onClick={() => applyFormat('insertUnorderedList')} 
        variant="ghost" 
        size="sm"
        className="h-8 w-8 p-0 hover:bg-[#E5DEFF] hover:text-[#8B5CF6]"
        title="Bullet List"
      >
        <List size={16} />
      </Button>
      
      <Button 
        onClick={() => applyFormat('insertOrderedList')} 
        variant="ghost" 
        size="sm"
        className="h-8 w-8 p-0 hover:bg-[#E5DEFF] hover:text-[#8B5CF6]"
        title="Numbered List"
      >
        <ListOrdered size={16} />
      </Button>
    </>
  );
};

export default ListControls;
