
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
        .select('id, status, first_name, last_name, email, phone, created_at');
      
      if (onboardingError) {
        console.error('Error fetching onboarding data:', onboardingError);
        throw onboardingError;
      }
      
      console.log('Fetched onboarding data:', onboardingData);
      
      if (!onboardingData || onboardingData.length === 0) {
        console.log('No onboarding data found');
        return [];
      }
      
      // Get questionnaire responses
      const { data: questionnaireData, error: questionnaireError } = await supabase
        .from('questionnaire_responses')
        .select('id, user_id, completed, created_at');
      
      if (questionnaireError) {
        console.error('Error fetching questionnaire data:', questionnaireError);
        // Don't throw here, we can still show onboarding data without questionnaire data
      }
      
      console.log('Fetched questionnaire data:', questionnaireData);
      
      // Create a map of questionnaire data by user_id
      const questionnaireMap = new Map();
      if (questionnaireData) {
        questionnaireData.forEach(item => {
          if (item.user_id) {
            questionnaireMap.set(item.user_id, {
              completed: item.completed || false,
              id: item.id
            });
          }
        });
      }
      
      // Map onboarding data to our ApplicationData format
      const applications = onboardingData.map(item => ({
        id: item.id,
        user_id: item.id, // Using onboarding data id as user_id
        first_name: item.first_name || '',
        last_name: item.last_name || '',
        email: item.email || '',
        phone: item.phone || '',
        status: item.status || 'pending',
        application_type: 'Onboarding',
        created_at: item.created_at,
        has_questionnaire: questionnaireMap.has(item.id),
        questionnaire_completed: questionnaireMap.get(item.id)?.completed || false
      }));
      
      console.log(`Fetched ${applications.length} applications as admin:`, applications);
      return applications;
    } catch (error: any) {
      console.error('Error in fetchApplications:', error);
      throw error; // Let the calling component handle the error
    }
  };
  
  const updateApplicationStatus = async (applicationId: string, status: string): Promise<void> => {
    try {
      console.log(`Updating application ${applicationId} status to ${status}`);
      const { error } = await supabase
        .from('onboarding_data')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', applicationId);
      
      if (error) {
        console.error('Error updating application status:', error);
        throw error;
      }
      
      console.log('Successfully updated application status');
    } catch (error: any) {
      console.error('Error updating application status:', error);
      throw error;
    }
  };
  
  const deleteApplication = async (applicationId: string): Promise<void> => {
    try {
      console.log('Deleting application and user account:', applicationId);
      
      // First delete any associated questionnaire responses
      const { error: questionnaireError } = await supabase
        .from('questionnaire_responses')
        .delete()
        .eq('user_id', applicationId);
      
      if (questionnaireError) {
        console.error('Error deleting questionnaire data:', questionnaireError);
        // Continue with deletion of onboarding data even if questionnaire deletion fails
      }
      
      // Delete the onboarding data
      const { error: onboardingError } = await supabase
        .from('onboarding_data')
        .delete()
        .eq('id', applicationId);
      
      if (onboardingError) {
        console.error('Error deleting onboarding data:', onboardingError);
        throw onboardingError;
      }
      
      // Delete the user from auth.users using Supabase edge function
      const { error: userDeletionError } = await supabase.functions.invoke('delete-user', {
        body: { user_id: applicationId }
      });
      
      if (userDeletionError) {
        console.error('Error deleting user account:', userDeletionError);
        throw userDeletionError;
      }
      
      console.log('Successfully deleted user account and application');
    } catch (error: any) {
      console.error('Error deleting application:', error);
      throw error;
    }
  };
  
  return {
    fetchApplications,
    updateApplicationStatus,
    deleteApplication
  };
};
