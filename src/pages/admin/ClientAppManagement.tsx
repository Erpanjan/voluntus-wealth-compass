
import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ClientApplicationTable from '@/components/admin/applications/ClientApplicationTable';
import ApplicationsFilter from '@/components/admin/applications/ApplicationsFilter';
import ApplicationDetailsDialog from '@/components/admin/applications/ApplicationDetailsDialog';
import { useApplicationService, ApplicationData, ApplicationDetail } from '@/services/applicationService';

const ClientAppManagement = () => {
  // State for applications and filters
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<ApplicationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // State for application details dialog
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [applicationDetail, setApplicationDetail] = useState<ApplicationDetail | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  
  // Get application service functions
  const { 
    fetchApplications,
    fetchApplicationDetail,
    updateApplicationStatus
  } = useApplicationService();
  
  // Load applications on component mount
  useEffect(() => {
    loadApplications();
  }, []);
  
  // Filter applications whenever the search query or status filter changes
  useEffect(() => {
    filterApplications();
  }, [applications, searchQuery, statusFilter]);
  
  // Function to load applications
  const loadApplications = async () => {
    setIsLoading(true);
    try {
      const data = await fetchApplications();
      setApplications(data);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to filter applications based on search query and status filter
  const filterApplications = () => {
    let result = [...applications];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(app => app.status === statusFilter);
    }
    
    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(app => {
        const fullName = `${app.first_name || ''} ${app.last_name || ''}`.toLowerCase();
        const email = (app.email || '').toLowerCase();
        const phone = (app.phone || '').toLowerCase();
        
        return fullName.includes(query) || 
               email.includes(query) || 
               phone.includes(query);
      });
    }
    
    setFilteredApplications(result);
  };
  
  // Function to handle viewing application details
  const handleViewDetails = async (id: string) => {
    setSelectedId(id);
    setIsDetailLoading(true);
    try {
      const detail = await fetchApplicationDetail(id);
      setApplicationDetail(detail);
    } finally {
      setIsDetailLoading(false);
    }
  };
  
  // Function to handle approving an application
  const handleApprove = async (id: string) => {
    return await updateApplicationStatus(id, 'approved');
  };
  
  // Function to handle rejecting an application
  const handleReject = async (id: string) => {
    return await updateApplicationStatus(id, 'rejected');
  };
  
  // Function to close the detail dialog
  const handleCloseDetails = () => {
    setSelectedId(null);
    setApplicationDetail(null);
  };
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight">Client Applications</h1>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <ApplicationsFilter
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              onRefresh={loadApplications}
              isLoading={isLoading}
            />
            
            <ClientApplicationTable 
              applications={filteredApplications}
              isLoading={isLoading}
              onViewDetails={handleViewDetails}
            />
          </CardContent>
        </Card>
      </div>
      
      {/* Application Details Dialog */}
      <ApplicationDetailsDialog
        isOpen={selectedId !== null}
        onClose={handleCloseDetails}
        application={applicationDetail}
        isLoading={isDetailLoading}
        onApprove={handleApprove}
        onReject={handleReject}
        onRefresh={loadApplications}
      />
    </AdminLayout>
  );
};

export default ClientAppManagement;
