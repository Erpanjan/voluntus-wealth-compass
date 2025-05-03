
import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card } from '@/components/ui/card';
import ClientAppTable from '@/components/admin/client-app/ClientAppTable';
import SearchBar from '@/components/admin/client-app/SearchBar';
import RefreshButton from '@/components/admin/client-app/RefreshButton';
import { useClientApplications } from '@/hooks/admin/useClientApplications';

const ClientAppManagement: React.FC = () => {
  const {
    applications,
    isLoading,
    isRefreshing,
    searchTerm,
    handleStatusChange,
    handleRefresh,
    handleSearchChange
  } = useClientApplications();

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight mb-2">Client Applications</h2>
          <p className="text-muted-foreground">
            Manage and review client onboarding applications.
          </p>
        </div>
        
        <div className="flex justify-between items-center">
          <SearchBar 
            searchTerm={searchTerm} 
            onSearchChange={handleSearchChange} 
          />
          <RefreshButton 
            onRefresh={handleRefresh} 
            isRefreshing={isRefreshing} 
          />
        </div>
        
        <Card>
          <div className="rounded-md border">
            <ClientAppTable 
              applications={applications} 
              isLoading={isLoading} 
              onStatusChange={handleStatusChange} 
            />
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default ClientAppManagement;
