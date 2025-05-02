
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import OnboardingHeader from '@/components/onboarding/OnboardingHeader';
import OnboardingProgressIndicator from '@/components/onboarding/OnboardingProgressIndicator';
import OnboardingNavigation from '@/components/onboarding/OnboardingNavigation';

// Import onboarding steps
import Welcome from '@/components/onboarding/Welcome';
import ProfileCreation from '@/components/onboarding/ProfileCreation';
import NextStepsSelection from '@/components/onboarding/NextStepsSelection';
import PendingApproval from '@/components/onboarding/PendingApproval';
import PersonalizeAI from '@/components/onboarding/PersonalizeAI';

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completeConsultation, setCompleteConsultation] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Steps in the onboarding process
  const steps = [
    { name: 'Welcome', component: <Welcome /> },
    { name: 'Profile', component: <ProfileCreation /> },
    { 
      name: 'Next Steps', 
      component: <NextStepsSelection 
        setCompleteConsultation={setCompleteConsultation} 
      /> 
    },
    { name: 'Pending Approval', component: <PendingApproval /> },
    { name: 'Personalize AI', component: <PersonalizeAI /> }
  ];

  const handleNext = () => {
    // If on the questionnaire/consultation step, check if consultation is completed
    if (currentStep === 2 && !completeConsultation) {
      // Cannot skip consultation scheduling
      toast({
        title: "Required Step",
        description: "Please schedule a consultation to proceed.",
        variant: "destructive"
      });
      return;
    }

    // If on the approval step, simulate approval after a delay
    if (currentStep === 3) {
      setTimeout(() => {
        setCurrentStep(4);
      }, 2000);
      return;
    }

    // If this is the final step, redirect to dashboard
    if (currentStep === 4) {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('onboardingComplete', 'true');
      navigate('/dashboard');
      return;
    }

    // Move to next step
    setCurrentStep(currentStep + 1);
  };

  const handleSkip = () => {
    if (currentStep === 0) {
      // Skip welcome
      setCurrentStep(1);
    } else if (currentStep === 4) {
      // If last step (Personalize AI), skip to dashboard
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('onboardingComplete', 'true');
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <OnboardingHeader currentStep={currentStep} />

      {/* Main content */}
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-3xl mx-auto">
          {steps[currentStep].component}
          
          <OnboardingNavigation 
            currentStep={currentStep} 
            totalSteps={steps.length}
            handleBack={() => setCurrentStep(currentStep - 1)}
            handleNext={handleNext}
            handleSkip={handleSkip}
          />
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
