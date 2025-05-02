
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface OnboardingProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const OnboardingProgressIndicator: React.FC<OnboardingProgressIndicatorProps> = ({
  currentStep,
  totalSteps
}) => {
  const progressPercentage = ((currentStep + 1) / totalSteps) * 100;
  
  return (
    <div className="w-full my-4">
      <div className="flex justify-between text-sm text-gray-500 mb-1">
        <span>Step {currentStep + 1} of {totalSteps}</span>
        <span>{Math.round(progressPercentage)}% Complete</span>
      </div>
      <Progress value={progressPercentage} className="h-2 bg-gray-200" />
    </div>
  );
};

export default OnboardingProgressIndicator;
