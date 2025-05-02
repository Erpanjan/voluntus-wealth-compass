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
  consultation: {
    completed: boolean;
    type: string;
    date: string;
    time: string;
  };
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

      // Update localStorage with the latest data
      localStorage.setItem('onboardingDraft', JSON.stringify(newFormData));

      toast({
        title: 'Success',
        description: status === 'draft' ? 'Draft saved successfully' : 'Application submitted successfully',
      });

      return true;
    } catch (error) {
      console.error('Error saving onboarding data:', error);
      toast({
        title: 'Error',
        description: 'Failed to save your data. Please try again.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setSaving(false);
    }
  };

  // Handler for updating profile data
  const updateProfileData = (profileData: Partial<OnboardingFormData['profile']>) => {
    setFormData(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        ...profileData,
      },
    }));
  };

  // Handler for updating consultation data
  const updateConsultationData = (consultationData: Partial<OnboardingFormData['consultation']>) => {
    setFormData(prev => ({
      ...prev,
      consultation: {
        ...prev.consultation,
        ...consultationData,
      },
    }));
  };

  // Handler for submitting the form
  const handleSubmit = async () => {
    return await saveOnboardingData(formData, 'submitted');
  };

  // Handler for saving a draft
  const handleSaveDraft = async () => {
    return await saveOnboardingData(formData, 'draft');
  };

  return {
    formData,
    loading,
    saving,
    updateProfileData,
    updateConsultationData,
    handleSubmit,
    handleSaveDraft,
  };
}
