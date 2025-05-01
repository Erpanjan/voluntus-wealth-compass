
import React from 'react';
import { Button } from '@/components/ui/button';

interface OnboardingNavigationProps {
  currentStep: number;
  totalSteps: number;
  handleBack: () => void;
  handleNext: () => void;
  handleSkip: () => void;
}

const OnboardingNavigation: React.FC<OnboardingNavigationProps> = ({
  currentStep,
  totalSteps,
  handleBack,
  handleNext,
  handleSkip
}) => {
  return (
    <div className="flex justify-between mt-10">
      {currentStep > 0 && currentStep < 3 && (
        <Button 
          variant="outline"
          onClick={handleBack}
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

      {currentStep === totalSteps - 1 && (
        <Button 
          variant="outline" 
          onClick={handleSkip}
        >
          Skip for now
        </Button>
      )}
      
      <div className="ml-auto">
        <Button onClick={handleNext}>
          {currentStep === totalSteps - 1 ? 'Complete Setup' : 'Continue'}
        </Button>
      </div>
    </div>
  );
};

export default OnboardingNavigation;
