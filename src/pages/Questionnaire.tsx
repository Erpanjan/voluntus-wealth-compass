
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Loader2, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import OnboardingProgressIndicator from '@/components/onboarding/OnboardingProgressIndicator';
import QuestionnaireForm from '@/components/questionnaire/QuestionnaireForm';
import { supabase } from '@/integrations/supabase/client';
import { useQuestionnaire } from '@/components/questionnaire/QuestionnaireContext';

const Questionnaire = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const totalSteps = 15;

  // Check authentication status and load previous step
  useEffect(() => {
    const init = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        // If no session, redirect to login
        if (!session) {
          toast({
            title: "Authentication Required",
            description: "Please log in to access the questionnaire.",
            variant: "destructive"
          });
          navigate('/login');
          return;
        }

        // Try to load the last saved step from localStorage
        const savedQuestionnaire = localStorage.getItem('questionnaireAnswers');
        if (savedQuestionnaire) {
          const savedData = JSON.parse(savedQuestionnaire);
          // If we have lastCompletedStep in saved data, use it
          if (savedData.lastCompletedStep !== undefined) {
            const step = Math.min(savedData.lastCompletedStep, totalSteps - 1);
            setCurrentStep(step);
          }
        }
      } catch (error) {
        console.error('Error initializing questionnaire:', error);
      } finally {
        setLoadingInitial(false);
      }
    };
    
    init();
  }, [navigate, toast]);

  // Get the questionnaire context
  const { saveProgress, isLoading, isSaving } = useQuestionnaire();

  // Handler for step navigation
  const handleStepChange = (stepIncrement: number) => {
    setCurrentStep(prevStep => {
      // Calculate new step with bounds checking
      const newStep = Math.max(0, Math.min(prevStep + stepIncrement, totalSteps - 1));
      
      // Save the last completed step to localStorage
      if (stepIncrement > 0) {
        const savedQuestionnaire = localStorage.getItem('questionnaireAnswers');
        const savedData = savedQuestionnaire ? JSON.parse(savedQuestionnaire) : {};
        savedData.lastCompletedStep = Math.max(savedData.lastCompletedStep || 0, newStep);
        localStorage.setItem('questionnaireAnswers', JSON.stringify(savedData));
      }
      
      return newStep;
    });
  };

  // Handle submission
  const handleSubmit = async () => {
    const success = await saveProgress();
    if (success) {
      setSubmitted(true);
      // Navigate back to onboarding after a short delay
      setTimeout(() => navigate('/onboarding'), 2000);
    }
  };

  // Handle manual save
  const handleSave = async () => {
    // Update the last completed step before saving
    const savedQuestionnaire = localStorage.getItem('questionnaireAnswers');
    const savedData = savedQuestionnaire ? JSON.parse(savedQuestionnaire) : {};
    savedData.lastCompletedStep = currentStep;
    localStorage.setItem('questionnaireAnswers', JSON.stringify(savedData));
    
    await saveProgress();
  };

  // Show loading state for initial data fetch
  if (loadingInitial || isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 text-gray-400 animate-spin mb-4" />
        <p className="text-gray-600">Loading your questionnaire data...</p>
      </div>
    );
  }

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
              Your progress is automatically saved as you go.
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
                disabled={currentStep === 0 || isSaving}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Progress
                  </>
                )}
              </Button>
              
              {currentStep < totalSteps - 1 ? (
                <Button 
                  onClick={() => handleStepChange(1)}
                  disabled={isSaving}
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : "Submit"}
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
