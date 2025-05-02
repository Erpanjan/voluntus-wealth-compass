
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getAnswerLabel } from './utils';

interface QuestionnaireReviewCardProps {
  questionnaire: {
    completed: boolean;
    answers: Record<string, any>;
  };
  navigateTo: (section: string) => void;
}

const QuestionnaireReviewCard: React.FC<QuestionnaireReviewCardProps> = ({ 
  questionnaire, 
  navigateTo 
}) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Financial Questionnaire</span>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigateTo('questionnaire')}
          >
            Edit
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {questionnaire.completed ? (
          <div className="space-y-4">
            {questionnaire.answers.investmentGoals && (
              <div>
                <h4 className="font-medium mb-1">Investment Goals</h4>
                <p>{getAnswerLabel('investmentGoals', questionnaire.answers.investmentGoals)}</p>
              </div>
            )}
            
            {questionnaire.answers.riskTolerance && (
              <div>
                <h4 className="font-medium mb-1">Risk Tolerance</h4>
                <p>{getAnswerLabel('riskTolerance', questionnaire.answers.riskTolerance)}</p>
              </div>
            )}
            
            {questionnaire.answers.timeHorizon && (
              <div>
                <h4 className="font-medium mb-1">Investment Time Horizon</h4>
                <p>{getAnswerLabel('timeHorizon', questionnaire.answers.timeHorizon)}</p>
              </div>
            )}
            
            {questionnaire.answers.additionalInfo && (
              <div>
                <h4 className="font-medium mb-1">Additional Information</h4>
                <p className="whitespace-pre-wrap">{questionnaire.answers.additionalInfo}</p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-500 italic">No questionnaire responses provided.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default QuestionnaireReviewCard;
