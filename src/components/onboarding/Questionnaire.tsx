
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface QuestionnaireProps {
  setCompleted: (completed: boolean) => void;
}

const Questionnaire: React.FC<QuestionnaireProps> = ({ setCompleted }) => {
  // Simple handler to mark questionnaire as completed
  const handleSkip = () => {
    setCompleted(true);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white shadow">
        <CardContent className="p-6">
          <p className="text-center text-gray-600 my-8">
            The questionnaire is being updated and is temporarily unavailable.
          </p>
          <div className="flex justify-center">
            <Button onClick={handleSkip}>
              Skip Questionnaire
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Questionnaire;
