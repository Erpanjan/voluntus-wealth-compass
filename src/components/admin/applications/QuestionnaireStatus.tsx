
import React from 'react';
import { CheckCircle, XCircle, CircleDashed } from 'lucide-react';

interface QuestionnaireStatusProps {
  hasQuestionnaire: boolean;
  isCompleted?: boolean;
}

const QuestionnaireStatus: React.FC<QuestionnaireStatusProps> = ({ 
  hasQuestionnaire, 
  isCompleted 
}) => {
  if (hasQuestionnaire) {
    if (isCompleted) {
      return (
        <div className="flex items-center">
          <CheckCircle className="h-4 w-4 text-green-500 mr-1.5" />
          <span className="text-sm text-gray-700">Completed</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center">
          <CircleDashed className="h-4 w-4 text-amber-500 mr-1.5" />
          <span className="text-sm text-gray-700">Incomplete</span>
        </div>
      );
    }
  } else {
    return (
      <div className="flex items-center">
        <XCircle className="h-4 w-4 text-gray-400 mr-1.5" />
        <span className="text-sm text-gray-500">None</span>
      </div>
    );
  }
};

export default QuestionnaireStatus;
