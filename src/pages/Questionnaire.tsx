
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
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-6 h-6">
                  <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm0 8.625a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM15.375 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zM8.625 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h1 className="text-2xl font-semibold">Financial Questionnaire</h1>
            </div>
            
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <p className="text-amber-700">
                This questionnaire will help us understand your financial situation and recommend the best investment 
                strategy for you. Your answers are confidential and will only be used to customize our advice.
                Remember that this questionnaire is optional and you can skip it if you prefer.
              </p>
            </div>
          </div>

          <QuestionnaireComponent setCompleted={setIsCompleted} />

          <div className="flex justify-between mt-8">
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
