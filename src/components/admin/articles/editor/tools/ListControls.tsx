
import React from 'react';
import { List, ListOrdered, Indent, Outdent } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ListControlsProps {
  applyFormat: (command: string, value?: string) => void;
}

const ListControls: React.FC<ListControlsProps> = ({ applyFormat }) => {
  const handleBulletList = (e: React.MouseEvent) => {
    e.preventDefault();
    // Use formatBlock to create proper list items
    document.execCommand('insertUnorderedList');
    
    // After creating the list, make sure the editor maintains focus
    setTimeout(() => {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        selection.getRangeAt(0).startContainer.parentElement?.focus();
      }
    }, 0);
    
    // Notify the parent component about the change
    if (document.activeElement instanceof HTMLElement) {
      const event = new Event('input', { bubbles: true });
      document.activeElement.dispatchEvent(event);
    }
  };

  const handleNumberedList = (e: React.MouseEvent) => {
    e.preventDefault();
    document.execCommand('insertOrderedList');
    
    // After creating the list, make sure the editor maintains focus
    setTimeout(() => {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        selection.getRangeAt(0).startContainer.parentElement?.focus();
      }
    }, 0);
    
    // Notify the parent component about the change
    if (document.activeElement instanceof HTMLElement) {
      const event = new Event('input', { bubbles: true });
      document.activeElement.dispatchEvent(event);
    }
  };

  const handleIndent = (e: React.MouseEvent) => {
    e.preventDefault();
    document.execCommand('indent');
    
    // After indenting, make sure the editor maintains focus
    setTimeout(() => {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        selection.getRangeAt(0).startContainer.parentElement?.focus();
      }
    }, 0);
    
    // Notify the parent component about the change
    if (document.activeElement instanceof HTMLElement) {
      const event = new Event('input', { bubbles: true });
      document.activeElement.dispatchEvent(event);
    }
  };

  const handleOutdent = (e: React.MouseEvent) => {
    e.preventDefault();
    document.execCommand('outdent');
    
    // After outdenting, make sure the editor maintains focus
    setTimeout(() => {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        selection.getRangeAt(0).startContainer.parentElement?.focus();
      }
    }, 0);
    
    // Notify the parent component about the change
    if (document.activeElement instanceof HTMLElement) {
      const event = new Event('input', { bubbles: true });
      document.activeElement.dispatchEvent(event);
    }
  };

  return (
    <>
      <Button 
        onClick={handleBulletList}
        variant="ghost" 
        size="sm"
        className="h-8 w-8 p-0 hover:bg-[#E5DEFF] hover:text-[#8B5CF6]"
        title="Bullet List"
        type="button"
      >
        <List size={16} />
      </Button>
      
      <Button 
        onClick={handleNumberedList}
        variant="ghost" 
        size="sm"
        className="h-8 w-8 p-0 hover:bg-[#E5DEFF] hover:text-[#8B5CF6]"
        title="Numbered List"
        type="button"
      >
        <ListOrdered size={16} />
      </Button>

      <Button 
        onClick={handleIndent}
        variant="ghost" 
        size="sm"
        className="h-8 w-8 p-0 hover:bg-[#E5DEFF] hover:text-[#8B5CF6]"
        title="Increase Indent"
        type="button"
      >
        <Indent size={16} />
      </Button>

      <Button 
        onClick={handleOutdent}
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
