
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { QuestionnaireProvider, useQuestionnaire } from './QuestionnaireContext';
import BasicInfoSteps from './steps/BasicInfoSteps';
import InvestmentSteps from './steps/InvestmentSteps';
import GoalSelectionSteps from './steps/GoalSelectionSteps';
import GoalDetailSteps from './steps/GoalDetailSteps';
import FinalSteps from './steps/FinalSteps';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuestionnaireFormProps {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  onComplete: () => void;
}

// Component to render the actual question content
const QuestionContent: React.FC<{
  currentStep: number;
  onComplete: () => void;
}> = ({ currentStep, onComplete }) => {
  const { isLoading, saveProgress } = useQuestionnaire();
  const [retryCount, setRetryCount] = React.useState(0);
  const [loadingError, setLoadingError] = React.useState<string | null>(null);

  // Add a timeout to prevent infinite loading
  useEffect(() => {
    let timeoutId: number | undefined;
    
    if (isLoading) {
      timeoutId = window.setTimeout(() => {
        setLoadingError('Loading is taking longer than expected. Please try again.');
      }, 10000); // 10 seconds timeout
    } else if (loadingError) {
      setLoadingError(null); // Clear error when loading completes
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isLoading]);
  
  if (loadingError) {
    return (
      <div className="py-8">
        <Alert variant="warning" className="mb-6">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertDescription>{loadingError}</AlertDescription>
        </Alert>
        <Button 
          onClick={() => {
            setRetryCount(prev => prev + 1);
            setLoadingError(null);
            // Force reload data by saving progress
            saveProgress().catch(console.error);
          }}
          className="w-full"
        >
          Retry Loading
        </Button>
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="py-12 flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 text-amber-600 animate-spin mb-4" />
        <p className="text-gray-600">Loading your previous answers...</p>
      </div>
    );
  }
  
  // Determine which component to render based on the current step
  // Basic info questions (steps 0-2)
  if (currentStep <= 2) {
    return <BasicInfoSteps step={currentStep} />;
  }
  
  // Investment knowledge questions (steps 3-6)
  if (currentStep >= 3 && currentStep <= 6) {
    return <InvestmentSteps step={currentStep} />;
  }
  
  // Goal selection and prioritization (steps 7-9)
  if (currentStep >= 7 && currentStep <= 9) {
    return <GoalSelectionSteps step={currentStep} onNext={() => {}} />;
  }
  
  // Goal-specific questions (steps 10-13)
  if (currentStep >= 10 && currentStep <= 13) {
    return <GoalDetailSteps step={currentStep} />;
  }
  
  // Final questions and review (steps 14-15)
  if (currentStep >= 14) {
    return <FinalSteps step={currentStep} onComplete={onComplete} />;
  }
  
  return null;
};

const QuestionnaireForm: React.FC<QuestionnaireFormProps> = ({ 
  currentStep, 
  setCurrentStep,
  onComplete
}) => {
  return (
    <QuestionnaireProvider currentStep={currentStep} setCurrentStep={setCurrentStep}>
      <motion.div
        key={`question-${currentStep}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
        className="w-full"
      >
        <Card className="w-full">
          <CardContent className="p-6">
            <QuestionContent 
              currentStep={currentStep} 
              onComplete={onComplete} 
            />
          </CardContent>
        </Card>
      </motion.div>
    </QuestionnaireProvider>
  );
};

export default QuestionnaireForm;
