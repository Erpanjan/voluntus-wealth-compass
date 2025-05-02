
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import OnboardingHeader from '@/components/onboarding/OnboardingHeader';
import { useOnboardingForm } from '@/hooks/use-onboarding-form';
import ConsolidatedOnboarding from '@/components/onboarding/ConsolidatedOnboarding';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

const Onboarding = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Get form data and update methods from the custom hook
  const { 
    formData, 
    loading,
    saving,
    updateProfileData, 
    updateQuestionnaireData, 
    updateConsultationData,
    saveOnboardingData
  } = useOnboardingForm();

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      // If no session, redirect to login
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please log in to access the onboarding process.",
          variant: "destructive"
        });
        navigate('/login');
      }
    };
    
    checkAuth();
  }, [navigate, toast]);

  // Handle saving draft explicitly
  const handleSaveDraft = async () => {
    const success = await saveOnboardingData(formData, 'draft');
    
    if (success) {
      toast({
        title: "Draft Saved",
        description: "Your information has been saved. You can return to complete it later.",
      });
    }
  };

  // Handle final submission
  const handleSubmit = async () => {
    if (!formData.consultation.completed) {
      toast({
        title: "Required Step",
        description: "Please schedule a consultation to proceed.",
        variant: "destructive"
      });
      return;
    }

    // Extra validation for required fields
    if (!formData.profile.firstName || !formData.profile.lastName || !formData.profile.email || !formData.profile.phone) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in all required profile fields to proceed.",
        variant: "destructive"
      });
      return;
    }

    const success = await saveOnboardingData(formData, 'submitted');
    
    if (success) {
      toast({
        title: "Application Submitted",
        description: "Your application is now pending approval. We'll notify you when it's approved.",
      });
      
      // Clear localStorage draft since it's now submitted
      localStorage.removeItem('onboardingDraft');
      
      // For demo purposes, simulate immediate approval
      setTimeout(() => {
        localStorage.setItem('onboardingComplete', 'true');
        navigate('/dashboard');
      }, 3000);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 text-gray-400 animate-spin mb-4" />
        <p className="text-gray-600">Loading your application data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <OnboardingHeader currentStep={0} />
      
      <div className="container mx-auto px-6 py-8">
        <ConsolidatedOnboarding
          formData={formData}
          updateProfileData={updateProfileData}
          updateQuestionnaireData={updateQuestionnaireData}
          updateConsultationData={updateConsultationData}
          handleSubmit={handleSubmit}
          handleSaveDraft={handleSaveDraft}
          saving={saving}
        />
      </div>
    </div>
  );
};

export default Onboarding;
