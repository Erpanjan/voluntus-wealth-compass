import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Loader2, Save, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import OnboardingProgressIndicator from '@/components/onboarding/OnboardingProgressIndicator';
import QuestionnaireForm from '@/components/questionnaire/QuestionnaireForm';
import { supabase } from '@/integrations/supabase/client';

const Questionnaire = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const totalSteps = 15;
  // Create the ref with the correct type
  const questionnaireFormRef = useRef<{ saveProgress: () => Promise<boolean> }>(null);

  // Check authentication status and load previous step
  useEffect(() => {
    let isMounted = true;
    const abortController = new AbortController();
    
    const init = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        // If no session, redirect to login
        if (!session) {
          if (isMounted) {
            toast({
              title: "Authentication Required",
              description: "Please log in to access the questionnaire.",
              variant: "destructive"
            });
            navigate('/login');
          }
          return;
        }

        // Try to load the last saved step from localStorage
        const savedQuestionnaire = localStorage.getItem('questionnaireAnswers');
        if (savedQuestionnaire) {
          try {
            const savedData = JSON.parse(savedQuestionnaire);
            // If we have lastCompletedStep in saved data, use it
            if (savedData.lastCompletedStep !== undefined) {
              const step = Math.min(savedData.lastCompletedStep, totalSteps - 1);
              if (isMounted) setCurrentStep(step);
            }
          } catch (e) {
            console.error('Error parsing saved questionnaire data:', e);
            if (isMounted) {
              // Don't show error, just start fresh
              console.log('Could not load previous progress, starting fresh');
            }
          }
        }
      } catch (error) {
        console.error('Error initializing questionnaire:', error);
        if (isMounted) {
          // Don't block UI with errors, just log them
          console.error('Error initializing questionnaire:', error);
        }
      } finally {
        if (isMounted) setLoadingInitial(false);
      }
    };
    
    init();
    
    // Set a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (loadingInitial && isMounted) {
        setLoadingInitial(false);
        console.log('Loading took too long, proceeding with fresh questionnaire');
      }
    }, 3000); // Reduced from 10 seconds to 3 seconds
    
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      abortController.abort();
    };
  }, [navigate, toast]);

  // Handler for step navigation
  const handleStepChange = (stepIncrement: number) => {
    setCurrentStep(prevStep => {
      // Calculate new step with bounds checking
      const newStep = Math.max(0, Math.min(prevStep + stepIncrement, totalSteps - 1));
      
      // Save the last completed step to localStorage
      if (stepIncrement > 0) {
        try {
          const savedQuestionnaire = localStorage.getItem('questionnaireAnswers');
          const savedData = savedQuestionnaire ? JSON.parse(savedQuestionnaire) : {};
          savedData.lastCompletedStep = Math.max(savedData.lastCompletedStep || 0, newStep);
          localStorage.setItem('questionnaireAnswers', JSON.stringify(savedData));
        } catch (e) {
          console.error('Error saving step progress:', e);
          // Don't block UI with errors
        }
      }
      
      return newStep;
    });
  };

  // Handle submission
  const handleSubmit = async () => {
    try {
      setSubmitted(true);
      
      // Access the saveProgress method through the ref
      if (questionnaireFormRef.current) {
        await questionnaireFormRef.current.saveProgress();
      }
      
      toast({
        title: "Questionnaire Submitted",
        description: "Your questionnaire has been submitted successfully.",
      });
      
      // Navigate back to onboarding after a short delay
      setTimeout(() => navigate('/onboarding'), 1500);
    } catch (error) {
      console.error('Error submitting questionnaire:', error);
      toast({
        title: "Submission Error",
        description: "There was an error submitting your questionnaire. Your answers have been saved, and you can try submitting again.",
        variant: "destructive"
      });
      setSubmitted(false);
    }
  };

  // Handle manual save
  const handleSave = async () => {
    try {
      // Use the ref to access the saveProgress method
      if (questionnaireFormRef.current) {
        const saved = await questionnaireFormRef.current.saveProgress();
        if (saved) {
          toast({
            title: "Progress Saved",
            description: "Your questionnaire progress has been saved.",
          });
        }
      } else {
        // Fallback to just saving to localStorage
        const savedQuestionnaire = localStorage.getItem('questionnaireAnswers');
        if (savedQuestionnaire) {
          // Just ensure lastCompletedStep is set
          const savedData = JSON.parse(savedQuestionnaire);
          savedData.lastCompletedStep = currentStep;
          localStorage.setItem('questionnaireAnswers', JSON.stringify(savedData));
          
          toast({
            title: "Progress Saved Locally",
            description: "Your answers have been saved on this device.",
          });
        }
      }
    } catch (error) {
      console.error('Error saving progress:', error);
      toast({
        title: "Save Error",
        description: "There was an error saving your progress. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Show loading state for initial data fetch
  if (loadingInitial) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 text-gray-400 animate-spin mb-4" />
        <p className="text-gray-600">Loading your questionnaire data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <header className="border-b py-4">
          <div className="container mx-auto px-6">
            <div className="flex items-center mb-4">
              <Button variant="ghost" onClick={() => navigate('/onboarding')} className="mr-2">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Onboarding
              </Button>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <Alert variant="warning" className="mb-6">
              <AlertCircle className="h-4 w-4 mr-2" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>

            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
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
            ref={questionnaireFormRef}
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
              
              <Button 
                variant="outline" 
                onClick={handleSave}
                disabled={false}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Progress
              </Button>
              
              {currentStep < totalSteps - 1 ? (
                <Button 
                  onClick={() => handleStepChange(1)}
                  disabled={false}
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit}
                  disabled={false}
                >
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
