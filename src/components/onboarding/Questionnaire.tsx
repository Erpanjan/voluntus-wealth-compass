
import React from 'react';
import QuestionnairePage from './questionnaire';

interface QuestionnaireProps {
  setCompleted: (completed: boolean) => void;
}

const Questionnaire: React.FC<QuestionnaireProps> = ({ setCompleted }) => {
  return <QuestionnairePage setCompleted={setCompleted} />;
};

export default Questionnaire;
