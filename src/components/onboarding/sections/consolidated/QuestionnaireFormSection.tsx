import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Loader2, AlertCircle } from 'lucide-react';
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
  
  // Calculate completion percentage based on answered questions
  const calculateCompletionPercentage = (answers: Record<string, any>): number => {
    // Define the total number of expected questions
    const totalQuestions = 15; // Total number of main questions in the questionnaire
    
    // Count how many questions have been answered
    let answeredQuestions = 0;
    
    // Check basic demographic and investment knowledge questions
    const basicQuestionKeys = [
      'ageGroup', 'income', 'netWorth', 'investmentKnowledge', 
      'investmentExperience', 'complexProducts', 'investmentComposition', 
      'behavioralBiases'
    ];
    
    answeredQuestions += basicQuestionKeys.filter(key => 
      answers[key] !== undefined && 
      answers[key] !== null && 
      answers[key] !== ''
    ).length;
    
    // Check if financial goals were selected
    if (answers.goals && Array.isArray(answers.goals) && answers.goals.length > 0) {
      answeredQuestions += 1;
      
      // Check goal priorities
      if (answers.goalPriorities && Array.isArray(answers.goalPriorities) && answers.goalPriorities.length > 0) {
        answeredQuestions += 1;
      }
      
      // Check goal details - each goal with details counts
      if (answers.goalDetails && typeof answers.goalDetails === 'object') {
        const goalDetailsCount = Object.keys(answers.goalDetails).length;
        if (goalDetailsCount > 0) {
          // Add a weighted score for goal details (max 3 points)
          answeredQuestions += Math.min(3, goalDetailsCount);
        }
      }
    }
    
    // Check risk preferences
    if (answers.riskPreferences && typeof answers.riskPreferences === 'object') {
      const riskPreferencesKeys = ['riskTolerance', 'investmentTimeframe', 'marketResponse'];
      const answeredRiskPreferences = riskPreferencesKeys.filter(key => 
        answers.riskPreferences && 
        answers.riskPreferences[key] !== undefined && 
        answers.riskPreferences[key] !== null && 
        answers.riskPreferences[key] !== ''
      ).length;
      
      answeredQuestions += answeredRiskPreferences;
    }
    
    // Calculate percentage - cap at 100%
    const completionPercentage = Math.min(100, Math.round((answeredQuestions / totalQuestions) * 100));
    
    return completionPercentage;
  };
  
  // Get the completion percentage
  const completionPercentage = calculateCompletionPercentage(questionnaireData.answers);
  
  // Set the completed status if all questions have been answered
  useEffect(() => {
    if (completionPercentage === 100 && !questionnaireData.completed) {
      updateQuestionnaireData({
        ...questionnaireData,
        completed: true
      });
    } else if (completionPercentage < 100 && questionnaireData.completed) {
      updateQuestionnaireData({
        ...questionnaireData,
        completed: false
      });
    }
  }, [completionPercentage, questionnaireData, updateQuestionnaireData]);

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
                  variant="default"
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
                {/* Removed icon and "Financial Questionnaire" heading */}
              </div>
              <span className="text-sm font-medium">
                {completionPercentage}% Complete
              </span>
            </div>
            
            <Progress 
              value={completionPercentage} 
              className="h-2" 
            />
            
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-gray-600">
                {questionnaireData.completed ? (
                  "Questionnaire completed. You can update it anytime."
                ) : completionPercentage > 0 ? (
                  `You've completed ${completionPercentage}% of the questionnaire. Continue where you left off.`
                ) : (
                  "Optional: Complete our questionnaire to help us understand your financial goals."
                )}
              </div>
              
              <Button 
                onClick={handleNavigateToQuestionnaire}
                variant={questionnaireData.completed ? "secondary" : "default"}
                className={questionnaireData.completed ? "" : ""}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : questionnaireData.completed ? (
                  "Review Questionnaire"
                ) : completionPercentage > 0 ? (
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
