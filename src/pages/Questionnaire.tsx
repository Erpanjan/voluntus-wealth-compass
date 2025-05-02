
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import QuestionnaireForm from '@/components/questionnaire/QuestionnaireForm';
import QuestionnaireHeader from '@/components/questionnaire/QuestionnaireHeader';
import QuestionnaireIntro from '@/components/questionnaire/QuestionnaireIntro';
import QuestionnaireNavigation from '@/components/questionnaire/QuestionnaireNavigation';
import QuestionnaireLoading from '@/components/questionnaire/QuestionnaireLoading';
import QuestionnaireErrorState from '@/components/questionnaire/QuestionnaireErrorState';
import { useQuestionnaireData } from '@/hooks/useQuestionnaireData';
import { supabase } from '@/integrations/supabase/client';

const Questionnaire = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  // Create the ref with the correct type
  const questionnaireFormRef = useRef<{ saveProgress: () => Promise<boolean> }>(null);
  
  // Use our custom hook to handle data loading
  const { 
    loadingInitial, 
    error, 
    isReady, 
    progressPercentage, 
    totalSteps,
    setIsReady 
  } = useQuestionnaireData(currentStep);

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

  // Show loading state for initial data fetch
  if (loadingInitial) {
    return <QuestionnaireLoading />;
  }

  if (error && !isReady) {
    return (
      <QuestionnaireErrorState
        error={error}
        onRetry={() => window.location.reload()}
        onContinue={() => setIsReady(true)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <QuestionnaireHeader
        currentStep={currentStep}
        totalSteps={totalSteps}
        progressPercentage={progressPercentage}
        error={error}
      />

      {/* Main content */}
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <QuestionnaireIntro submitError={submitError} />

          <QuestionnaireForm 
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            onComplete={handleSubmit}
            ref={questionnaireFormRef}
          />
          
          <QuestionnaireNavigation
            currentStep={currentStep}
            totalSteps={totalSteps}
            submitted={submitted}
            onPrevious={() => handleStepChange(-1)}
            onSave={handleSave}
            onNext={() => handleStepChange(1)}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;
