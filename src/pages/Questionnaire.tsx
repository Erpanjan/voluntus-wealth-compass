
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import OnboardingProgressIndicator from '@/components/onboarding/OnboardingProgressIndicator';
import QuestionnaireForm from '@/components/questionnaire/QuestionnaireForm';

const Questionnaire = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const totalSteps = 15;

  // Handle saving the questionnaire state to localStorage
  const handleSave = () => {
    // Get existing data from localStorage if it exists
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

    // Show success message
    toast({
      title: "Questionnaire Saved",
      description: "Your responses have been saved successfully.",
    });
    
    // Navigate back to onboarding
    navigate('/onboarding');
  };

  const handleStepChange = (stepIncrement: number) => {
    setCurrentStep(prev => {
      let newStep = prev + stepIncrement;
      
      // Get answers from localStorage to check if we can skip goal-specific questions
      const savedData = localStorage.getItem('onboardingDraft');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        const goals = parsedData?.questionnaire?.answers?.goals || [];
        
        // Check if there are any selected goals (not marked as "would-not-consider")
        const hasSelectedGoals = goals.some(goal => goal.interestLevel !== 'would-not-consider');
        
        // Skip goal-specific questions if no goals were selected
        if (!hasSelectedGoals && newStep >= 8 && newStep <= 13) {
          newStep = stepIncrement > 0 ? 14 : 7; // Skip to behavioral biases or back to goals
        }
      }
      
      return Math.max(0, Math.min(newStep, totalSteps));
    });
  };

  const handleSubmit = () => {
    setSubmitted(true);
    toast({
      title: "Questionnaire Submitted",
      description: "Thank you for completing the financial questionnaire.",
    });
    
    // Save to localStorage
    handleSave();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <motion.header 
        className="border-b py-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center mb-4">
            <Button variant="ghost" onClick={() => navigate('/onboarding')} className="mr-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Onboarding
            </Button>
          </div>
          <OnboardingProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />
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
            <h1 className="text-2xl font-semibold mb-2">Financial Questionnaire</h1>
            <p className="text-gray-600">
              This questionnaire will help us understand your financial goals and preferences.
            </p>
          </motion.div>

          <QuestionnaireForm 
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            onComplete={handleSubmit}
          />
          
          {!submitted && (
            <div className="flex justify-between mt-8">
              <Button 
                variant="outline" 
                onClick={() => handleStepChange(-1)}
                disabled={currentStep === 0}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              
              <Button variant="outline" onClick={handleSave}>
                Save Progress
              </Button>
              
              {currentStep < totalSteps - 1 ? (
                <Button onClick={() => handleStepChange(1)}>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleSubmit}>
                  Submit
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;
