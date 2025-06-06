
import React, { useState, useEffect } from 'react';
import QuestionCard from '../QuestionCard';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown, GripVertical } from 'lucide-react';

interface GoalType {
  id: string;
  name: string;
  interestLevel: string;
}

interface GoalPrioritiesQuestionProps {
  goals: GoalType[];
  value: string[];
  onChange: (value: string[]) => void;
}

const GoalPrioritiesQuestion: React.FC<GoalPrioritiesQuestionProps> = ({ goals, value = [], onChange }) => {
  // Additional safety filter to ensure only relevant goals are included
  const filteredGoals = goals.filter(goal => {
    const interestLevel = goal.interestLevel?.toLowerCase();
    return (
      interestLevel === 'already-planned' || 
      interestLevel === 'strongly-interested' || 
      interestLevel === 'would-consider'
    );
  });
  
  console.log("GoalPrioritiesQuestion - Goals received:", goals);
  console.log("GoalPrioritiesQuestion - Filtered goals:", filteredGoals);
  
  // Initialize ranked goals with either the provided value or the filtered goals in their original order
  const [rankedGoals, setRankedGoals] = useState<GoalType[]>(() => {
    if (value.length > 0) {
      // Re-order goals based on the saved value
      const reorderedGoals = value
        .map(goalId => filteredGoals.find(g => g.id === goalId))
        .filter(Boolean) as GoalType[];
      
      // Add any goals that weren't in the value array
      const includedIds = new Set(value);
      const remainingGoals = filteredGoals.filter(g => !includedIds.has(g.id));
      
      return [...reorderedGoals, ...remainingGoals];
    }
    return [...filteredGoals];
  });

  // Update ranked goals if the filtered goals change
  useEffect(() => {
    if (filteredGoals.length !== rankedGoals.length) {
      setRankedGoals(filteredGoals);
    }
  }, [filteredGoals]);

  const moveGoal = (index: number, direction: 'up' | 'down') => {
    const newRankedGoals = [...rankedGoals];
    if (direction === 'up' && index > 0) {
      // Swap with the previous item
      [newRankedGoals[index], newRankedGoals[index - 1]] = [newRankedGoals[index - 1], newRankedGoals[index]];
    } else if (direction === 'down' && index < newRankedGoals.length - 1) {
      // Swap with the next item
      [newRankedGoals[index], newRankedGoals[index + 1]] = [newRankedGoals[index + 1], newRankedGoals[index]];
    }
    
    setRankedGoals(newRankedGoals);
    // Update the parent component with the new order (just the IDs)
    onChange(newRankedGoals.map(goal => goal.id));
  };

  return (
    <QuestionCard 
      question="Rank the financial goals below in the order of least acceptable to fail."
      description="Drag or use the arrows to reorder your goals based on priority. The most important goal should be at the top."
    >
      {rankedGoals.length > 0 ? (
        <div className="space-y-2 mt-6">
          {rankedGoals.map((goal, index) => (
            <div 
              key={goal.id}
              className="flex items-center gap-2 p-4 bg-white border rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center justify-center w-8 h-8 bg-amber-100 rounded-full text-amber-800 font-semibold">
                {index + 1}
              </div>
              <GripVertical className="h-5 w-5 text-gray-400" />
              <div className="flex-1">
                <p className="font-medium">{goal.name}</p>
              </div>
              <div className="flex flex-col gap-1">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="px-2 h-7"
                  onClick={() => moveGoal(index, 'up')}
                  disabled={index === 0}
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="px-2 h-7"
                  onClick={() => moveGoal(index, 'down')}
                  disabled={index === rankedGoals.length - 1}
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-4 text-center">
          <p className="text-gray-600">No goals found. Please select at least one financial goal to continue.</p>
        </div>
      )}
    </QuestionCard>
  );
};

export default GoalPrioritiesQuestion;
