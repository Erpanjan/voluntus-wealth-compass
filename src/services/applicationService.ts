
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ApplicationData {
  id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  status: string;
  consultation_date: string | null;
  consultation_time: string | null;
  consultation_type: string | null;
  created_at: string;
  updated_at: string;
  has_questionnaire: boolean;
}

export interface ApplicationDetail extends ApplicationData {
  address: string | null;
  preferred_communication: string | null;
  media_account_number: string | null;
  questionnaire?: QuestionnaireData | null;
}

export interface QuestionnaireData {
  id: string;
  age_group: string | null;
  income_level: string | null;
  net_worth: string | null;
  investment_knowledge: string | null; 
  investment_experience: string | null;
  complex_products: number | null;
  investment_composition: string | null;
  behavioral_biases: string | null;
  investment_goals: string | null;
  risk_tolerance: string | null;
  time_horizon: string | null;
  additional_info: string | null;
  completed: boolean | null;
  answers_json: any | null;
}

export const useApplicationService = () => {
  const { toast } = useToast();
  
  // Fetch all applications (submitted and approved)
  const fetchApplications = async (): Promise<ApplicationData[]> => {
    try {
      console.log('Fetching client applications from Supabase...');
      
      // Get onboarding data for submitted and approved applications
      const { data: applications, error } = await supabase
        .from('onboarding_data')
        .select(`
          id, 
          first_name, 
          last_name, 
          email, 
          phone,
          status,
          consultation_date,
          consultation_time,
          consultation_type,
          created_at,
          updated_at
        `)
        .in('status', ['submitted', 'approved'])
        .order('updated_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching applications:', error);
        throw error;
      }
      
      // Check if each user has completed a questionnaire
      const enhancedApplications = await Promise.all(applications.map(async (app) => {
        const { count, error: countError } = await supabase
          .from('questionnaire_responses')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', app.id);
        
        return {
          ...app,
          has_questionnaire: !countError && count ? count > 0 : false
        };
      }));
      
      console.log(`Fetched ${enhancedApplications?.length || 0} applications`);
      return enhancedApplications || [];
    } catch (error: any) {
      console.error('Error in fetchApplications:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch applications. Please try again.',
        variant: 'destructive',
      });
      return [];
    }
  };
  
  // Fetch detailed application data for a single user
  const fetchApplicationDetail = async (userId: string): Promise<ApplicationDetail | null> => {
    try {
      console.log(`Fetching detailed application for user: ${userId}`);
      
      // Get onboarding data
      const { data: application, error } = await supabase
        .from('onboarding_data')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching application details:', error);
        throw error;
      }
      
      if (!application) {
        return null;
      }
      
      // Get questionnaire data if available
      const { data: questionnaire, error: questionnaireError } = await supabase
        .from('questionnaire_responses')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (questionnaireError) {
        console.error('Error fetching questionnaire:', questionnaireError);
      }
      
      return {
        ...application,
        questionnaire: questionnaire || null
      };
    } catch (error: any) {
      console.error('Error in fetchApplicationDetail:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch application details. Please try again.',
        variant: 'destructive',
      });
      return null;
    }
  };
  
  // Update application status (approve or reject)
  const updateApplicationStatus = async (userId: string, status: 'approved' | 'rejected'): Promise<boolean> => {
    try {
      console.log(`Updating application status for user ${userId} to ${status}`);
      
      // Update onboarding_data status
      const { error: statusError } = await supabase
        .from('onboarding_data')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
      
      if (statusError) {
        console.error('Error updating application status:', statusError);
        throw statusError;
      }
      
      // If approving, also update the profile is_active status
      if (status === 'approved') {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ 
            is_active: true,
            updated_at: new Date().toISOString()
          })
          .eq('id', userId);
        
        if (profileError) {
          console.error('Error updating profile status:', profileError);
          // Continue despite profile update error, but log it
        }
      }
      
      toast({
        title: 'Success',
        description: `Application ${status === 'approved' ? 'approved' : 'rejected'} successfully.`,
      });
      
      return true;
    } catch (error: any) {
      console.error('Error in updateApplicationStatus:', error);
      toast({
        title: 'Error',
        description: `Failed to ${status === 'approved' ? 'approve' : 'reject'} application.`,
        variant: 'destructive',
      });
      return false;
    }
  };
  
  return {
    fetchApplications,
    fetchApplicationDetail,
    updateApplicationStatus
  };
};
