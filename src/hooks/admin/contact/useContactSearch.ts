
import { useState } from 'react';
import { ContactInquiry } from '../contactTypes';

export const useContactSearch = (
  contactInquiries: ContactInquiry[],
  getNotesForInquiry: (inquiryId: string) => any[]
) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  // Filter inquiries based on active tab and search query
  const getFilteredInquiries = () => {
    // First filter by status based on active tab
    let filteredByStatus = contactInquiries;
    if (activeTab !== 'all') {
      const statusMap: { [key: string]: string } = {
        'new': 'New',
        'responded': 'Responded',
        'closed': 'Closed'
      };
      
      filteredByStatus = contactInquiries.filter(
        inquiry => inquiry.status === statusMap[activeTab]
      );
    }
    
    // Then filter by search query
    if (!searchQuery) return filteredByStatus;
    
    const searchLower = searchQuery.toLowerCase();
    return filteredByStatus.filter(inquiry => {
      // Search in basic fields
      const basicMatch = 
        inquiry.first_name.toLowerCase().includes(searchLower) ||
        inquiry.last_name.toLowerCase().includes(searchLower) ||
        inquiry.contact_info.toLowerCase().includes(searchLower) ||
        inquiry.message.toLowerCase().includes(searchLower) ||
        inquiry.contact_type.toLowerCase().includes(searchLower);
      
      // Search in notes
      const inquiryNotes = getNotesForInquiry(inquiry.id);
      const notesMatch = inquiryNotes.some(note => 
        note.note.toLowerCase().includes(searchLower)
      );
      
      return basicMatch || notesMatch;
    });
  };

  // Count inquiries by status for the tabs
  const getStatusCounts = () => {
    return {
      all: contactInquiries.length,
      new: contactInquiries.filter(i => i.status === 'New').length,
      responded: contactInquiries.filter(i => i.status === 'Responded').length,
      closed: contactInquiries.filter(i => i.status === 'Closed').length
    };
  };

  return {
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    getFilteredInquiries,
    getStatusCounts
  };
};
