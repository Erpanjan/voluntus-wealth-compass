
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Calendar } from "lucide-react";

// Import onboarding steps
import Welcome from '@/components/onboarding/Welcome';
import ProfileCreation from '@/components/onboarding/ProfileCreation';
import ConsultationScheduling from '@/components/onboarding/ConsultationScheduling';
import PendingApproval from '@/components/onboarding/PendingApproval';
import PersonalizeAI from '@/components/onboarding/PersonalizeAI';

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completeConsultation, setCompleteConsultation] = useState(false);
  const [showConsultationScheduling, setShowConsultationScheduling] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Steps in the onboarding process
  const steps = [
    { name: 'Welcome', component: <Welcome /> },
    { name: 'Profile', component: <ProfileCreation /> },
    { 
      name: 'Next Steps', 
      component: (
        <div className="space-y-8">
          <h1 className="text-3xl font-semibold mb-6">Complete Your Onboarding</h1>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Financial Questionnaire Card */}
            <div className="border rounded-lg p-6 h-full">
              <div className="flex items-start gap-4 h-full flex-col">
                <div className="flex items-center gap-4 w-full">
                  <div className="flex-shrink-0 bg-black text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <h3 className="text-xl font-semibold">Financial Questionnaire</h3>
                </div>
                
                <div className="bg-amber-50 text-amber-800 px-3 py-2 rounded-md text-sm my-2 w-full">
                  This questionnaire is optional and can be completed later
                </div>
                
                <p className="text-gray-600 flex-grow my-4">
                  Complete our financial questionnaire to help us understand your goals and create a personalized investment strategy.
                </p>
                
                <div className="w-full">
                  <Button 
                    variant="secondary"
                    className="flex items-center w-full md:w-auto"
                    onClick={() => navigate('/questionnaire')}
                  >
                    Start Questionnaire
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Consultation Scheduling Card */}
            <div className="border rounded-lg p-6 h-full">
              <div className="flex items-start gap-4 h-full flex-col">
                <div className="flex items-center gap-4 w-full">
                  <div className="flex-shrink-0 bg-black text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                  <h3 className="text-xl font-semibold">Consultation</h3>
                </div>
                
                <div className="bg-blue-50 text-blue-800 px-3 py-2 rounded-md text-sm my-2 w-full">
                  This step is required to activate your account
                </div>
                
                <p className="text-gray-600 flex-grow my-4">
                  Schedule a meeting with your financial advisor to discuss your portfolio and verify your information.
                </p>
                
                <div className="w-full">
                  <Button 
                    variant="secondary"
                    className="flex items-center w-full md:w-auto"
                    onClick={() => setShowConsultationScheduling(true)}
                  >
                    Schedule Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {showConsultationScheduling && (
            <div className="border-t my-8 pt-8">
              <h2 className="text-2xl font-semibold mb-6">Schedule Your Consultation</h2>
              <div id="consultation-component">
                <ConsultationScheduling setCompleted={setCompleteConsultation} />
              </div>
            </div>
          )}
        </div>
      )
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
      {/* Header */}
      <header className="border-b py-4">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <span className="font-bold text-xl">VOLUNTUS</span>
          </Link>
          {currentStep < 3 && (
            <Button variant="link" onClick={() => navigate('/login')}>
              Exit Setup
            </Button>
          )}
        </div>
      </header>

      {/* Main content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-3xl mx-auto">
          {steps[currentStep].component}
          
          <div className="flex justify-between mt-10">
            {currentStep > 0 && currentStep < 3 && (
              <Button 
                variant="outline"
                onClick={() => {
                  setCurrentStep(currentStep - 1);
                }}
              >
                Back
              </Button>
            )}
            
            {currentStep === 0 && (
              <Button 
                variant="outline" 
                onClick={handleSkip}
              >
                Skip Welcome
              </Button>
            )}

            {currentStep === 4 && (
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
