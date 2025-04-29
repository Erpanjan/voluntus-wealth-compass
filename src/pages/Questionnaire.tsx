
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

// Import the existing Questionnaire component
import QuestionnaireComponent from '@/components/onboarding/Questionnaire';

const Questionnaire = () => {
  const [isCompleted, setIsCompleted] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCompletion = () => {
    toast({
      title: "Questionnaire Completed",
      description: "Thank you for completing the financial questionnaire. Your answers will help us provide better financial advice.",
    });
    navigate('/onboarding');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b py-4">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <span className="font-bold text-xl">VOLUNTUS</span>
          </Link>
          <Button variant="link" onClick={() => navigate('/onboarding')}>
            Return to Onboarding
          </Button>
        </div>
      </header>

      {/* Main content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold mb-4">Financial Questionnaire</h1>
            <p className="text-lg">
              Help us understand your financial goals and create a personalized investment strategy 
              tailored to your needs. This questionnaire is optional but highly recommended.
            </p>
          </div>

          <QuestionnaireComponent setCompleted={setIsCompleted} />

          <div className="flex justify-between mt-10">
            <Button 
              variant="outline" 
              onClick={() => navigate('/onboarding')}
            >
              Skip Questionnaire
            </Button>
            
            <Button 
              onClick={handleCompletion}
              disabled={!isCompleted}
            >
              Complete & Return to Onboarding
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;
