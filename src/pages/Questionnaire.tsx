
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft } from 'lucide-react';

// Import the Questionnaire component
import QuestionnaireComponent from '@/components/onboarding/Questionnaire';

const Questionnaire = () => {
  // Get questionnaire data from localStorage if it exists
  const [isCompleted, setIsCompleted] = useState<boolean>(() => {
    const savedData = localStorage.getItem('onboardingDraft');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      return parsedData?.questionnaire?.completed || false;
    }
    return false;
  });
  
  // Track current progress
  const [progress, setProgress] = useState<number>(() => {
    const savedData = localStorage.getItem('onboardingDraft');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      if (parsedData?.questionnaire?.completed) return 100;
      if (parsedData?.questionnaire?.answers) {
        // Calculate based on number of answered categories
        const answers = parsedData.questionnaire.answers;
        const mainCategories = [
          'ageGroup', 'incomeRange', 'netWorth', 'investmentKnowledge', 
          'investmentExperience', 'complexProducts', 'investmentComposition',
          'goalPriorities', 'goalRiskPreferences',
          'marketVolatilityResponse', 'behavioralBiases'
        ];
        
        let completedCount = mainCategories.filter(key => answers[key]).length;
        
        // Check goal-specific questions
        if (answers.goalHorizons && Object.keys(answers.goalHorizons).length > 0) completedCount++;
        if (answers.riskAppetite && Object.keys(answers.riskAppetite).length > 0) completedCount++;
        if (answers.absoluteRiskTolerance && Object.keys(answers.absoluteRiskTolerance).length > 0) completedCount++;
        
        return Math.min(Math.round((completedCount / 15) * 100), 99);
      }
    }
    return 0;
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();

  // Update questionnaire completion in localStorage
  const handleCompletion = () => {
    // Update localStorage with completed questionnaire status
    const savedData = localStorage.getItem('onboardingDraft');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      const updatedData = {
        ...parsedData,
        questionnaire: {
          ...parsedData.questionnaire,
          completed: true
        }
      };
      localStorage.setItem('onboardingDraft', JSON.stringify(updatedData));
    }
    
    toast({
      title: "Questionnaire Completed",
      description: "Thank you for completing the financial questionnaire. Your answers will help us provide better financial advice.",
    });
    
    // Navigate back to onboarding page
    navigate('/onboarding');
  };

  // Function to update progress state when questionnaire is updated
  const handleProgressUpdate = (percent: number) => {
    setProgress(percent);
  };

  // Handle questionnaire completion
  const handleQuestionnaireCompleted = (completed: boolean) => {
    setIsCompleted(completed);
    if (completed) {
      handleCompletion();
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header with progress */}
      <header className="border-b py-4 bg-white sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/onboarding')} 
                className="mr-2 text-amber-700 hover:text-amber-900 hover:bg-amber-50"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Onboarding
              </Button>
            </div>
            <div className="text-sm font-medium">{progress}% Complete</div>
          </div>
          <Progress 
            value={progress} 
            className="h-1.5 bg-amber-100" 
            style={{ '--tw-bg-opacity': 0.2 }}
          />
        </div>
      </header>

      {/* Main content */}
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <h1 className="text-2xl font-semibold">Financial Questionnaire</h1>
            </div>
            <p className="text-gray-600">
              Please complete this questionnaire to help us understand your financial situation and goals.
              This information will help us provide personalized recommendations.
            </p>
          </div>

          {/* Pass props to the Questionnaire component */}
          <QuestionnaireComponent 
            setCompleted={handleQuestionnaireCompleted}
            updateProgress={handleProgressUpdate}
          />

          <div className="flex justify-end mt-8">
            <Button 
              onClick={handleCompletion}
              disabled={!isCompleted}
              className="bg-amber-500 hover:bg-amber-600 text-white"
            >
              Complete & Return to Onboarding
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;
