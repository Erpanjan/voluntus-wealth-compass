
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
    updateConsultationData,
    handleSubmit,
    handleSaveDraft
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
