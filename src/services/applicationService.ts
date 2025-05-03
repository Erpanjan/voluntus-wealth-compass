
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Define types for our application data
export interface ApplicationData {
  id: string;
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  status: string;
  application_type: string;
  created_at: string;
  has_questionnaire: boolean;
  questionnaire_completed?: boolean;
}

export const useApplicationService = () => {
  const { toast } = useToast();
  
  const fetchApplications = async (): Promise<ApplicationData[]> => {
    try {
      console.log('Fetching applications from Supabase as admin...');
      
      // First get onboarding data
      const { data: onboardingData, error: onboardingError } = await supabase
        .from('onboarding_data')
        .select('id, status, first_name, last_name, email, phone, created_at')
        .order('created_at', { ascending: false });
      
      if (onboardingError) {
        console.error('Error fetching onboarding data:', onboardingError);
        throw onboardingError;
      }
      
      // Get questionnaire responses
      const { data: questionnaireData, error: questionnaireError } = await supabase
        .from('questionnaire_responses')
        .select('id, user_id, completed, created_at');
      
      if (questionnaireError) {
        console.error('Error fetching questionnaire data:', questionnaireError);
        throw questionnaireError;
      }
      
      // Create a map of questionnaire data by user_id
      const questionnaireMap = new Map();
      questionnaireData?.forEach(item => {
        questionnaireMap.set(item.user_id, {
          completed: item.completed,
          id: item.id
        });
      });
      
      // Map onboarding data to our ApplicationData format
      const applications = onboardingData?.map(item => ({
        id: item.id,
        user_id: item.id, // Using onboarding data id as user_id
        first_name: item.first_name,
        last_name: item.last_name,
        email: item.email,
        phone: item.phone,
        status: item.status,
        application_type: 'Onboarding',
        created_at: item.created_at,
        has_questionnaire: questionnaireMap.has(item.id),
        questionnaire_completed: questionnaireMap.get(item.id)?.completed || false
      })) || [];
      
      console.log(`Fetched ${applications.length} applications as admin`);
      return applications;
    } catch (error: any) {
      console.error('Error in fetchApplications:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch applications. Please try again later.',
        variant: 'destructive',
      });
      return [];
    }
  };
  
  const updateApplicationStatus = async (applicationId: string, status: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('onboarding_data')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', applicationId);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Success',
        description: `Application status updated to ${status}.`,
      });
    } catch (error: any) {
      console.error('Error updating application status:', error);
      toast({
        title: 'Error',
        description: `Failed to update application status.`,
        variant: 'destructive',
      });
      throw error;
    }
  };
  
  return {
    fetchApplications,
    updateApplicationStatus
  };
};
