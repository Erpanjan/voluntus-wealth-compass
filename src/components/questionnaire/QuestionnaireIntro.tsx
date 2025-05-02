
import React from 'react';
import { motion } from 'framer-motion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface QuestionnaireIntroProps {
  submitError: string | null;
}

const QuestionnaireIntro: React.FC<QuestionnaireIntroProps> = ({ submitError }) => {
  return (
    <motion.div 
      className="mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h1 className="text-2xl font-semibold mb-2">Financial Questionnaire</h1>
      <p className="text-gray-600">
        This questionnaire will help us understand your financial goals and preferences.
        Your progress is automatically saved as you go.
      </p>
      
      {submitError && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertDescription>{submitError}</AlertDescription>
        </Alert>
      )}
    </motion.div>
  );
};

export default QuestionnaireIntro;
