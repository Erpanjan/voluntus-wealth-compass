
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface AddNoteFormProps {
  newNote: string;
  setNewNote: (note: string) => void;
  onCancel: () => void;
  onSave: () => void;
}

const AddNoteForm: React.FC<AddNoteFormProps> = ({
  newNote,
  setNewNote,
  onCancel,
  onSave
}) => {
  return (
    <div className="mt-3">
      <Textarea
        value={newNote}
        onChange={(e) => setNewNote(e.target.value)}
        placeholder="Add a note about this inquiry..."
        className="min-h-[100px] mb-2"
      />
      <div className="flex justify-end gap-2">
        <Button 
          size="sm" 
          variant="outline" 
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button 
          size="sm" 
          onClick={onSave}
        >
          Save Note
        </Button>
      </div>
    </div>
  );
};

export default AddNoteForm;
