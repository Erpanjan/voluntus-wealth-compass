
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface QuestionnaireHeaderProps {
  currentStep: number;
  totalSteps: number;
  progressPercentage: number;
  error: string | null;
}

const QuestionnaireHeader: React.FC<QuestionnaireHeaderProps> = ({
  currentStep,
  totalSteps,
  progressPercentage,
  error
}) => {
  const navigate = useNavigate();

  return (
    <>
      <motion.header 
        className="border-b py-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center mb-4">
            <Button variant="ghost" onClick={() => navigate('/onboarding')} className="mr-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Onboarding
            </Button>
          </div>
          <div className="w-full my-4">
            <div className="flex justify-between text-sm text-gray-500 mb-1">
              <span>Step {currentStep + 1} of {totalSteps}</span>
              {/* Completely removed the percentage display */}
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </div>
      </motion.header>

      {/* Notice banner for not logged in users */}
      {error && (
        <div className="bg-amber-50 border-b border-amber-100 py-2">
          <div className="container mx-auto px-6">
            <Alert variant="warning" className="bg-transparent border-none py-1 shadow-none">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              <AlertDescription className="text-amber-700 text-sm">
                {error} <Link to="/login" className="underline font-medium">Login here</Link>
              </AlertDescription>
            </Alert>
          </div>
        </div>
      )}
    </>
  );
};

export default QuestionnaireHeader;
