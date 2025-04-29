
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

// Import onboarding steps
import Welcome from '@/components/onboarding/Welcome';
import ProfileCreation from '@/components/onboarding/ProfileCreation';
import ConsultationScheduling from '@/components/onboarding/ConsultationScheduling';
import { ArrowRight } from 'lucide-react';

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [schedulingComplete, setSchedulingComplete] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Steps in the onboarding process
  const steps = [
    { name: 'Welcome', component: <Welcome /> },
    { name: 'Profile', component: <ProfileCreation /> },
    { 
      name: 'Required Steps',
      component: <AccountActivationSteps 
                  setSchedulingComplete={setSchedulingComplete} 
                  navigate={navigate} 
                />
    }
  ];

  const handleNext = () => {
    // If on the final step with scheduling completed, redirect to dashboard
    if (currentStep === 2 && schedulingComplete) {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('onboardingComplete', 'true');
      navigate('/dashboard');
      return;
    }
    
    // If on the final step without scheduling, show warning
    if (currentStep === 2 && !schedulingComplete) {
      toast({
        title: "Required Step",
        description: "Please schedule a consultation to proceed.",
        variant: "destructive"
      });
      return;
    }

    // Move to next step
    setCurrentStep(currentStep + 1);
  };

  const handleSkip = () => {
    if (currentStep === 0) {
      // Skip welcome
      setCurrentStep(1);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b py-4">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/f02f35c5-3319-4467-ac99-5ee97c405c11.png" 
              alt="Voluntus" 
              className="h-10" 
            />
          </Link>
          {currentStep < 2 && (
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
            {currentStep > 0 && currentStep < 2 && (
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
            
            {currentStep < 2 && (
              <Button 
                onClick={handleNext}
                className="ml-auto"
              >
                Continue
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// New component for account activation steps
const AccountActivationSteps = ({ setSchedulingComplete, navigate }) => {
  return (
    <div>
      <div className="text-center mb-12">
        <Avatar className="h-20 w-20 mx-auto mb-4">
          <AvatarFallback className="bg-gray-200">
            VP
          </AvatarFallback>
        </Avatar>
        <h1 className="text-2xl font-semibold mb-2">Account Opening in Progress</h1>
        <p className="text-gray-600">
          Welcome to Voluntus! Please complete the following steps to activate your account.
        </p>
      </div>

      <h2 className="text-xl font-bold mb-6">Required Steps</h2>

      {/* Financial Questionnaire - Non-mandatory but recommended */}
      <div className="border rounded-lg mb-6 overflow-hidden">
        <div className="p-6">
          <div className="flex items-start">
            <div className="bg-black text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">
              <span>1</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Complete Financial Questionnaire</h3>
              <p className="text-gray-600 mb-4">
                This helps us understand your financial goals and create a personalized investment strategy.
              </p>
              <Button 
                variant="outline" 
                className="flex items-center"
                onClick={() => navigate('/questionnaire')}
              >
                Start Questionnaire <ArrowRight className="ml-2" size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Consultation Scheduling - Mandatory */}
      <div className="border rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex items-start">
            <div className="bg-black text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">
              <span>2</span>
            </div>
            <div className="w-full">
              <h3 className="text-lg font-semibold">Schedule a Consultation</h3>
              <p className="text-gray-600 mb-4">
                Meet with your financial advisor to discuss your portfolio and verify your information.
              </p>
              <ConsultationScheduling setCompleted={setSchedulingComplete} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
