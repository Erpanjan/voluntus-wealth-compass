
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft } from 'lucide-react';

// Import the existing Questionnaire component
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
        // Calculate based on number of answers (simple approximation)
        const answerCount = Object.keys(parsedData.questionnaire.answers).length;
        return Math.min(Math.round((answerCount / 5) * 100), 99); // Max 99% until marked complete
      }
    }
    return 0;
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();

  // Effect to track progress from the questionnaire component
  const trackProgress = (newProgress: number) => {
    setProgress(newProgress);
  };

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

          {/* Pass trackProgress to the Questionnaire component */}
          <QuestionnaireComponent setCompleted={setIsCompleted} />

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
