
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, ClipboardList } from 'lucide-react';

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
  
  // Function to navigate to the questionnaire page
  const handleNavigateToQuestionnaire = () => {
    navigate('/questionnaire');
  };
  
  // Calculate completion percentage
  const calculateCompletionPercentage = (): number => {
    if (questionnaireData.completed) return 100;
    
    // If there are no answers, return 0
    if (!questionnaireData.answers || Object.keys(questionnaireData.answers).length === 0) {
      return 0;
    }
    
    // Calculate based on filled answers for main categories
    const requiredCategories = [
      'ageGroup',
      'incomeRange',
      'netWorth',
      'investmentKnowledge',
      'investmentExperience',
      'marketVolatilityResponse'
    ];
    
    let completedCategories = 0;
    let totalCategories = requiredCategories.length;
    
    // Check main categories
    requiredCategories.forEach(category => {
      if (questionnaireData.answers[category]) completedCategories++;
    });
    
    // Check if any goals were selected 
    if (
      questionnaireData.answers.goalPriorities && 
      Array.isArray(questionnaireData.answers.goalPriorities) && 
      questionnaireData.answers.goalPriorities.length > 0
    ) {
      completedCategories++;
      totalCategories++;
      
      // Check if goal-specific questions are answered
      const goalIds = questionnaireData.answers.goalPriorities;
      const goalSpecificCategories = ['goalHorizons', 'riskAppetite', 'absoluteRiskTolerance'];
      
      goalSpecificCategories.forEach(category => {
        totalCategories++;
        if (
          questionnaireData.answers[category] && 
          Object.keys(questionnaireData.answers[category]).length > 0 &&
          goalIds.some(id => questionnaireData.answers[category][id])
        ) {
          completedCategories++;
        }
      });
    }
    
    return Math.round((completedCategories / totalCategories) * 100);
  };
  
  const completionPercentage = calculateCompletionPercentage();
  
  // Mark as complete if we've reached 100%
  React.useEffect(() => {
    if (completionPercentage === 100 && !questionnaireData.completed) {
      updateQuestionnaireData({
        ...questionnaireData,
        completed: true
      });
    }
  }, [completionPercentage, questionnaireData, updateQuestionnaireData]);
  
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
              <span className="text-sm font-medium">{completionPercentage}% Complete</span>
            </div>
            
            <Progress value={completionPercentage} className="h-2" />
            
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-gray-600">
                {questionnaireData.completed 
                  ? "Thanks for completing the questionnaire!" 
                  : "Help us understand your financial goals and preferences."}
              </div>
              
              <Button 
                onClick={handleNavigateToQuestionnaire}
                className={questionnaireData.completed 
                  ? "bg-gray-100 text-gray-800 hover:bg-gray-200" 
                  : "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"}
              >
                {questionnaireData.completed ? "Review Questionnaire" : "Complete Questionnaire"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuestionnaireFormSection;
