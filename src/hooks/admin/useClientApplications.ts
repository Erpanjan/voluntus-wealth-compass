
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ApplicationData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  created_at: string;
  updated_at: string;
  status: string;
  consultation_date: string;
  consultation_time: string;
  consultation_type: string;
}

export const useClientApplications = () => {
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<ApplicationData | null>(null);
  const { toast } = useToast();

  const fetchApplications = async () => {
    try {
      console.log('useClientApplications: Starting to fetch applications');
      setLoading(true);
      
      const { data, error } = await supabase
        .from('onboarding_data')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('useClientApplications: Error fetching applications:', error);
        throw error;
      }
      
      console.log('useClientApplications: Applications fetched successfully:', { 
        count: data?.length,
        firstItem: data && data.length > 0 ? {
          id: data[0].id,
          first_name: data[0].first_name,
          last_name: data[0].last_name,
          status: data[0].status
        } : 'No data',
        allItems: data
      });
      
      if (data) {
        setApplications(data as ApplicationData[]);
      }
    } catch (error: any) {
      console.error('useClientApplications: Error fetching applications:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch client applications',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getApplication = async (applicationId: string) => {
    try {
      const { data, error } = await supabase
        .from('onboarding_data')
        .select('*')
        .eq('id', applicationId)
        .single();
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setSelectedApplication(data as ApplicationData);
        return data as ApplicationData;
      }
      
      return null;
    } catch (error: any) {
      console.error('Error fetching application details:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch application details',
        variant: 'destructive'
      });
      return null;
    }
  };

  const updateApplicationStatus = async (applicationId: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('onboarding_data')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', applicationId);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setApplications(prevApplications => 
        prevApplications.map(app => 
          app.id === applicationId ? { ...app, status } : app
        )
      );

      if (selectedApplication && selectedApplication.id === applicationId) {
        setSelectedApplication({ ...selectedApplication, status });
      }
      
      toast({
        title: 'Success',
        description: `Application ${status === 'approved' ? 'approved' : 'rejected'} successfully.`,
      });
      
      return true;
    } catch (error: any) {
      console.error(`Error ${status} application:`, error);
      toast({
        title: 'Error',
        description: `Failed to ${status} application`,
        variant: 'destructive'
      });
      return false;
    }
  };

  return {
    applications,
    loading,
    selectedApplication,
    fetchApplications,
    getApplication,
    setSelectedApplication,
    updateApplicationStatus
  };
};
