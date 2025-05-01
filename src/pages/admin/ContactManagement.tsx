
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, Mail, AtSign, User, MapPin, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

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

const ContactManagement = () => {
  const [contactInquiries, setContactInquiries] = useState<ContactInquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState<ContactInquiry | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchContactInquiries();
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
    // For now, we'll just simulate it and update the status
    try {
      await handleStatusChange(selectedInquiry.id, 'Responded');
      toast({
        title: "Reply sent",
        description: "Your reply has been sent successfully.",
      });
      setIsReplyDialogOpen(false);
    } catch (error) {
      console.error('Error sending reply:', error);
    }
  };

  const exportData = () => {
    try {
      // Create CSV content
      const headers = ['Name', 'Contact Type', 'Contact Info', 'Message', 'Date', 'Status'];
      const csvContent = [
        headers.join(','),
        ...contactInquiries.map(item => [
          `${item.first_name} ${item.last_name}`,
          item.contact_type,
          item.contact_info,
          `"${item.message.replace(/"/g, '""')}"`,
          new Date(item.created_at).toLocaleDateString(),
          item.status
        ].join(','))
      ].join('\n');

      // Create download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `contact_inquiries_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Export successful",
        description: "Contact inquiries data has been exported to CSV.",
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

  // Filter inquiries based on search query
  const filteredInquiries = contactInquiries.filter(inquiry => {
    const searchLower = searchQuery.toLowerCase();
    return (
      inquiry.first_name.toLowerCase().includes(searchLower) ||
      inquiry.last_name.toLowerCase().includes(searchLower) ||
      inquiry.contact_info.toLowerCase().includes(searchLower) ||
      inquiry.message.toLowerCase().includes(searchLower) ||
      inquiry.status.toLowerCase().includes(searchLower)
    );
  });

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
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
            <Button variant="outline" onClick={exportData}>Export Data</Button>
          </div>
        </div>
        
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
              <Card key={inquiry.id} className={`${inquiry.status === 'New' ? 'border-l-4 border-l-blue-500' : ''}`}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">{`${inquiry.first_name} ${inquiry.last_name}`}</CardTitle>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      inquiry.status === 'New' ? 'bg-blue-100 text-blue-800' : 
                      inquiry.status === 'Responded' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-green-100 text-green-800'
                    }`}>
                      {inquiry.status}
                    </span>
                  </div>
                  <CardDescription className="flex items-center gap-1 flex-wrap">
                    <span className="flex items-center">
                      <User size={14} className="mr-1" />
                      {inquiry.contact_type}
                    </span>
                    <span className="mx-2">•</span>
                    <span className="flex items-center">
                      {inquiry.contact_type.toLowerCase().includes('email') ? (
                        <Mail size={14} className="mr-1" />
                      ) : (
                        <Phone size={14} className="mr-1" />
                      )}
                      {inquiry.contact_info}
                    </span>
                    <span className="mx-2">•</span>
                    {formatDate(inquiry.created_at)}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <p className="text-gray-700 whitespace-pre-wrap">{inquiry.message}</p>
                  <div className="mt-4 flex gap-2 flex-wrap">
                    <Button size="sm" variant="default" onClick={() => handleReply(inquiry)}>
                      Reply
                    </Button>
                    {inquiry.status === 'New' ? (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleStatusChange(inquiry.id, 'Responded')}
                      >
                        Mark as Responded
                      </Button>
                    ) : inquiry.status === 'Responded' ? (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleStatusChange(inquiry.id, 'Closed')}
                      >
                        Mark as Closed
                      </Button>
                    ) : (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleStatusChange(inquiry.id, 'New')}
                      >
                        Reopen
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={isReplyDialogOpen} onOpenChange={setIsReplyDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Reply to {selectedInquiry?.first_name} {selectedInquiry?.last_name}</DialogTitle>
              <DialogDescription>
                Send a response to the contact inquiry.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Recipient</p>
                <p className="text-sm">{selectedInquiry?.contact_info}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Original Message</p>
                <p className="text-sm bg-gray-100 p-3 rounded">{selectedInquiry?.message}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Your Reply</p>
                <Textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={5}
                  placeholder="Type your response here..."
                  className="resize-none"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsReplyDialogOpen(false)}>Cancel</Button>
              <Button onClick={sendReply}>Send Reply</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default ContactManagement;
