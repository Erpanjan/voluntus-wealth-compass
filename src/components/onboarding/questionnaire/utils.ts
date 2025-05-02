
import { QuestionnaireAnswers, Goal } from './types';

export const updateNestedAnswer = (
  answers: QuestionnaireAnswers, 
  section: string, 
  subsection: string, 
  value: any
): QuestionnaireAnswers => {
  if (section === 'behavioralBiases') {
    const updatedBiases = {
      ...answers.behavioralBiases,
      [subsection]: value
    };

    return {
      ...answers,
      behavioralBiases: updatedBiases
    };
  } else if (section === 'riskAppetite' || section === 'absoluteRiskTolerance') {
    const updatedRecord = {
      ...answers[section as 'riskAppetite' | 'absoluteRiskTolerance'],
      [subsection]: value
    };
    
    return {
      ...answers,
      [section]: updatedRecord
    };
  }
  
  return answers;
};

export const getGoalById = (goals: Goal[], goalId: string): Goal | undefined => {
  return goals.find(goal => goal.id === goalId);
};

export const updateGoalHorizon = (
  answers: QuestionnaireAnswers,
  goalId: string, 
  horizon: string
): QuestionnaireAnswers => {
  return {
    ...answers,
    goalHorizons: {
      ...answers.goalHorizons,
      [goalId]: horizon
    }
  };
};

export const updateGoalInterestLevel = (
  answers: QuestionnaireAnswers,
  goalId: string, 
  level: string
): QuestionnaireAnswers => {
  return {
    ...answers,
    goalInterestLevels: {
      ...answers.goalInterestLevels,
      [goalId]: level
    }
  };
};

export const moveGoalUp = (
  answers: QuestionnaireAnswers, 
  index: number, 
  priorityType: 'priorities' | 'risks'
): QuestionnaireAnswers => {
  if (index <= 0) return answers;
  
  if (priorityType === 'priorities') {
    const newPriorities = [...answers.goalPriorities];
    [newPriorities[index], newPriorities[index - 1]] = [newPriorities[index - 1], newPriorities[index]];
    return {...answers, goalPriorities: newPriorities};
  } else {
    const newRiskPreferences = [...answers.goalRiskPreferences];
    [newRiskPreferences[index], newRiskPreferences[index - 1]] = [newRiskPreferences[index - 1], newRiskPreferences[index]];
    return {...answers, goalRiskPreferences: newRiskPreferences};
  }
};

export const moveGoalDown = (
  answers: QuestionnaireAnswers, 
  index: number, 
  priorityType: 'priorities' | 'risks'
): QuestionnaireAnswers => {
  const list = priorityType === 'priorities' 
    ? answers.goalPriorities
    : answers.goalRiskPreferences;
    
  if (index >= list.length - 1) return answers;
  
  if (priorityType === 'priorities') {
    const newPriorities = [...answers.goalPriorities];
    [newPriorities[index], newPriorities[index + 1]] = [newPriorities[index + 1], newPriorities[index]];
    return {...answers, goalPriorities: newPriorities};
  } else {
    const newRiskPreferences = [...answers.goalRiskPreferences];
    [newRiskPreferences[index], newRiskPreferences[index + 1]] = [newRiskPreferences[index + 1], newRiskPreferences[index]];
    return {...answers, goalRiskPreferences: newRiskPreferences};
  }
};
