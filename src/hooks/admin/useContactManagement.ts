
import { useContactInquiries } from './contact/useContactInquiries';
import { useContactNotes } from './contact/useContactNotes';
import { useContactSearch } from './contact/useContactSearch';
import { useContactReply } from './contact/useContactReply';

export const useContactManagement = () => {
  // Use the smaller, focused hooks
  const { 
    contactInquiries, 
    isLoading, 
    fetchContactInquiries, 
    handleStatusChange,
    handleDeleteInquiry 
  } = useContactInquiries();
  
  const { 
    contactNotes, 
    fetchContactNotes, 
    getNotesForInquiry,
    updateNote
  } = useContactNotes();
  
  const { 
    searchQuery, 
    setSearchQuery, 
    activeTab, 
    setActiveTab, 
    getFilteredInquiries, 
    getStatusCounts 
  } = useContactSearch(contactInquiries, getNotesForInquiry);
  
  const { 
    selectedInquiry, 
    replyText, 
    setReplyText, 
    isReplyDialogOpen, 
    setIsReplyDialogOpen, 
    handleReply, 
    sendReply 
  } = useContactReply(fetchContactNotes, handleStatusChange);

  // Return all the values and functions that were previously exposed
  return {
    contactInquiries,
    contactNotes,
    isLoading,
    searchQuery,
    setSearchQuery,
    selectedInquiry,
    replyText,
    setReplyText,
    isReplyDialogOpen,
    setIsReplyDialogOpen,
    activeTab,
    setActiveTab,
    fetchContactInquiries,
    fetchContactNotes,
    handleStatusChange,
    handleReply,
    sendReply,
    getNotesForInquiry,
    getFilteredInquiries,
    handleDeleteInquiry,
    updateNote,
    getStatusCounts,
  };
};
