
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
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();

  // Fetch applications on component mount
  useEffect(() => {
    console.log('ClientAppManagement: Component mounted, fetching applications...');
    fetchApplications();
  }, []);
  
  // Apply filters whenever applications, searchTerm, or statusFilter changes
  useEffect(() => {
    console.log('ClientAppManagement: Applying filters with', { 
      applicationsCount: applications.length, 
      searchTerm, 
      statusFilter 
    });
    applyFilters();
  }, [applications, searchTerm, statusFilter]);
  
  const fetchApplications = async () => {
    try {
      console.log('ClientAppManagement: Starting to fetch applications');
      setLoading(true);
      const data = await clientApplicationService.getApplications();
      console.log('ClientAppManagement: Fetched applications data:', data);
      setApplications(data);
    } catch (error) {
      console.error('ClientAppManagement: Error fetching applications:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch client applications',
        variant: 'destructive'
      });
    } finally {
      console.log('ClientAppManagement: Setting loading to false');
      setLoading(false);
    }
  };
  
  const applyFilters = () => {
    let filtered = [...applications];
    console.log('ClientAppManagement: Starting to apply filters on', filtered.length, 'applications');
    
    // Apply search term filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        app => 
          `${app.first_name} ${app.last_name}`.toLowerCase().includes(searchLower) ||
          (app.email && app.email.toLowerCase().includes(searchLower))
      );
      console.log('ClientAppManagement: After search filter:', filtered.length, 'applications remain');
    }
    
    // Apply status filter
    if (statusFilter && statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
      console.log('ClientAppManagement: After status filter:', filtered.length, 'applications remain');
    }
    
    console.log('ClientAppManagement: Setting filtered applications:', filtered);
    setFilteredApplications(filtered);
  };
  
  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
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
        <div className="mb-4">
          <p className="text-sm text-gray-500">
            {loading ? 'Loading applications...' : 
             `Found ${filteredApplications.length} application(s) ${applications.length > 0 ? `out of ${applications.length} total` : ''}`}
          </p>
        </div>
        
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
