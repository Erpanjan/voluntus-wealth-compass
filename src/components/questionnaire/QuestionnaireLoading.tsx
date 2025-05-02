
import React from 'react';
import { Loader2 } from 'lucide-react';

const QuestionnaireLoading: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <Loader2 className="h-10 w-10 text-gray-400 animate-spin mb-4" />
      <p className="text-gray-600">Loading your questionnaire data...</p>
    </div>
  );
};

export default QuestionnaireLoading;
