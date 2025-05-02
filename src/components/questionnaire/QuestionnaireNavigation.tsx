
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Save, Loader2 } from 'lucide-react';

interface QuestionnaireNavigationProps {
  currentStep: number;
  totalSteps: number;
  submitted: boolean;
  onPrevious: () => void;
  onSave: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

const QuestionnaireNavigation: React.FC<QuestionnaireNavigationProps> = ({
  currentStep,
  totalSteps,
  submitted,
  onPrevious,
  onSave,
  onNext,
  onSubmit
}) => {
  if (submitted) {
    return null;
  }
  
  return (
    <div className="flex justify-between mt-8">
      <Button 
        variant="outline" 
        onClick={onPrevious}
        disabled={currentStep === 0}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Previous
      </Button>
      
      <Button 
        variant="outline" 
        onClick={onSave}
      >
        <Save className="h-4 w-4 mr-2" />
        Save Progress
      </Button>
      
      {currentStep < totalSteps - 1 ? (
        <Button 
          onClick={onNext}
        >
          Next
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      ) : (
        <Button 
          onClick={onSubmit}
          disabled={submitted}
          className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
        >
          {submitted ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit"
          )}
        </Button>
      )}
    </div>
  );
};

export default QuestionnaireNavigation;
