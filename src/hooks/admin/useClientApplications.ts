
import { useState, useEffect, useCallback } from 'react';
import { ApplicationData, useApplicationService } from '@/services/applicationService';
import { useToast } from '@/hooks/use-toast';

export const useClientApplications = () => {
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<ApplicationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { fetchApplications, updateApplicationStatus } = useApplicationService();
  const { toast } = useToast();

  const loadApplications = useCallback(async () => {
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
  }, [fetchApplications, toast]);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredApplications(applications);
      return;
    }
    
    const searchTermLower = searchTerm.toLowerCase();
    const filtered = applications.filter(app => 
      (app.first_name?.toLowerCase().includes(searchTermLower) || 
      app.last_name?.toLowerCase().includes(searchTermLower) ||
      app.email?.toLowerCase().includes(searchTermLower) ||
      app.status.toLowerCase().includes(searchTermLower))
    );
    setFilteredApplications(filtered);
  }, [searchTerm, applications]);

  const handleStatusChange = async (applicationId: string, newStatus: string) => {
    try {
      await updateApplicationStatus(applicationId, newStatus);
      
      // Update local state
      setApplications(prev => prev.map(app => 
        app.id === applicationId ? {...app, status: newStatus} : app
      ));
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadApplications();
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  return {
    applications: filteredApplications,
    isLoading,
    isRefreshing,
    searchTerm,
    handleStatusChange,
    handleRefresh,
    handleSearchChange
  };
};
