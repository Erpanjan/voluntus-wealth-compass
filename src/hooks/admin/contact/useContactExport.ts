
import { useToast } from '@/hooks/use-toast';
import { ContactInquiry } from '../contactTypes';

export const useContactExport = (
  getFilteredInquiries: () => ContactInquiry[],
  getNotesForInquiry: (inquiryId: string) => any[],
  activeTab: string
) => {
  const { toast } = useToast();

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

  return { handleExport };
};
