
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import OnboardingHeader from '@/components/onboarding/OnboardingHeader';
import { useOnboardingForm } from '@/hooks/use-onboarding-form';
import ConsolidatedOnboarding from '@/components/onboarding/ConsolidatedOnboarding';

const Onboarding = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Get form data and update methods from the custom hook
  const { 
    formData, 
    updateProfileData, 
    updateQuestionnaireData, 
    updateConsultationData 
  } = useOnboardingForm();

  // Handle saving draft explicitly
  const handleSaveDraft = () => {
    toast({
      title: "Draft Saved",
      description: "Your information has been saved. You can return to complete it later.",
    });
  };

  // Handle final submission
  const handleSubmit = () => {
    if (!formData.consultation.completed) {
      toast({
        title: "Required Step",
        description: "Please schedule a consultation to proceed.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Application Submitted",
      description: "Your application is now pending approval. We'll notify you when it's approved.",
    });
    
    // Clear draft data and move to approval
    localStorage.removeItem('onboardingDraft');
    
    // For demo purposes, simulate immediate approval
    setTimeout(() => {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('onboardingComplete', 'true');
      navigate('/dashboard');
    }, 3000);
  };

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
        />
      </div>
    </div>
  );
};

export default Onboarding;
