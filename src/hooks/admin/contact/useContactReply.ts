
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ContactInquiry } from '../contactTypes';

export const useContactReply = (
  fetchContactNotes: () => Promise<void>,
  handleStatusChange: (id: string, newStatus: string) => Promise<void>
) => {
  const [selectedInquiry, setSelectedInquiry] = useState<ContactInquiry | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleReply = (inquiry: ContactInquiry) => {
    setSelectedInquiry(inquiry);
    setReplyText('');
    setIsReplyDialogOpen(true);
  };

  const sendReply = async () => {
    if (!selectedInquiry) return;
    
    try {
      // Mark as responded
      await handleStatusChange(selectedInquiry.id, 'Responded');
      
      // Add a note about the reply
      if (replyText.trim()) {
        await supabase.from('contact_notes').insert({
          contact_id: selectedInquiry.id,
          note: `Reply sent: ${replyText}`,
          created_by: localStorage.getItem('userEmail') || 'Admin'
        });
        
        // Refresh notes
        fetchContactNotes();
      }
      
      toast({
        title: "Reply sent",
        description: "Your reply has been sent successfully.",
      });
      setIsReplyDialogOpen(false);
    } catch (error) {
      console.error('Error sending reply:', error);
      toast({
        title: "Error",
        description: "Failed to send reply.",
        variant: "destructive",
      });
    }
  };

  return {
    selectedInquiry,
    replyText,
    setReplyText,
    isReplyDialogOpen,
    setIsReplyDialogOpen,
    handleReply,
    sendReply
  };
};
