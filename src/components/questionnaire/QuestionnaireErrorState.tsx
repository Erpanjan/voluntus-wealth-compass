
import React from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface QuestionnaireErrorStateProps {
  error: string | null;
  onRetry: () => void;
  onContinue: () => void;
}

const QuestionnaireErrorState: React.FC<QuestionnaireErrorStateProps> = ({
  error,
  onRetry,
  onContinue
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b py-4">
        <div className="container mx-auto px-6">
          <div className="flex items-center mb-4">
            <Button variant="ghost" onClick={() => navigate('/onboarding')} className="mr-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Onboarding
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <Alert variant="warning" className="mb-6">
            <AlertCircle className="h-4 w-4 mr-2" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>

          <div className="flex space-x-3">
            <Button onClick={onRetry}>
              Try Again
            </Button>
            <Button variant="outline" onClick={onContinue}>
              Continue Anyway
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionnaireErrorState;
