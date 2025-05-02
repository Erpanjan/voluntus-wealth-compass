
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Pencil } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Note {
  id: string;
  note: string;
  created_at: string;
  created_by: string;
}

interface NotesSectionProps {
  notes: Note[];
  onNoteUpdate: () => void;
}

const NotesSection: React.FC<NotesSectionProps> = ({ notes, onNoteUpdate }) => {
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editedNoteText, setEditedNoteText] = useState('');
  const { toast } = useToast();

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy h:mm a');
  };

  const handleEditClick = (note: Note) => {
    setEditingNoteId(note.id);
    setEditedNoteText(note.note);
  };

  const handleSaveEdit = async (noteId: string) => {
    if (!editedNoteText.trim()) {
      toast({
        title: "Error",
        description: "Note cannot be empty.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('contact_notes')
        .update({ note: editedNoteText.trim() })
        .eq('id', noteId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Note updated successfully.",
      });
      
      setEditingNoteId(null);
      onNoteUpdate();
    } catch (error) {
      console.error('Error updating note:', error);
      toast({
        title: "Error",
        description: "Failed to update note.",
        variant: "destructive"
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingNoteId(null);
    setEditedNoteText('');
  };

  return (
    <div className="space-y-3 mt-3">
      {notes.map((note) => (
        <div key={note.id} className="bg-gray-50 p-3 rounded-md">
          {editingNoteId === note.id ? (
            <>
              <Textarea
                value={editedNoteText}
                onChange={(e) => setEditedNoteText(e.target.value)}
                className="min-h-[100px] mb-2"
              />
              <div className="flex justify-end gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={handleCancelEdit}
                >
                  Cancel
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => handleSaveEdit(note.id)}
                >
                  Save Changes
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between">
                <p className="text-sm whitespace-pre-wrap">{note.note}</p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 w-6 p-0 text-gray-500"
                  onClick={() => handleEditClick(note)}
                >
                  <Pencil size={14} />
                </Button>
              </div>
              <div className="text-xs text-gray-500 mt-2 flex justify-between">
                <span>{formatDate(note.created_at)}</span>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default NotesSection;
