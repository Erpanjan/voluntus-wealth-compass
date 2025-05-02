
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, ChevronDown, ChevronUp } from 'lucide-react';

interface NotesToggleProps {
  showNotes: boolean;
  noteCount: number;
  isAddingNote: boolean;
  onToggle: () => void;
  onAddNote: () => void;
}

const NotesToggle: React.FC<NotesToggleProps> = ({
  showNotes,
  noteCount,
  isAddingNote,
  onToggle,
  onAddNote
}) => {
  return (
    <div 
      className="flex justify-between items-center cursor-pointer text-sm font-medium text-gray-600" 
      onClick={onToggle}
    >
      <span className="flex items-center">
        Notes {noteCount > 0 && `(${noteCount})`}
      </span>
      <div className="flex items-center">
        {!isAddingNote && (
          <Button 
            size="sm" 
            variant="ghost" 
            className="mr-2 h-8 px-2"
            onClick={(e) => {
              e.stopPropagation();
              onAddNote();
            }}
          >
            <Plus size={16} className="mr-1" /> Add note
          </Button>
        )}
        {showNotes ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </div>
    </div>
  );
};

export default NotesToggle;
