
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
          
          {/* Financial Questionnaire Card */}
          <div className="border rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 bg-black text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-semibold">Complete Financial Questionnaire</h3>
                <p className="text-gray-600 mb-4">
                  This helps us understand your financial goals and create a personalized investment strategy.
                </p>
                <Button 
                  variant="secondary"
                  className="flex items-center"
                  onClick={() => navigate('/questionnaire')}
                >
                  Start Questionnaire
                </Button>
              </div>
            </div>
          </div>
          
          {/* Consultation Scheduling Card */}
          <div className="border rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 bg-black text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-semibold">Schedule a Consultation</h3>
                <p className="text-gray-600 mb-4">
                  Meet with your financial advisor to discuss your portfolio and verify your information.
                </p>
                
                <div className="bg-gray-200 rounded-md p-4">
                  <h4 className="font-medium mb-4">Consultation Options</h4>
                  
                  <div className="space-y-3">
                    <div className="bg-white rounded-md p-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar size={20} />
                        <span>Online Meeting</span>
                      </div>
                      <Button 
                        variant="secondary" 
                        size="sm"
                        onClick={() => {
                          const consultationComponent = document.getElementById('consultation-component');
                          if (consultationComponent) {
                            consultationComponent.scrollIntoView({ behavior: 'smooth' });
                          }
                        }}
                      >
                        Select Time
                      </Button>
                    </div>
                    
                    <div className="bg-white rounded-md p-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar size={20} />
                        <span>In-Person Meeting</span>
                      </div>
                      <Button 
                        variant="secondary" 
                        size="sm"
                        onClick={() => {
                          const consultationComponent = document.getElementById('consultation-component');
                          if (consultationComponent) {
                            consultationComponent.scrollIntoView({ behavior: 'smooth' });
                          }
                        }}
                      >
                        Select Time
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div id="consultation-component" className="mt-10 pt-4 border-t">
            <ConsultationScheduling setCompleted={setCompleteConsultation} />
          </div>
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

      {/* Main content - Progress bar removed */}
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
