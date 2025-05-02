
import { useState } from 'react';
import { GoalType } from '../types/questionnaireTypes';

export const useGoalSelection = (answers: Record<string, any>) => {
  // State to track which goal we're currently asking about for questions 11-14
  const [currentGoalIndex, setCurrentGoalIndex] = useState(0);
  
  // Function to get selected goals (used for goal-specific questions)
  const getSelectedGoals = (): GoalType[] => {
    console.log("All goals:", answers.goals);
    const filteredGoals = answers.goals?.filter((goal: GoalType) => {
      const interestLevel = goal.interestLevel?.toLowerCase();
      console.log(`Goal: ${goal.name}, Interest Level: ${interestLevel}`);
      return (
        interestLevel === 'already-planned' || 
        interestLevel === 'strongly-interested' || 
        interestLevel === 'would-consider'
      );
    }) || [];
    
    console.log("Filtered goals:", filteredGoals);
    return filteredGoals;
  };
  
  // Get the current goal for goal-specific questions
  const selectedGoals = getSelectedGoals();
  const currentGoal = selectedGoals[currentGoalIndex] || null;
  
  return {
    currentGoalIndex,
    setCurrentGoalIndex,
    getSelectedGoals,
    currentGoal
  };
};
