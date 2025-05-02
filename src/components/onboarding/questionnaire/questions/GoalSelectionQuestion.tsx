
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Star } from 'lucide-react';
import { Goal } from '../types';
import { getNumberedBackground } from '../data';

interface GoalSelectionQuestionProps {
  questionNumber: number;
  goals: Goal[];
  selectedGoals: string[];
  onGoalSelection: (goalId: string, isChecked: boolean) => void;
  onAddCustomGoal: (goal: Goal) => void;
}

const GoalSelectionQuestion: React.FC<GoalSelectionQuestionProps> = ({ 
  questionNumber,
  goals, 
  selectedGoals, 
  onGoalSelection,
  onAddCustomGoal
}) => {
  const [customGoal, setCustomGoal] = useState('');

  const handleAddCustomGoal = () => {
    if (customGoal && !goals.some(goal => goal.name === customGoal)) {
      const newGoal: Goal = {
        id: `custom-${Date.now()}`,
        name: customGoal,
        icon: <Star className="h-5 w-5" />
      };
      onAddCustomGoal(newGoal);
      setCustomGoal('');
    }
  };

  return (
    <Card className="border-0 shadow-lg overflow-hidden">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-full ${getNumberedBackground(questionNumber)} text-white flex items-center justify-center font-bold`}>{questionNumber}</div>
            <h2 className="text-xl font-semibold">Select your financial goals</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {goals.map((goal) => (
              <div key={goal.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
                <Checkbox
                  id={`goal-${goal.id}`}
                  checked={selectedGoals.includes(goal.id)}
                  onCheckedChange={(checked) => onGoalSelection(goal.id, checked === true)}
                />
                <div className="flex items-center space-x-2">
                  <div className="h-6 w-6 flex items-center justify-center">{goal.icon}</div>
                  <Label htmlFor={`goal-${goal.id}`} className="cursor-pointer">
                    {goal.name}
                  </Label>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t">
            <Label htmlFor="custom-goal" className="block mb-2">Add a custom goal</Label>
            <div className="flex space-x-2">
              <Input
                id="custom-goal"
                placeholder="Enter a custom goal"
                value={customGoal}
                onChange={(e) => setCustomGoal(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={handleAddCustomGoal} 
                type="button" 
                disabled={!customGoal}
                className="whitespace-nowrap"
              >
                Add Goal
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoalSelectionQuestion;
