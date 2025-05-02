
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

  return {
    contactNotes,
    fetchContactNotes,
    getNotesForInquiry
  };
};
