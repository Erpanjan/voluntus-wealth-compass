
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ContactInquiry } from '../contactTypes';

export const useContactInquiries = () => {
  const [contactInquiries, setContactInquiries] = useState<ContactInquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchContactInquiries = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        setContactInquiries(data as ContactInquiry[]);
      }
    } catch (error) {
      console.error('Error fetching contact inquiries:', error);
      toast({
        title: "Error",
        description: "Failed to load contact inquiries.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContactInquiries();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Update local state
      setContactInquiries(prevInquiries => 
        prevInquiries.map(inquiry => 
          inquiry.id === id ? { ...inquiry, status: newStatus } : inquiry
        )
      );

      toast({
        title: "Status updated",
        description: `Inquiry marked as ${newStatus}.`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update status.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteInquiry = async (id: string): Promise<void> => {
    console.log("Hook: Starting deletion process for inquiry ID:", id);
    
    try {
      // First delete all associated notes
      console.log("Hook: Deleting associated notes...");
      const { error: notesError, data: deletedNotes } = await supabase
        .from('contact_notes')
        .delete()
        .eq('contact_id', id)
        .select();
      
      if (notesError) {
        console.error("Hook: Error deleting notes:", notesError);
        throw notesError;
      }
      
      console.log("Hook: Successfully deleted associated notes", deletedNotes);
      
      // Then delete the inquiry itself
      console.log("Hook: Deleting inquiry...");
      const { error, data: deletedInquiry } = await supabase
        .from('contact_submissions')
        .delete()
        .eq('id', id)
        .select();

      if (error) {
        console.error("Hook: Error deleting inquiry:", error);
        throw error;
      }
      
      console.log("Hook: Successfully deleted inquiry with ID:", id, deletedInquiry);

      // Update local state immediately
      setContactInquiries(prevInquiries => 
        prevInquiries.filter(inquiry => inquiry.id !== id)
      );

    } catch (error: any) {
      console.error('Hook: Error in deletion process:', error);
      toast({
        title: "Error",
        description: `Failed to delete inquiry: ${error.message || "Unknown error"}`,
        variant: "destructive",
      });
      throw error; // Re-throw to handle in the component
    }
  };

  return {
    contactInquiries,
    isLoading,
    fetchContactInquiries,
    handleStatusChange,
    handleDeleteInquiry,
    setContactInquiries
  };
};
