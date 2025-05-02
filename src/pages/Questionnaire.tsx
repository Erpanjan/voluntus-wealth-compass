
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
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
        const mainCategories = ['ageGroup', 'incomeRange', 'netWorth', 'investmentKnowledge', 'investmentExperience'];
        let completedCategories = mainCategories.filter(key => answers[key]).length;
        
        // Check if goals are selected
        if (answers.goalPriorities && answers.goalPriorities.length > 0) {
          completedCategories++;
          
          // Check goal specific questions
          if (answers.riskAppetite && Object.keys(answers.riskAppetite).length > 0) completedCategories++;
          if (answers.absoluteRiskTolerance && Object.keys(answers.absoluteRiskTolerance).length > 0) completedCategories++;
          if (answers.goalHorizons && Object.keys(answers.goalHorizons).length > 0) completedCategories++;
        }
        
        return Math.min(Math.round((completedCategories / 10) * 100), 99);
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
    
    // Trigger confetti effect
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    
    setTimeout(() => navigate('/onboarding'), 1500);
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
      <motion.header 
        className="border-b py-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <Button variant="ghost" onClick={() => navigate('/onboarding')} className="mr-2">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Onboarding
              </Button>
            </div>
            <div className="text-sm font-medium">{progress}% Complete</div>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>
      </motion.header>

      {/* Main content */}
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center mb-4">
              <h1 className="text-2xl font-semibold">Financial Questionnaire</h1>
            </div>
          </motion.div>

          {/* Pass setCompleted to the Questionnaire component */}
          <QuestionnaireComponent setCompleted={handleQuestionnaireCompleted} />

          <motion.div 
            className="flex justify-end mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button 
              onClick={handleCompletion}
              disabled={!isCompleted}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
            >
              Complete & Return to Onboarding
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;
