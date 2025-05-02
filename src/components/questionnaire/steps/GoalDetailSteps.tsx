
import React from 'react';
import { useQuestionnaire } from '../QuestionnaireContext';
import GoalTimelineQuestion from '../questions/GoalTimelineQuestion';
import GoalRiskAppetiteQuestion from '../questions/GoalRiskAppetiteQuestion';
import GoalRiskToleranceQuestion from '../questions/GoalRiskToleranceQuestion';
import GoalMarketResponseQuestion from '../questions/GoalMarketResponseQuestion';

interface GoalDetailStepsProps {
  step: number;
}

const GoalDetailSteps: React.FC<GoalDetailStepsProps> = ({ step }) => {
  const { answers, updateAnswer, currentGoal, handleGoalQuestionComplete } = useQuestionnaire();
  
  // Map global step to local step
  const localStep = step - 10; // Steps 10-13 in the main flow
  
  if (!currentGoal) return null;

  const updateGoalDetail = (detailType: string, value: string) => {
    updateAnswer('goalDetails', {
      ...answers.goalDetails,
      [currentGoal.id]: {
        ...(answers.goalDetails?.[currentGoal.id] || {}),
        [detailType]: value
      }
    });
  };

  switch (localStep) {
    case 0:
      return (
        <GoalTimelineQuestion 
          goal={currentGoal} 
          value={answers.goalDetails?.[currentGoal.id]?.timeline} 
          onChange={(val) => updateGoalDetail('timeline', val)}
          onComplete={handleGoalQuestionComplete}
        />
      ); 
    case 1:
      return (
        <GoalRiskAppetiteQuestion 
          goal={currentGoal}
          value={answers.goalDetails?.[currentGoal.id]?.riskAppetite}
          onChange={(val) => updateGoalDetail('riskAppetite', val)}
          onComplete={handleGoalQuestionComplete}
        />
      );
    case 2:
      return (
        <GoalRiskToleranceQuestion 
          goal={currentGoal}
          value={answers.goalDetails?.[currentGoal.id]?.riskTolerance}
          onChange={(val) => updateGoalDetail('riskTolerance', val)}
          onComplete={handleGoalQuestionComplete}
        />
      );
    case 3:
      return (
        <GoalMarketResponseQuestion 
          goal={currentGoal}
          riskTolerance={answers.goalDetails?.[currentGoal.id]?.riskTolerance}
          value={answers.goalDetails?.[currentGoal.id]?.marketResponse}
          onChange={(val) => updateGoalDetail('marketResponse', val)}
          onComplete={handleGoalQuestionComplete}
        />
      );
    default:
      return null;
  }
};

export default GoalDetailSteps;
