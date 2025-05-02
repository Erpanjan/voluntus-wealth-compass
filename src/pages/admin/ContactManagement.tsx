
import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import ContactCard from '@/components/admin/contact/ContactCard';
import FilterTabs from '@/components/admin/contact/FilterTabs';
import ReplyDialog from '@/components/admin/contact/ReplyDialog';
import ExportOptions from '@/components/admin/contact/ExportOptions';
import SearchBar from '@/components/admin/contact/SearchBar';
import { useContactManagement } from '@/hooks/admin/useContactManagement';

const ContactManagement = () => {
  const {
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
    handleStatusChange,
    handleReply,
    sendReply,
    getNotesForInquiry,
    getFilteredInquiries,
    handleExport,
    getStatusCounts,
    fetchContactNotes
  } = useContactManagement();

  // Get filtered inquiries
  const filteredInquiries = getFilteredInquiries();
  
  // Get status counts
  const statusCounts = getStatusCounts();

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold">Contact Inquiries</h1>
          
          <div className="flex gap-3 w-full sm:w-auto">
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
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
