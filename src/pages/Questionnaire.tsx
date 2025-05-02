
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import OnboardingProgressIndicator from '@/components/onboarding/OnboardingProgressIndicator';
import QuestionnaireForm from '@/components/questionnaire/QuestionnaireForm';
import { supabase } from '@/integrations/supabase/client';

const Questionnaire = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hasSelectedGoals, setHasSelectedGoals] = useState(true);
  const totalSteps = 15;

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      // If no session, redirect to login
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please log in to access the questionnaire.",
          variant: "destructive"
        });
        navigate('/login');
      }
    };
    
    checkAuth();
  }, [navigate, toast]);

  // Handle saving the questionnaire state
  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Get the current user session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please log in to save your questionnaire.",
          variant: "destructive"
        });
        return;
      }

      // Get existing data from localStorage if it exists
      const savedData = localStorage.getItem('onboardingDraft');
      if (!savedData) {
        toast({
          title: "Error",
          description: "No questionnaire data found to save.",
          variant: "destructive"
        });
        return;
      }

      const parsedData = JSON.parse(savedData);
      
      // Save questionnaire data to Supabase
      const { error } = await supabase
        .from('questionnaire_responses')
        .upsert({
          user_id: session.user.id,
          completed: true,
          investment_goals: parsedData.questionnaire.answers.investmentGoals || null,
          risk_tolerance: parsedData.questionnaire.answers.riskTolerance || null,
          time_horizon: parsedData.questionnaire.answers.timeHorizon || null,
          additional_info: parsedData.questionnaire.answers.additionalInfo || null,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });

      if (error) {
        throw error;
      }

      // Also update onboarding_data to ensure consistency
      const { error: onboardingError } = await supabase
        .from('onboarding_data')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', session.user.id);

      if (onboardingError) {
        console.error('Error updating onboarding timestamp:', onboardingError);
      }

      // Show success message
      toast({
        title: "Questionnaire Saved",
        description: "Your responses have been saved successfully.",
      });
      
      // Navigate back to onboarding
      navigate('/onboarding');
    } catch (error) {
      console.error('Error saving questionnaire:', error);
      toast({
        title: "Error",
        description: "Failed to save your questionnaire responses.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleStepChange = (stepIncrement: number) => {
    setCurrentStep(prev => {
      const newStep = prev + stepIncrement;
      return Math.max(0, Math.min(newStep, totalSteps));
    });
  };

  const handleSubmit = () => {
    setSubmitted(true);
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
                disabled={currentStep === 0 || saving}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : "Save Progress"}
              </Button>
              
              {currentStep < totalSteps - 1 ? (
                <Button 
                  onClick={() => handleStepChange(1)}
                  disabled={saving}
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit}
                  disabled={saving}
                >
                  {saving ? (
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
