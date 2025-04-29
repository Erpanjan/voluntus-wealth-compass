
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

// Import onboarding steps
import Welcome from '@/components/onboarding/Welcome';
import ProfileCreation from '@/components/onboarding/ProfileCreation';
import Questionnaire from '@/components/onboarding/Questionnaire';
import ConsultationScheduling from '@/components/onboarding/ConsultationScheduling';
import PendingApproval from '@/components/onboarding/PendingApproval';
import PersonalizeAI from '@/components/onboarding/PersonalizeAI';

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [completeQuestionnaire, setCompleteQuestionnaire] = useState(false);
  const [completeConsultation, setCompleteConsultation] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Steps in the onboarding process
  const steps = [
    { name: 'Welcome', component: <Welcome /> },
    { name: 'Profile', component: <ProfileCreation /> },
    { name: 'Questionnaire', component: <Questionnaire setCompleted={setCompleteQuestionnaire} /> },
    { name: 'Consultation', component: <ConsultationScheduling setCompleted={setCompleteConsultation} /> },
    { name: 'Pending Approval', component: <PendingApproval /> },
    { name: 'Personalize AI', component: <PersonalizeAI /> }
  ];

  // Calculate progress percentage
  const calculateProgress = () => {
    return ((currentStep) / (steps.length - 1)) * 100;
  };

  const handleNext = () => {
    if (currentStep === 2 && !completeQuestionnaire) {
      // If on questionnaire step and not completed, allow skipping but show message
      toast({
        title: "Questionnaire Skipped",
        description: "You can complete the financial questionnaire later from your account settings.",
      });
    }

    if (currentStep === 3 && !completeConsultation) {
      // Cannot skip consultation scheduling
      toast({
        title: "Required Step",
        description: "Please schedule a consultation to proceed.",
        variant: "destructive"
      });
      return;
    }

    // If on the approval step, simulate approval after a delay
    if (currentStep === 4) {
      setTimeout(() => {
        setCurrentStep(5);
        setProgress(calculateProgress());
      }, 2000);
      return;
    }

    // If this is the final step, redirect to dashboard
    if (currentStep === 5) {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('onboardingComplete', 'true');
      navigate('/dashboard');
      return;
    }

    // Move to next step
    setCurrentStep(currentStep + 1);
    setProgress(calculateProgress());
  };

  const handleSkip = () => {
    if (currentStep === 5) {
      // If last step (Personalize AI), skip to dashboard
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('onboardingComplete', 'true');
      navigate('/dashboard');
    } else if (currentStep !== 3) { 
      // Can't skip consultation
      setCurrentStep(currentStep + 1);
      setProgress(calculateProgress());
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b py-4">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <span className="font-bold text-xl">VOLUNTUS</span>
          </Link>
          {currentStep < 4 && (
            <Button variant="link" onClick={() => navigate('/login')}>
              Exit Setup
            </Button>
          )}
        </div>
      </header>

      {/* Progress bar */}
      <div className="container mx-auto px-6 pt-4">
        <Progress value={progress} className="h-1" />
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          {steps.map((step, index) => (
            <div 
              key={index}
              className={`${index > currentStep ? 'opacity-50' : ''}`}
            >
              {step.name}
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-3xl mx-auto">
          {steps[currentStep].component}
          
          <div className="flex justify-between mt-10">
            {currentStep > 0 && currentStep < 4 && (
              <Button 
                variant="outline"
                onClick={() => {
                  setCurrentStep(currentStep - 1);
                  setProgress(calculateProgress());
                }}
              >
                Back
              </Button>
            )}
            
            {currentStep === 5 && (
              <Button 
                variant="outline" 
                onClick={handleSkip}
              >
                Skip for now
              </Button>
            )}
            
            <div className="ml-auto">
              <Button onClick={handleNext}>
                {currentStep === steps.length - 1 ? 'Complete Setup' : 'Continue'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
