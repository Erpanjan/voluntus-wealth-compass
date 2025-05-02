
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Star } from 'lucide-react';
import { Goal } from '../types';

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
    <Card className="border border-gray-200 shadow-sm overflow-hidden">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold">{questionNumber}. Future Expense Goals</h2>
            <p className="text-gray-600 text-sm">
              Indicate your level of interest in the following future expense items:
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {goals.map((goal) => (
              <div key={goal.id} className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <Checkbox
                  id={`goal-${goal.id}`}
                  checked={selectedGoals.includes(goal.id)}
                  onCheckedChange={(checked) => onGoalSelection(goal.id, checked === true)}
                  className="border-amber-500 data-[state=checked]:bg-amber-500"
                />
                <div className="flex items-center space-x-2">
                  <div className="h-5 w-5 flex items-center justify-center text-amber-600">{goal.icon}</div>
                  <Label htmlFor={`goal-${goal.id}`} className="cursor-pointer font-medium">
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
                className="flex-1 border-amber-200 focus-visible:ring-amber-500"
              />
              <Button 
                onClick={handleAddCustomGoal} 
                type="button" 
                disabled={!customGoal}
                className="whitespace-nowrap bg-amber-500 hover:bg-amber-600 text-white"
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
