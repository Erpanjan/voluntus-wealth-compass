
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
  
  // Fetch the latest questionnaire data from Supabase
  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates after unmount
    const abortController = new AbortController(); // For aborting fetch operations
    
    const fetchLatestData = async () => {
      try {
        if (isMounted) setLoading(true);
        setError(null);
        
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          if (isMounted) {
            setLoading(false);
            // No need to set error for unauthenticated users
          }
          return;
        }
        
        // Get latest questionnaire data
        const { data, error } = await supabase
          .from('questionnaire_responses')
          .select('*')
          .eq('user_id', session.user.id)
          .maybeSingle(); // Using maybeSingle instead of single to avoid errors
          
        if (error) {
          console.error('Error fetching questionnaire data:', error);
          if (isMounted) {
            setError('Could not load questionnaire data');
            setLoading(false);
          }
          return;
        }
        
        // Also check localStorage for any additional data
        const localData = localStorage.getItem('questionnaireAnswers');
        let parsedLocalData = {};
        if (localData) {
          try {
            parsedLocalData = JSON.parse(localData);
          } catch (e) {
            console.error('Error parsing localStorage data:', e);
          }
        }
        
        if (isMounted) {
          // Combine data sources with priority to database
          const combinedAnswers = {
            ...parsedLocalData,
            // Use optional chaining and nullish coalescing to safely access potentially missing properties
            ...((data?.answers_json ? JSON.parse(data.answers_json as string) : {})),
          };
          
          // Update onboarding form data with latest questionnaire status
          updateQuestionnaireData({
            completed: data?.completed || false,
            answers: combinedAnswers,
          });
          setLoading(false);
        }
      } catch (err) {
        console.error('Error fetching questionnaire data:', err);
        if (isMounted) {
          setError('An unexpected error occurred');
          setLoading(false);
        }
      }
    };
    
    fetchLatestData();
    
    // Set a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (loading && isMounted) {
        setLoading(false);
        setError('Loading took too long. Please try again later.');
      }
    }, 10000); // 10 seconds timeout
    
    return () => {
      isMounted = false; // Prevent state updates after unmount
      clearTimeout(timeoutId);
      abortController.abort(); // Cancel any pending fetch operations
    };
  }, [updateQuestionnaireData]);
  
  // Function to navigate to the questionnaire page
  const handleNavigateToQuestionnaire = () => {
    navigate('/questionnaire');
  };

  // If there's an error, show an error message
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
                  questionnaireData.completed 
                    ? "Questionnaire completed. You can update it anytime." 
                    : "Optional: Complete our questionnaire to help us understand your financial goals."
                )}
              </div>
              
              <Button 
                onClick={handleNavigateToQuestionnaire}
                className={questionnaireData.completed 
                  ? "bg-gray-100 text-gray-800 hover:bg-gray-200" 
                  : "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  questionnaireData.completed ? "Review Questionnaire" : "Complete Questionnaire"
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
