
import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card } from '@/components/ui/card';
import { ApplicationData, useApplicationService } from '@/services/applicationService';
import { useToast } from '@/hooks/use-toast';
import ConfirmationDialog from '@/components/admin/applications/ConfirmationDialog';
import ApplicationSearch from '@/components/admin/applications/ApplicationSearch';
import RefreshButton from '@/components/admin/applications/RefreshButton';
import ApplicationTable from '@/components/admin/applications/ApplicationTable';

const ClientAppManagement: React.FC = () => {
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<ApplicationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<ApplicationData | null>(null);
  const [confirmAction, setConfirmAction] = useState<'approve' | 'pending' | 'delete'>('approve');
  
  const { fetchApplications, updateApplicationStatus, deleteApplication } = useApplicationService();
  const { toast } = useToast();

  const loadApplications = async () => {
    try {
      setIsLoading(true);
      console.log("Starting to load applications...");
      const data = await fetchApplications();
      console.log("Applications loaded:", data);
      setApplications(data);
      setFilteredApplications(data);
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
  };

  useEffect(() => {
    loadApplications();
  }, []);

  useEffect(() => {
    const filtered = applications.filter(app => 
      (app.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      app.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.status.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredApplications(filtered);
  }, [searchTerm, applications]);

  const openConfirmDialog = (app: ApplicationData, action: 'approve' | 'pending' | 'delete') => {
    setSelectedApplication(app);
    setConfirmAction(action);
    setConfirmDialogOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedApplication) return;
    
    try {
      if (confirmAction === 'delete') {
        await deleteApplication(selectedApplication.id);
        // Remove the application from the local state
        setApplications(prev => prev.filter(app => app.id !== selectedApplication.id));
      } else {
        const newStatus = confirmAction === 'approve' ? 'approved' : 'pending';
        await updateApplicationStatus(selectedApplication.id, newStatus);
        // Update the application status in local state
        setApplications(prev => prev.map(app => 
          app.id === selectedApplication.id ? {...app, status: newStatus} : app
        ));
      }
      
      toast({
        title: confirmAction === 'delete' 
          ? 'Application Deleted' 
          : `Status Updated to ${confirmAction === 'approve' ? 'Approved' : 'Pending'}`,
        description: confirmAction === 'delete'
          ? 'Application has been permanently removed.'
          : 'Application status has been updated successfully.',
      });
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

  const handleCloseDialog = () => {
    setConfirmDialogOpen(false);
    setSelectedApplication(null);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadApplications();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <ApplicationSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <RefreshButton isRefreshing={isRefreshing} handleRefresh={handleRefresh} />
        </div>
        
        <Card>
          <ApplicationTable 
            applications={filteredApplications}
            isLoading={isLoading}
            openConfirmDialog={openConfirmDialog}
          />
        </Card>
      </div>
      
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
