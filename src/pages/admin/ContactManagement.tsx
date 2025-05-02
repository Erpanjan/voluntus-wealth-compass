
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Search } from 'lucide-react';
import ContactCard from '@/components/admin/contact/ContactCard';
import FilterTabs from '@/components/admin/contact/FilterTabs';
import ReplyDialog from '@/components/admin/contact/ReplyDialog';
import ExportOptions from '@/components/admin/contact/ExportOptions';

interface ContactInquiry {
  id: string;
  first_name: string;
  last_name: string;
  contact_type: string;
  contact_info: string;
  message: string;
  created_at: string;
  status: string;
}

interface ContactNote {
  id: string;
  contact_id: string;
  note: string;
  created_at: string;
  created_by: string;
}

const ContactManagement = () => {
  const [contactInquiries, setContactInquiries] = useState<ContactInquiry[]>([]);
  const [contactNotes, setContactNotes] = useState<ContactNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState<ContactInquiry | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchContactInquiries();
    fetchContactNotes();
  }, []);

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

  const handleReply = (inquiry: ContactInquiry) => {
    setSelectedInquiry(inquiry);
    setReplyText('');
    setIsReplyDialogOpen(true);
  };

  const sendReply = async () => {
    if (!selectedInquiry) return;
    
    // In a real application, this would send an email or message
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

  const getNotesForInquiry = (inquiryId: string) => {
    return contactNotes.filter(note => note.contact_id === inquiryId);
  };

  const handleExport = (includeNotes: boolean) => {
    try {
      // Filter inquiries based on current tab and search
      const inquiriesToExport = getFilteredInquiries();
      
      // Create CSV rows
      let csvRows = [];
      
      // Headers
      const basicHeaders = ['Name', 'Contact Type', 'Contact Info', 'Message', 'Date', 'Status'];
      const headers = includeNotes ? [...basicHeaders, 'Notes'] : basicHeaders;
      csvRows.push(headers.join(','));
      
      // Data rows
      inquiriesToExport.forEach(item => {
        const basicData = [
          `"${item.first_name} ${item.last_name}"`,
          `"${item.contact_type}"`,
          `"${item.contact_info}"`,
          `"${item.message.replace(/"/g, '""')}"`,
          `"${new Date(item.created_at).toLocaleDateString()}"`,
          `"${item.status}"`
        ];
        
        if (includeNotes) {
          const inquiryNotes = getNotesForInquiry(item.id);
          const notesText = inquiryNotes.map(note => 
            `${note.note} (${new Date(note.created_at).toLocaleDateString()} by ${note.created_by})`
          ).join('; ');
          basicData.push(`"${notesText}"`);
        }
        
        csvRows.push(basicData.join(','));
      });
      
      // Create and download CSV file
      const csvContent = csvRows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      // Determine filename based on current filter
      const dateStr = new Date().toISOString().split('T')[0];
      const filterName = activeTab !== 'all' ? `_${activeTab}` : '';
      const notesIndicator = includeNotes ? '_with_notes' : '';
      
      link.setAttribute('href', url);
      link.setAttribute('download', `contact_inquiries${filterName}${notesIndicator}_${dateStr}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Export successful",
        description: `Contact inquiries data has been exported to CSV${includeNotes ? ' with notes' : ''}.`,
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        title: "Export failed",
        description: "There was an error exporting the data.",
        variant: "destructive",
      });
    }
  };

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

  // Get filtered inquiries
  const filteredInquiries = getFilteredInquiries();
  
  // Count inquiries by status
  const statusCounts = {
    all: contactInquiries.length,
    new: contactInquiries.filter(i => i.status === 'New').length,
    responded: contactInquiries.filter(i => i.status === 'Responded').length,
    closed: contactInquiries.filter(i => i.status === 'Closed').length
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold">Contact Inquiries</h1>
          
          <div className="flex gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search inquiries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <ExportOptions handleExport={handleExport} />
          </div>
        </div>
        
        {/* Tabs for filtering by status */}
        <Card>
          <CardContent className="p-2">
            <FilterTabs 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              counts={statusCounts} 
            />
          </CardContent>
        </Card>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : filteredInquiries.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">No contact inquiries found.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredInquiries.map((inquiry) => (
              <ContactCard 
                key={inquiry.id} 
                inquiry={inquiry}
                onStatusChange={handleStatusChange}
                onReply={handleReply}
                notes={getNotesForInquiry(inquiry.id)}
                refreshNotes={fetchContactNotes}
              />
            ))}
          </div>
        )}

        <ReplyDialog
          isOpen={isReplyDialogOpen}
          onClose={() => setIsReplyDialogOpen(false)}
          selectedInquiry={selectedInquiry}
          onSendReply={sendReply}
          replyText={replyText}
          setReplyText={setReplyText}
        />
      </div>
    </AdminLayout>
  );
};

export default ContactManagement;
