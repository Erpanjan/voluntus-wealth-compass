
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';

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
  
  const navigate = useNavigate();
  const { toast } = useToast();

  // Effect to check if the questionnaire was already completed
  useEffect(() => {
    const savedData = localStorage.getItem('onboardingDraft');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      if (parsedData?.questionnaire?.completed) {
        setIsCompleted(true);
      }
    }
  }, []);

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
      {/* Header */}
      <motion.header 
        className="border-b py-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <span className="font-bold text-xl">VOLUNTUS</span>
          </Link>
          <Button variant="link" onClick={() => navigate('/onboarding')}>
            Return to Onboarding
          </Button>
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
              <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-6 h-6">
                  <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm0 8.625a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM15.375 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zM8.625 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h1 className="text-2xl font-semibold">Financial Questionnaire</h1>
            </div>
            
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4 mb-6">
              <p className="text-amber-700">
                This questionnaire will help us understand your financial situation and recommend the best investment 
                strategy for you. Your answers are confidential and will only be used to customize our advice.
                Complete all sections to earn rewards!
              </p>
            </div>
          </motion.div>

          <QuestionnaireComponent setCompleted={setIsCompleted} />

          <motion.div 
            className="flex justify-between mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button 
              variant="outline" 
              onClick={() => navigate('/onboarding')}
            >
              Skip Questionnaire
            </Button>
            
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
