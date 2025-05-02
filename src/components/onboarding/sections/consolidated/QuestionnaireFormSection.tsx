
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, ClipboardList, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
  
  // Fetch the latest questionnaire data from Supabase
  useEffect(() => {
    const fetchLatestData = async () => {
      try {
        setLoading(true);
        
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return;
        
        // Get latest questionnaire data
        const { data, error } = await supabase
          .from('questionnaire_responses')
          .select('*')
          .eq('user_id', session.user.id)
          .single();
          
        if (data && !error) {
          // Also check localStorage for any additional data
          const localData = localStorage.getItem('questionnaireAnswers');
          let parsedLocalData = {};
          if (localData) {
            parsedLocalData = JSON.parse(localData);
          }
          
          // Combine data sources with priority to database
          const combinedAnswers = {
            ...parsedLocalData,
            // Use optional chaining and nullish coalescing to safely access potentially missing properties
            ...((data.answers_json ? JSON.parse(data.answers_json as string) : {})),
          };
          
          // Update onboarding form data with latest questionnaire status
          updateQuestionnaireData({
            completed: data.completed || false,
            answers: combinedAnswers,
          });
        }
      } catch (err) {
        console.error('Error fetching questionnaire data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLatestData();
  }, [updateQuestionnaireData]);
  
  // Function to navigate to the questionnaire page
  const handleNavigateToQuestionnaire = () => {
    navigate('/questionnaire');
  };
  
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
