
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
  
  // Function to get a summary of answers for display
  const getAnswersSummary = () => {
    if (!questionnaireData.answers) return null;
    
    const questionLabels: Record<string, string> = {
      investmentGoals: 'Investment Goals',
      riskTolerance: 'Risk Tolerance',
      timeHorizon: 'Time Horizon'
    };
    
    const answerLabels: Record<string, Record<string, string>> = {
      investmentGoals: {
        retirement: 'Retirement Planning',
        wealth: 'Wealth Accumulation',
        income: 'Regular Income',
        education: 'Education Funding',
        other: 'Other Goals'
      },
      riskTolerance: {
        conservative: 'Conservative',
        moderate: 'Moderate',
        aggressive: 'Aggressive'
      },
      timeHorizon: {
        short: 'Short term (1-3 years)',
        medium: 'Medium term (3-10 years)',
        long: 'Long term (10+ years)'
      }
    };
    
    // Get answers that have keys in questionLabels
    const relevantAnswers = Object.entries(questionnaireData.answers)
      .filter(([key]) => questionLabels[key])
      .map(([key, value]) => {
        const questionLabel = questionLabels[key];
        const answerLabel = answerLabels[key]?.[value] || value;
        return { question: questionLabel, answer: answerLabel };
      });
    
    return relevantAnswers;
  };
  
  const answersSummary = getAnswersSummary();
  
  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border border-gray-200">
        <CardContent className="p-6">
          {questionnaireData.completed ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-emerald-600 mb-4">
                <CheckCircle className="h-6 w-6" />
                <span className="font-medium">Questionnaire Completed</span>
              </div>
              
              {answersSummary && answersSummary.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-900">Your Responses Summary:</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    {answersSummary.map((item, index) => (
                      <div key={index} className="grid grid-cols-2 gap-2 text-sm">
                        <span className="text-gray-600">{item.question}:</span>
                        <span className="font-medium">{item.answer}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <Button 
                variant="outline"
                onClick={handleNavigateToQuestionnaire}
                className="mt-2"
              >
                Review & Edit Questionnaire
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="rounded-full bg-amber-100 p-2">
                  <ClipboardList className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Financial Questionnaire</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Help us understand your financial goals and preferences by completing our questionnaire. This will help us tailor our recommendations.
                  </p>
                </div>
              </div>
              
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-amber-800 text-sm">
                  This questionnaire is optional but will help us provide personalized financial advice.
                </p>
              </div>
              
              <Button 
                onClick={handleNavigateToQuestionnaire}
                className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
              >
                Complete Questionnaire
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QuestionnaireFormSection;
