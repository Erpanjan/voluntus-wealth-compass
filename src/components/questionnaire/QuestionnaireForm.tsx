
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { QuestionnaireProvider } from './QuestionnaireContext';
import BasicInfoSteps from './steps/BasicInfoSteps';
import InvestmentSteps from './steps/InvestmentSteps';
import GoalSelectionSteps from './steps/GoalSelectionSteps';
import GoalDetailSteps from './steps/GoalDetailSteps';
import FinalSteps from './steps/FinalSteps';

interface QuestionnaireFormProps {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  onComplete: () => void;
}

const QuestionnaireForm: React.FC<QuestionnaireFormProps> = ({ 
  currentStep, 
  setCurrentStep,
  onComplete
}) => {
  // Function to handle step changes
  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  // Determine which component to render based on the current step
  const renderQuestion = () => {
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
      return <GoalSelectionSteps step={currentStep} onNext={handleNextStep} />;
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
            {renderQuestion()}
          </CardContent>
        </Card>
      </motion.div>
    </QuestionnaireProvider>
  );
};

export default QuestionnaireForm;
