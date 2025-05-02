
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import ContactDetails from './ContactDetails';
import ContactActions from './ContactActions';
import NotesSection from './NotesSection';
import NotesToggle from './NotesToggle';
import AddNoteForm from './AddNoteForm';

interface ContactNoteType {
  id: string;
  contact_id: string;
  note: string;
  created_at: string;
  created_by: string;
}

interface ContactInquiryProps {
  inquiry: {
    id: string;
    first_name: string;
    last_name: string;
    contact_type: string;
    contact_info: string;
    message: string;
    created_at: string;
    status: string;
  };
  onStatusChange: (id: string, newStatus: string) => Promise<void>;
  onReply: (inquiry: any) => void;
  notes: ContactNoteType[];
  refreshNotes: () => void;
}

const ContactCard: React.FC<ContactInquiryProps> = ({ 
  inquiry, 
  onStatusChange, 
  onReply,
  notes,
  refreshNotes
}) => {
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  const { toast } = useToast();

  const handleAddNote = async () => {
    if (!newNote.trim()) {
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
        .insert({
          contact_id: inquiry.id,
          note: newNote.trim(),
          created_by: localStorage.getItem('userEmail') || 'Admin'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Note added successfully.",
      });
      setNewNote('');
      setIsAddingNote(false);
      refreshNotes();
    } catch (error) {
      console.error('Error adding note:', error);
      toast({
        title: "Error",
        description: "Failed to add note.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className={`border rounded-lg overflow-hidden ${inquiry.status === 'New' ? 'border-l-4 border-l-blue-500' : ''}`}>
      <div className="bg-white p-4">
        <ContactDetails inquiry={inquiry} />
        
        <ContactActions 
          status={inquiry.status} 
          onReply={() => onReply(inquiry)} 
          onStatusChange={(newStatus) => onStatusChange(inquiry.id, newStatus)}
        />
        
        <div className="border-t pt-3">
          <NotesToggle 
            showNotes={showNotes}
            noteCount={notes.length}
            isAddingNote={isAddingNote}
            onToggle={() => setShowNotes(!showNotes)}
            onAddNote={() => setIsAddingNote(true)}
          />
          
          {showNotes && notes.length > 0 && (
            <NotesSection notes={notes} />
          )}
          
          {isAddingNote && (
            <AddNoteForm 
              newNote={newNote}
              setNewNote={setNewNote}
              onCancel={() => {
                setIsAddingNote(false);
                setNewNote('');
              }}
              onSave={handleAddNote}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactCard;
