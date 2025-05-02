
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface QuestionnaireProps {
  setCompleted: (completed: boolean) => void;
}

const Questionnaire: React.FC<QuestionnaireProps> = ({ setCompleted }) => {
  // Simple handler to mark questionnaire as completed
  const handleStartQuestionnaire = () => {
    window.location.href = '/questionnaire'; // Navigate to the questionnaire page
  };

  const handleSkip = () => {
    setCompleted(true);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white shadow">
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">Financial Questionnaire</h3>
          <p className="text-gray-600 mb-6">
            This optional questionnaire helps us understand your financial goals and preferences.
            It takes approximately 10-15 minutes to complete.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handleStartQuestionnaire}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
            >
              Start Questionnaire
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={handleSkip}>
              Skip for Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Questionnaire;
