
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check, Save, Loader2, AlertCircle } from 'lucide-react';
import { useQuestionnaire } from './QuestionnaireContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';

interface ReviewSubmissionProps {
  answers: Record<string, any>;
  onSubmit: () => void;
}

const ReviewSubmission: React.FC<ReviewSubmissionProps> = ({ answers, onSubmit }) => {
  const { isSaving, saveProgress } = useQuestionnaire();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [authStatus, setAuthStatus] = useState<'checking' | 'authenticated' | 'unauthenticated'>('checking');
  
  // Check authentication status
  React.useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setAuthStatus(session ? 'authenticated' : 'unauthenticated');
    };
    
    checkAuth();
  }, []);
  
  // Handle the submit process
  const handleSubmitClick = async () => {
    try {
      setIsSubmitting(true);
      setSubmissionError(null);
      
      // First save progress to ensure everything is up-to-date
      const saved = await saveProgress();
      
      if (!saved) {
        setSubmissionError('Unable to save your questionnaire data. Please try again.');
        return;
      }
      
      // Trigger the onSubmit callback from parent
      onSubmit();
    } catch (error) {
      console.error('Error during submission:', error);
      setSubmissionError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center">
        <motion.div 
          className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
        >
          <Check className="h-8 w-8 text-emerald-600" />
        </motion.div>
        <h2 className="text-2xl font-semibold mb-2">Questionnaire Complete!</h2>
        <p className="text-gray-600 mb-8">Thank you for completing the financial questionnaire. Your responses have been saved and will be included in your application.</p>
        
        {authStatus === 'unauthenticated' && (
          <Alert variant="warning" className="mb-6 text-left">
            <AlertCircle className="h-4 w-4 mr-2" />
            <AlertDescription>
              You're not currently logged in. To ensure your questionnaire data is saved to your account, please log in before submitting.
            </AlertDescription>
          </Alert>
        )}
        
        {submissionError && (
          <Alert variant="destructive" className="mb-6 text-left">
            <AlertCircle className="h-4 w-4 mr-2" />
            <AlertDescription>{submissionError}</AlertDescription>
          </Alert>
        )}
        
        <Button 
          onClick={handleSubmitClick}
          className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 px-8"
          disabled={isSubmitting || isSaving}
        >
          {isSubmitting || isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isSaving ? 'Saving...' : 'Submitting...'}
            </>
          ) : "Submit and Return to Onboarding"}
        </Button>
      </div>

      <div className="mt-10">
        <h3 className="text-lg font-medium mb-4">Response Summary</h3>
        
        <div className="space-y-4">
          {/* Show completed sections */}
          <Card className="p-4 bg-gray-50">
            <div className="flex items-center text-emerald-600 font-medium">
              <Check className="h-5 w-5 mr-2" /> 
              Basic Information Section Completed
            </div>
          </Card>
          
          <Card className="p-4 bg-gray-50">
            <div className="flex items-center text-emerald-600 font-medium">
              <Check className="h-5 w-5 mr-2" /> 
              Investment Experience Section Completed
            </div>
          </Card>
          
          {answers.goals && answers.goals.length > 0 && (
            <Card className="p-4 bg-gray-50">
              <div className="flex items-center text-emerald-600 font-medium mb-2">
                <Check className="h-5 w-5 mr-2" /> 
                Financial Goals Section Completed
              </div>
              <div className="text-sm text-gray-600">
                {answers.goals.filter(g => g.interestLevel !== 'would-not-consider').length} goals specified
              </div>
            </Card>
          )}
          
          {answers.behavioralBiases && (
            <Card className="p-4 bg-gray-50">
              <div className="flex items-center text-emerald-600 font-medium">
                <Check className="h-5 w-5 mr-2" /> 
                Behavioral Biases Section Completed
              </div>
            </Card>
          )}
        </div>
        
        <p className="text-sm text-gray-500 mt-6">
          This questionnaire is confidential and will only be used to provide better financial recommendations.
          Your answers have been saved and will be accessible when you return.
        </p>
      </div>
    </motion.div>
  );
};

export default ReviewSubmission;
