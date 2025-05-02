
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { ApplicationData, clientApplicationService } from '@/services/clientApplicationService';
import ApplicationList from '@/components/admin/client-app/ApplicationList';
import ApplicationDetails from '@/components/admin/client-app/ApplicationDetails';
import ApplicationFilter from '@/components/admin/client-app/ApplicationFilter';

const ClientAppManagement = () => {
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<ApplicationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<ApplicationData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const { toast } = useToast();

  // Fetch applications on component mount
  useEffect(() => {
    fetchApplications();
  }, []);
  
  // Apply filters whenever applications, searchTerm, or statusFilter changes
  useEffect(() => {
    applyFilters();
  }, [applications, searchTerm, statusFilter]);
  
  const fetchApplications = async () => {
    try {
      setLoading(true);
      const data = await clientApplicationService.getApplications();
      setApplications(data);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch client applications',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const applyFilters = () => {
    let filtered = [...applications];
    
    // Apply search term filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        app => 
          `${app.first_name} ${app.last_name}`.toLowerCase().includes(searchLower) ||
          (app.email && app.email.toLowerCase().includes(searchLower))
      );
    }
    
    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(app => app.status === statusFilter);
    }
    
    setFilteredApplications(filtered);
  };
  
  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
  };
  
  const handleViewDetails = (application: ApplicationData) => {
    setSelectedApplication(application);
  };
  
  const handleCloseDetails = () => {
    setSelectedApplication(null);
  };
  
  const handleUpdateStatus = async (applicationId: string, status: 'approved' | 'rejected') => {
    try {
      const success = await clientApplicationService.updateApplicationStatus(applicationId, status);
      
      if (success) {
        // Update application in the local state
        setApplications(prevApplications => 
          prevApplications.map(app => 
            app.id === applicationId ? { ...app, status, updated_at: new Date().toISOString() } : app
          )
        );
        
        toast({
          title: 'Status Updated',
          description: `Application ${status === 'approved' ? 'approved' : 'rejected'} successfully`,
        });
        
        return true;
      }
      
      return false;
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${status} application`,
        variant: 'destructive'
      });
      
      return false;
    }
  };

  return (
    <AdminLayout>
      <div className="p-4">
        <h1 className="text-2xl font-semibold mb-6">Client Applications</h1>
        
        {/* Filters */}
        <ApplicationFilter 
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          onSearchChange={setSearchTerm}
          onStatusChange={setStatusFilter}
          onReset={handleResetFilters}
        />
        
        {/* Applications List */}
        <ApplicationList 
          applications={filteredApplications}
          loading={loading}
          onViewDetails={handleViewDetails}
          onUpdateStatus={handleUpdateStatus}
        />
        
        {/* Application Details Dialog */}
        <Dialog open={selectedApplication !== null} onOpenChange={() => handleCloseDetails()}>
          <DialogContent className="max-w-5xl p-0">
            {selectedApplication && (
              <ApplicationDetails 
                application={selectedApplication}
                onClose={handleCloseDetails}
                onUpdateStatus={handleUpdateStatus}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default ClientAppManagement;
