
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card } from '@/components/ui/card';
import { ApplicationData, useApplicationService } from '@/services/applicationService';
import { useToast } from '@/hooks/use-toast';
import ConfirmationDialog from '@/components/admin/applications/ConfirmationDialog';
import ApplicationSearch from '@/components/admin/applications/ApplicationSearch';
import RefreshButton from '@/components/admin/applications/RefreshButton';
import ApplicationTable from '@/components/admin/applications/ApplicationTable';
import ApplicationPagination from '@/components/admin/applications/ApplicationPagination';
import { debounce } from '@/lib/utils';

const PAGE_SIZE = 10;

const ClientAppManagement: React.FC = () => {
  // Core state
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Search and pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Confirmation dialog state
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<ApplicationData | null>(null);
  const [confirmAction, setConfirmAction] = useState<'approve' | 'pending' | 'delete'>('approve');
  
  const { fetchApplications, updateApplicationStatus, deleteApplication } = useApplicationService();
  const { toast } = useToast();

  // Efficient filtering with useMemo
  const filteredApplications = useMemo(() => {
    if (!searchTerm.trim()) return applications;
    
    const searchTermLower = searchTerm.toLowerCase();
    return applications.filter(app => 
      (app.first_name?.toLowerCase().includes(searchTermLower)) || 
      (app.last_name?.toLowerCase().includes(searchTermLower)) ||
      (app.email?.toLowerCase().includes(searchTermLower)) ||
      (app.status.toLowerCase().includes(searchTermLower))
    );
  }, [searchTerm, applications]);
  
  // Calculate total pages for pagination
  const totalPages = useMemo(() => 
    Math.max(1, Math.ceil(filteredApplications.length / PAGE_SIZE)), 
    [filteredApplications]
  );
  
  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Load applications data
  const loadApplications = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await fetchApplications();
      setApplications(data);
    } catch (error) {
      console.error('Failed to load applications', error);
      toast({
        title: 'Error',
        description: 'Failed to load application data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [fetchApplications, toast]);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  // Handle refresh button click
  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    loadApplications();
  }, [loadApplications]);
  
  // Debounced search term setter
  const debouncedSetSearchTerm = useCallback(
    debounce((value: string) => {
      setSearchTerm(value);
    }, 300),
    []
  );

  // Open confirmation dialog
  const openConfirmDialog = useCallback((app: ApplicationData, action: 'approve' | 'pending' | 'delete') => {
    setSelectedApplication(app);
    setConfirmAction(action);
    setConfirmDialogOpen(true);
  }, []);

  // Handle dialog confirmation
  const handleConfirmAction = async () => {
    if (!selectedApplication) return;
    
    try {
      if (confirmAction === 'delete') {
        await deleteApplication(selectedApplication.id);
        // Remove the application from the local state
        setApplications(prev => prev.filter(app => app.id !== selectedApplication.id));
        
        toast({
          title: 'Application Deleted',
          description: 'Application has been permanently removed.',
        });
      } else {
        const newStatus = confirmAction === 'approve' ? 'approved' : 'pending';
        await updateApplicationStatus(selectedApplication.id, newStatus);
        
        // Update the application status in local state
        setApplications(prev => prev.map(app => 
          app.id === selectedApplication.id ? {...app, status: newStatus} : app
        ));
        
        toast({
          title: confirmAction === 'approve' ? 'Application Approved' : 'Application Updated',
          description: `Status has been updated to ${confirmAction === 'approve' ? 'approved' : 'pending'}.`,
        });
      }
    } catch (error) {
      console.error('Failed to process action', error);
      toast({
        title: 'Error',
        description: `Failed to ${confirmAction} application. Please try again.`,
        variant: 'destructive',
      });
    } finally {
      setConfirmDialogOpen(false);
      setSelectedApplication(null);
    }
  };
  
  // Handle dialog close
  const handleCloseDialog = () => {
    setConfirmDialogOpen(false);
    setSelectedApplication(null);
  };

  // Change current page
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Search and controls section */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 items-center">
          <ApplicationSearch 
            searchTerm={searchTerm} 
            setSearchTerm={debouncedSetSearchTerm} 
            placeholder="Search by name, email or status..."
          />
          <RefreshButton isRefreshing={isRefreshing} handleRefresh={handleRefresh} />
        </div>
        
        {/* Applications table card */}
        <Card className="shadow-sm">
          <ApplicationTable 
            applications={filteredApplications}
            isLoading={isLoading}
            openConfirmDialog={openConfirmDialog}
            page={currentPage}
            pageSize={PAGE_SIZE}
          />
          
          {/* Pagination */}
          {filteredApplications.length > 0 && (
            <div className="flex justify-center py-2">
              <ApplicationPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </Card>
      </div>
      
      {/* Confirmation dialog */}
      <ConfirmationDialog
        isOpen={confirmDialogOpen}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmAction}
        application={selectedApplication}
        actionType={confirmAction}
      />
    </AdminLayout>
  );
};

export default ClientAppManagement;
