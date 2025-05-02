import { supabase } from '@/integrations/supabase/client';

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

export interface QuestionnaireResponse {
  id: string;
  user_id: string;
  investment_goals: string | null;
  risk_tolerance: string | null;
  time_horizon: string | null;
  additional_info: string | null;
  age_group: string | null;
  income_level: string | null;
  net_worth: string | null;
  investment_knowledge: string | null;
  investment_experience: string | null;
  complex_products: number | null;
  investment_composition: string | null;
  behavioral_biases: string | null;
  created_at: string;
  updated_at: string;
}

export const clientApplicationService = {
  async getApplications(): Promise<ApplicationData[]> {
    try {
      console.log('clientApplicationService: Fetching applications from Supabase...');
      
      const { data, error } = await supabase
        .from('onboarding_data')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('clientApplicationService: Error in getApplications:', error);
        throw error;
      }
      
      console.log('clientApplicationService: Successfully fetched data:', { 
        count: data?.length,
        firstItem: data && data.length > 0 ? data[0] : null,
        full: data 
      });
      
      return data as ApplicationData[];
    } catch (error) {
      console.error('clientApplicationService: Error fetching client applications:', error);
      throw error;
    }
  },
  
  async getApplicationById(id: string): Promise<ApplicationData | null> {
    try {
      const { data, error } = await supabase
        .from('onboarding_data')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        throw error;
      }
      
      return data as ApplicationData;
    } catch (error) {
      console.error(`Error fetching client application ${id}:`, error);
      throw error;
    }
  },
  
  async getQuestionnaireResponseByUserId(userId: string): Promise<QuestionnaireResponse | null> {
    try {
      const { data, error } = await supabase
        .from('questionnaire_responses')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (error) {
        throw error;
      }
      
      return data as QuestionnaireResponse;
    } catch (error) {
      console.error(`Error fetching questionnaire response for user ${userId}:`, error);
      throw error;
    }
  },
  
  async updateApplicationStatus(id: string, status: 'approved' | 'rejected'): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('onboarding_data')
        .update({ 
          status, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error(`Error updating client application ${id} status:`, error);
      throw error;
    }
  }
};
