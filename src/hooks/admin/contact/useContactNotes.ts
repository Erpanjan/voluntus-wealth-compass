
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ContactNote } from '../contactTypes';

export const useContactNotes = () => {
  const [contactNotes, setContactNotes] = useState<ContactNote[]>([]);
  const { toast } = useToast();

  const fetchContactNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_notes')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        throw error;
      }

      if (data) {
        setContactNotes(data as ContactNote[]);
      }
    } catch (error) {
      console.error('Error fetching contact notes:', error);
      toast({
        title: "Error",
        description: "Failed to load contact notes.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchContactNotes();
  }, []);

  const getNotesForInquiry = (inquiryId: string) => {
    return contactNotes.filter(note => note.contact_id === inquiryId);
  };

  const updateNote = async (noteId: string, noteText: string) => {
    try {
      const { error } = await supabase
        .from('contact_notes')
        .update({ note: noteText })
        .eq('id', noteId);

      if (error) throw error;
      
      // Update local state
      setContactNotes(prevNotes => 
        prevNotes.map(note => 
          note.id === noteId ? { ...note, note: noteText } : note
        )
      );

      toast({
        title: "Note updated",
        description: "The note has been updated successfully.",
      });

      return true;
    } catch (error) {
      console.error('Error updating note:', error);
      toast({
        title: "Error",
        description: "Failed to update note.",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    contactNotes,
    fetchContactNotes,
    getNotesForInquiry,
    updateNote
  };
};
