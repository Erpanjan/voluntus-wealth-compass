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
  const [submitError, setSubmitError] = useState<string | null>(null);
  const totalSteps = 15;
  // Create the ref with the correct type
  const questionnaireFormRef = useRef<{ saveProgress: () => Promise<boolean> }>(null);
  // Add a ready state to help prevent loading flicker
  const [isReady, setIsReady] = useState(false);
  // Track answered questions for progress calculation
  const [answeredQuestions, setAnsweredQuestions] = useState(0);

  // Calculate the completion percentage based on current step and answers
  const calculateCompletion = () => {
    // Get the questionnaire answers from local storage
    try {
      const savedQuestionnaire = localStorage.getItem('questionnaireAnswers');
      if (savedQuestionnaire) {
        const savedData = JSON.parse(savedQuestionnaire);
        
        // Count how many questions have been answered
        let count = 0;
        
        // Basic questions count
        const basicKeys = [
          'ageGroup', 'income', 'netWorth', 'investmentKnowledge',
          'investmentExperience', 'complexProducts', 'investmentComposition',
          'behavioralBiases'
        ];
        
        count += basicKeys.filter(key => 
          savedData[key] !== undefined && 
          savedData[key] !== null && 
          savedData[key] !== ''
        ).length;
        
        // Handle goals section
        if (savedData.goals && Array.isArray(savedData.goals) && savedData.goals.length > 0) {
          count += 1;
          
          // Check goal priorities
          if (savedData.goalPriorities && savedData.goalPriorities.length > 0) {
            count += 1;
          }
          
          // Goal details count
          if (savedData.goalDetails && typeof savedData.goalDetails === 'object') {
            count += Math.min(3, Object.keys(savedData.goalDetails).length);
          }
        }
        
        // Risk preferences
        if (savedData.riskPreferences) {
          const riskKeys = ['riskTolerance', 'investmentTimeframe', 'marketResponse'];
          count += riskKeys.filter(key => 
            savedData.riskPreferences && 
            savedData.riskPreferences[key]
          ).length;
        }
        
        setAnsweredQuestions(count);
        return count;
      }
    } catch (e) {
      console.error('Error calculating completion:', e);
    }
    
    // Default to current step as fallback
    return Math.max(1, currentStep);
  };

  // Update answered questions count when step changes
  useEffect(() => {
    calculateCompletion();
  }, [currentStep]);

  // Check authentication status and load previous step
  useEffect(() => {
    let isMounted = true;
    
    const init = async () => {
      try {
        // Try to load the last saved step from localStorage first for fast initial display
        const savedQuestionnaire = localStorage.getItem('questionnaireAnswers');
        if (savedQuestionnaire && isMounted) {
          try {
            const savedData = JSON.parse(savedQuestionnaire);
            // If we have lastCompletedStep in saved data, use it
            if (savedData.lastCompletedStep !== undefined) {
              const lastStep = Math.min(Number(savedData.lastCompletedStep) || 0, totalSteps - 1);
              if (isMounted) setCurrentStep(lastStep);
            }
            
            // Calculate initial answered questions
            calculateCompletion();
          } catch (e) {
            console.error('Error parsing saved questionnaire data:', e);
          }
        }

        // Then check auth status with a timeout to not block UI
        try {
          const sessionPromise = supabase.auth.getSession();
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Session fetch timeout')), 1000)
          );
          
          const { data: { session } } = await Promise.race([
            sessionPromise,
            timeoutPromise
          ]) as { data: { session: any } };
          
          // If no session, show message but don't redirect immediately
          if (!session && isMounted) {
            console.log('No active session found');
            setError('Please log in to save your questionnaire progress');
          }
        } catch (error) {
          console.log('Session check timed out, continuing with questionnaire');
        }
      } catch (error) {
        console.error('Error initializing questionnaire:', error);
      } finally {
        if (isMounted) {
          setLoadingInitial(false);
          // Short delay before setting ready to avoid UI flickering
          setTimeout(() => {
            if (isMounted) setIsReady(true);
          }, 100);
        }
      }
    };
    
    init();
    
    // Set a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (loadingInitial && isMounted) {
        setLoadingInitial(false);
        setIsReady(true);
        console.log('Loading took too long, proceeding with fresh questionnaire');
      }
    }, 1000); // Reduced from 3 seconds to 1 second
    
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [navigate, toast, totalSteps]);

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
          
          // Recalculate completion after saving
          calculateCompletion();
        } catch (e) {
          console.error('Error saving step progress:', e);
        }
      }
      
      return newStep;
    });
  };

  // Handle submission
  const handleSubmit = async () => {
    setSubmitError(null); // Reset any previous errors
    
    try {
      setSubmitted(true);
      
      // Check auth status before submission
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setSubmitError("You need to be logged in to submit the questionnaire. Your answers will be saved locally.");
        toast({
          title: "Authentication Required",
          description: "Please log in to submit your questionnaire to the server.",
          variant: "destructive"
        });
        
        // Save to localStorage as fallback
        const savedQuestionnaire = localStorage.getItem('questionnaireAnswers');
        if (savedQuestionnaire) {
          const savedData = JSON.parse(savedQuestionnaire);
          savedData.lastCompletedStep = currentStep;
          savedData.completed = true; // Mark as completed even if only saved locally
          localStorage.setItem('questionnaireAnswers', JSON.stringify(savedData));
        }
        
        setSubmitted(false);
        return;
      }
      
      // Access the saveProgress method through the ref
      if (questionnaireFormRef.current) {
        console.log('Submitting questionnaire via saveProgress method');
        const saved = await questionnaireFormRef.current.saveProgress();
        
        if (!saved) {
          throw new Error('Failed to save questionnaire data to Supabase');
        }
        
        // Additional check to verify if data was saved successfully
        try {
          const { data, error: fetchError } = await supabase
            .from('questionnaire_responses')
            .select('*')
            .eq('user_id', session.user.id)
            .maybeSingle();
          
          if (fetchError) {
            console.error('Error verifying submission:', fetchError);
          } else if (!data) {
            console.warn('No questionnaire data found after submission');
          } else {
            console.log('Questionnaire submission verified successful:', data);
          }
        } catch (verifyError) {
          console.error('Error during verification check:', verifyError);
        }
        
        toast({
          title: "Questionnaire Submitted",
          description: "Your questionnaire has been submitted successfully.",
        });
        
        // Navigate back to onboarding after a short delay
        setTimeout(() => navigate('/onboarding'), 1500);
      } else {
        console.error('QuestionnaireForm ref not available');
        throw new Error('Submission component not available');
      }
    } catch (error) {
      console.error('Error submitting questionnaire:', error);
      setSubmitError(error instanceof Error ? error.message : 'Unknown submission error');
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
        setSubmitted(true); // Add loading state while saving
        const saved = await questionnaireFormRef.current.saveProgress();
        setSubmitted(false); // Remove loading state after save attempt
        
        // Recalculate completion after saving
        calculateCompletion();
        
        if (saved) {
          toast({
            title: "Progress Saved",
            description: "Your questionnaire progress has been saved.",
          });
        }
      } else {
        console.warn('QuestionnaireForm ref not available, saving to localStorage only');
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
        } else {
          // Initialize empty questionnaire data
          const newData = { lastCompletedStep: currentStep };
          localStorage.setItem('questionnaireAnswers', JSON.stringify(newData));
          
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
      setSubmitted(false); // Remove loading state on error
    }
  };

  // Calculate completion percentage for progress indicator
  const progressPercentage = Math.min(100, Math.round((answeredQuestions / totalSteps) * 100));

  // Show loading state for initial data fetch
  if (loadingInitial) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 text-gray-400 animate-spin mb-4" />
        <p className="text-gray-600">Loading your questionnaire data...</p>
      </div>
    );
  }

  if (error && !isReady) {
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

            <div className="flex space-x-3">
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
              <Button variant="outline" onClick={() => setIsReady(true)}>
                Continue Anyway
              </Button>
            </div>
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
          <div className="w-full my-4">
            <div className="flex justify-between text-sm text-gray-500 mb-1">
              <span>Step {currentStep + 1} of {totalSteps}</span>
              <span>{progressPercentage}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </div>
      </motion.header>

      {/* Notice banner for not logged in users */}
      {error && (
        <div className="bg-amber-50 border-b border-amber-100 py-2">
          <div className="container mx-auto px-6">
            <Alert variant="warning" className="bg-transparent border-none py-1 shadow-none">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              <AlertDescription className="text-amber-700 text-sm">
                {error} <Link to="/login" className="underline font-medium">Login here</Link>
              </AlertDescription>
            </Alert>
          </div>
        </div>
      )}

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

          {submitError && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4 mr-2" />
              <AlertDescription>{submitError}</AlertDescription>
            </Alert>
          )}

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
              >
                <Save className="h-4 w-4 mr-2" />
                Save Progress
              </Button>
              
              {currentStep < totalSteps - 1 ? (
                <Button 
                  onClick={() => handleStepChange(1)}
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit}
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
          )}
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;
