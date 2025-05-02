
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, ClipboardList, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface QuestionnaireFormSectionProps {
  questionnaireData: {
    completed: boolean;
    answers: Record<string, any>;
  };
  updateQuestionnaireData: (data: { completed: boolean; answers: Record<string, any> }) => void;
}

const QuestionnaireFormSection: React.FC<QuestionnaireFormSectionProps> = ({
  questionnaireData,
  updateQuestionnaireData
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dataChecked, setDataChecked] = useState(false);
  
  // Fetch the latest questionnaire data from Supabase
  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates after unmount
    
    const fetchLatestData = async () => {
      try {
        if (isMounted) setLoading(true);
        setError(null);
        
        // Initialize with any local data first for faster display
        const localData = localStorage.getItem('questionnaireAnswers');
        let parsedLocalData: Record<string, any> = {};
        let combinedAnswers: Record<string, any> = {};
        let isCompleted = false;
        
        if (localData) {
          try {
            parsedLocalData = JSON.parse(localData);
            console.log('Found questionnaire data in localStorage:', parsedLocalData);
            combinedAnswers = { ...parsedLocalData };
          } catch (e) {
            console.error('Error parsing localStorage data:', e);
          }
        }
        
        // Try to get session with a timeout to prevent blocking
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Session fetch timeout')), 1000)
        );
        
        try {
          // Use Promise.race to timeout if session fetch takes too long
          const { data: { session } } = await Promise.race([
            sessionPromise,
            timeoutPromise
          ]) as { data: { session: any } };
          
          // Try to get data from Supabase if authenticated
          if (session?.user) {
            console.log('User is authenticated, checking for questionnaire data in database');
            
            const { data, error } = await supabase
              .from('questionnaire_responses')
              .select('*')
              .eq('user_id', session.user.id)
              .maybeSingle();
            
            if (error) {
              console.error('Error fetching questionnaire data:', error);
            } else if (data) {
              console.log('Found questionnaire data in database:', data);
              isCompleted = data.completed || false;
              
              // Parse any stored JSON answers
              if (data.answers_json) {
                try {
                  // Ensure we're properly handling the JSON data
                  const dbAnswers = typeof data.answers_json === 'string' 
                    ? JSON.parse(data.answers_json) 
                    : data.answers_json;
                  
                  // Make sure lastCompletedStep is a number
                  if (dbAnswers.lastCompletedStep !== undefined) {
                    const lastStep = Number(dbAnswers.lastCompletedStep);
                    dbAnswers.lastCompletedStep = isNaN(lastStep) ? 0 : lastStep;
                  }
                  
                  combinedAnswers = { ...combinedAnswers, ...dbAnswers };
                } catch (e) {
                  console.error('Error parsing database JSON answers:', e);
                }
              }
            } else {
              console.log('No questionnaire data found in database for this user');
            }
          } else {
            console.log('User is not authenticated, using only localStorage data');
          }
        } catch (error) {
          // Session fetch timed out or failed
          console.log('Session fetch timed out or failed, using only localStorage data');
        }
        
        if (isMounted) {
          // Update onboarding form data with combined answers
          updateQuestionnaireData({
            completed: isCompleted,
            answers: combinedAnswers,
          });
          
          setDataChecked(true);
          setLoading(false);
        }
      } catch (err) {
        console.error('Unexpected error fetching questionnaire data:', err);
        if (isMounted) {
          setError('An unexpected error occurred while checking your questionnaire status');
          setLoading(false);
          setDataChecked(true);
        }
      }
    };
    
    fetchLatestData();
    
    // Force stop loading after a short timeout regardless of API response
    const timeoutId = setTimeout(() => {
      if (isMounted && loading) {
        console.warn('Questionnaire data loading timeout reached');
        setLoading(false);
        setDataChecked(true);
      }
    }, 1000); // Reduced to 1 second for better UX
    
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [updateQuestionnaireData]);
  
  // Function to navigate to the questionnaire page
  const handleNavigateToQuestionnaire = () => {
    navigate('/questionnaire');
  };

  // If there's an error, show an error message but still allow navigation
  if (error) {
    return (
      <div className="space-y-6">
        <Card className="overflow-hidden border border-gray-200">
          <CardContent className="p-6">
            <div className="space-y-4">
              <Alert variant="warning" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
              
              <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-gray-600">
                  You can still continue with the questionnaire.
                </div>
                
                <Button 
                  onClick={handleNavigateToQuestionnaire}
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
                >
                  Complete Questionnaire
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border border-gray-200">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                {questionnaireData.completed ? (
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                ) : (
                  <ClipboardList className="h-5 w-5 text-amber-600" />
                )}
                <h3 className="font-medium">Financial Questionnaire</h3>
              </div>
              <span className="text-sm font-medium">
                {questionnaireData.completed ? '100' : '0'}% Complete
              </span>
            </div>
            
            <Progress 
              value={questionnaireData.completed ? 100 : 0} 
              className="h-2" 
            />
            
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-gray-600">
                {loading ? (
                  <div className="flex items-center">
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Checking status...
                  </div>
                ) : (
                  !dataChecked ? (
                    "Loading questionnaire status..."
                  ) : questionnaireData.completed ? (
                    "Questionnaire completed. You can update it anytime."
                  ) : Object.keys(questionnaireData.answers).length > 0 ? (
                    "You have partially completed the questionnaire. Continue where you left off."
                  ) : (
                    "Optional: Complete our questionnaire to help us understand your financial goals."
                  )
                )}
              </div>
              
              <Button 
                onClick={handleNavigateToQuestionnaire}
                className={questionnaireData.completed 
                  ? "bg-gray-100 text-gray-800 hover:bg-gray-200" 
                  : "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"}
                // Never disable the button - even during loading
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : questionnaireData.completed ? (
                  "Review Questionnaire"
                ) : Object.keys(questionnaireData.answers).length > 0 ? (
                  "Continue Questionnaire"
                ) : (
                  "Start Questionnaire"
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuestionnaireFormSection;
