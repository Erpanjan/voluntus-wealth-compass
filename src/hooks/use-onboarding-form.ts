import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Types for our form state
export interface OnboardingFormData {
  profile: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    preferredCommunication: string;
    mediaAccountNumber: string;
    address: string;
    imageUrl: string | null;
  };
  questionnaire: {
    completed: boolean;
    answers: Record<string, any>;
  };
  consultation: {
    completed: boolean;
    type: string;
    date: string;
    time: string;
  };
}

// Define an interface for the questionnaire response data
interface QuestionnaireResponseData {
  id: string;
  user_id: string;
  completed?: boolean;
  investment_goals?: string;
  risk_tolerance?: string;
  time_horizon?: string;
  additional_info?: string;
  age_group?: string;
  income_level?: string;
  net_worth?: string;
  investment_knowledge?: string;
  investment_experience?: string;
  complex_products?: number;
  investment_composition?: string;
  behavioral_biases?: string;
  answers_json?: string;
  created_at: string;
  updated_at: string;
}

export function useOnboarding() {
  
}

export function useOnboardingForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  // Initialize form data with default values
  const initialFormData: OnboardingFormData = {
    profile: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      preferredCommunication: '',
      mediaAccountNumber: '',
      address: '',
      imageUrl: null,
    },
    questionnaire: {
      completed: false,
      answers: {},
    },
    consultation: {
      completed: false,
      type: '',
      date: '',
      time: '',
    },
  };

  const [formData, setFormData] = useState<OnboardingFormData>(initialFormData);

  // Load data from Supabase on mount
  useEffect(() => {
    async function loadOnboardingData() {
      try {
        setLoading(true);
        
        // Get the current user session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          // If no session, try to load from localStorage as fallback
          const savedData = localStorage.getItem('onboardingDraft');
          if (savedData) {
            setFormData(JSON.parse(savedData));
          }
          setLoading(false);
          return;
        }

        // Fetch onboarding data
        const { data: onboardingData, error: onboardingError } = await supabase
          .from('onboarding_data')
          .select('*')
          .single();

        if (onboardingError && onboardingError.code !== 'PGRST116') {
          // PGRST116 is "no rows returned" - not an error for us
          console.error('Error fetching onboarding data:', onboardingError);
          toast({
            title: 'Error',
            description: 'Failed to load your application data',
            variant: 'destructive',
          });
        }

        // Fetch questionnaire responses
        const { data: questionnaireData, error: questionnaireError } = await supabase
          .from('questionnaire_responses')
          .select('*')
          .eq('user_id', session.user.id)
          .single();

        if (questionnaireError && questionnaireError.code !== 'PGRST116') {
          console.error('Error fetching questionnaire data:', questionnaireError);
        }

        // Cast to our interface for type safety
        const typedQuestionnaireData = questionnaireData as QuestionnaireResponseData | null;

        if (onboardingData) {
          // Map database fields to form fields
          const updatedFormData = {
            profile: {
              firstName: onboardingData.first_name || '',
              lastName: onboardingData.last_name || '',
              email: onboardingData.email || '',
              phone: onboardingData.phone || '',
              preferredCommunication: onboardingData.preferred_communication || '',
              mediaAccountNumber: onboardingData.media_account_number || '',
              address: onboardingData.address || '',
              imageUrl: onboardingData.image_url || null,
            },
            questionnaire: {
              completed: typedQuestionnaireData?.completed || false,
              answers: {
                investmentGoals: typedQuestionnaireData?.investment_goals || '',
                riskTolerance: typedQuestionnaireData?.risk_tolerance || '',
                timeHorizon: typedQuestionnaireData?.time_horizon || '',
                additionalInfo: typedQuestionnaireData?.additional_info || '',
                // Add the new fields
                ageGroup: typedQuestionnaireData?.age_group || '',
                income: typedQuestionnaireData?.income_level || '',
                netWorth: typedQuestionnaireData?.net_worth || '',
                investmentKnowledge: typedQuestionnaireData?.investment_knowledge || '',
                investmentExperience: typedQuestionnaireData?.investment_experience || '',
                complexProducts: typedQuestionnaireData?.complex_products || null,
                investmentComposition: typedQuestionnaireData?.investment_composition || '',
                behavioralBiases: typedQuestionnaireData?.behavioral_biases || '',
                // Load from answers_json if available
                ...(typedQuestionnaireData?.answers_json ? JSON.parse(typedQuestionnaireData.answers_json) : {}),
              },
            },
            consultation: {
              completed: !!(onboardingData.consultation_type && onboardingData.consultation_date && onboardingData.consultation_time),
              type: onboardingData.consultation_type || '',
              date: onboardingData.consultation_date || '',
              time: onboardingData.consultation_time || '',
            },
          };

          setFormData(updatedFormData);
          
          // Update localStorage with the latest data
          localStorage.setItem('onboardingDraft', JSON.stringify(updatedFormData));
        } else {
          // If no data in Supabase, try to load from localStorage as fallback
          const savedData = localStorage.getItem('onboardingDraft');
          if (savedData) {
            setFormData(JSON.parse(savedData));
          }
        }
      } catch (error) {
        console.error('Error in loadOnboardingData:', error);
      } finally {
        setLoading(false);
      }
    }

    loadOnboardingData();
  }, [toast]);

  // Save data to Supabase and localStorage
  const saveOnboardingData = async (newFormData: OnboardingFormData, status: 'draft' | 'submitted' = 'draft') => {
    try {
      setSaving(true);
      
      // Get the current user session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // If no session, only save to localStorage
        localStorage.setItem('onboardingDraft', JSON.stringify(newFormData));
        setSaving(false);
        return;
      }

      // Save profile and consultation data to onboarding_data table
      const { error: onboardingError } = await supabase
        .from('onboarding_data')
        .upsert({
          id: session.user.id,
          first_name: newFormData.profile.firstName,
          last_name: newFormData.profile.lastName,
          email: newFormData.profile.email,
          phone: newFormData.profile.phone,
          preferred_communication: newFormData.profile.preferredCommunication,
          media_account_number: newFormData.profile.mediaAccountNumber,
          address: newFormData.profile.address,
          image_url: newFormData.profile.imageUrl,
          consultation_type: newFormData.consultation.type,
          consultation_date: newFormData.consultation.date || null,
          consultation_time: newFormData.consultation.time,
          status: status,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'id' });

      if (onboardingError) {
        throw onboardingError;
      }

      // Save questionnaire data if it exists
      if (Object.keys(newFormData.questionnaire.answers).length > 0) {
        const { error: questionnaireError } = await supabase
          .from('questionnaire_responses')
          .upsert({
            user_id: session.user.id,
            completed: newFormData.questionnaire.completed,
            investment_goals: newFormData.questionnaire.answers.investmentGoals || null,
            risk_tolerance: newFormData.questionnaire.answers.riskTolerance || null,
            time_horizon: newFormData.questionnaire.answers.timeHorizon || null,
            additional_info: newFormData.questionnaire.answers.additionalInfo || null,
            age_group: newFormData.questionnaire.answers.ageGroup || null,
            income_level: newFormData.questionnaire.answers.income || null,
            net_worth: newFormData.questionnaire.answers.netWorth || null,
            investment_knowledge: newFormData.questionnaire.answers.investmentKnowledge || null,
            investment_experience: newFormData.questionnaire.answers.investmentExperience || null,
            complex_products: newFormData.questionnaire.answers.complexProducts || null,
            investment_composition: newFormData.questionnaire.answers.investmentComposition || null,
            behavioral_biases: newFormData.questionnaire.answers.behavioralBiases || null,
            answers_json: JSON.stringify(newFormData.questionnaire.answers),
            updated_at: new Date().toISOString(),
          }, { onConflict: 'user_id' });

        if (questionnaireError) {
          throw questionnaireError;
        }
      }

      // Update localStorage with the latest data
      localStorage.setItem('onboardingDraft', JSON.stringify(newFormData));
      
      return true;
    } catch (error) {
      console.error('Error saving onboarding data:', error);
      toast({
        title: 'Error',
        description: 'Failed to save your application data',
        variant: 'destructive',
      });
      return false;
    } finally {
      setSaving(false);
    }
  };

  // Update individual form sections
  const updateProfileData = (profileData: Partial<OnboardingFormData['profile']>) => {
    setFormData(prev => ({
      ...prev,
      profile: { ...prev.profile, ...profileData }
    }));
  };

  const updateQuestionnaireData = (data: { completed: boolean; answers: Record<string, any> }) => {
    setFormData(prev => ({
      ...prev,
      questionnaire: { ...data }
    }));
  };

  const updateConsultationData = (consultationData: Partial<OnboardingFormData['consultation']>) => {
    setFormData(prev => ({
      ...prev,
      consultation: { ...prev.consultation, ...consultationData }
    }));
  };

  return {
    formData,
    loading,
    saving,
    updateProfileData,
    updateQuestionnaireData,
    updateConsultationData,
    saveOnboardingData
  };
}
