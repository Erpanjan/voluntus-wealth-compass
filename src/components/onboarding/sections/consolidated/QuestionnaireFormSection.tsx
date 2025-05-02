
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
  questionnaireData
}) => {
  const navigate = useNavigate();
  
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
                {questionnaireData.completed 
                  ? "Questionnaire completed. You can update it anytime." 
                  : "Optional: Complete our questionnaire to help us understand your financial goals."}
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
