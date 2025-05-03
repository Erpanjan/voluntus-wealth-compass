
import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

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
          <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
          <span>Completed</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center">
          <XCircle className="h-4 w-4 text-amber-500 mr-1" />
          <span>Incomplete</span>
        </div>
      );
    }
  } else {
    return (
      <div className="flex items-center">
        <XCircle className="h-4 w-4 text-gray-400 mr-1" />
        <span>None</span>
      </div>
    );
  }
};

export default QuestionnaireStatus;
