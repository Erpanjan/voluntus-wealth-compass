
import React, { useState } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import QuestionCard from '../QuestionCard';

interface FinancialGoalType {
  id: string;
  name: string;
  interestLevel: string;
  isCustom?: boolean; // Adding the isCustom property as optional
}

interface FinancialGoalsQuestionProps {
  value: FinancialGoalType[];
  onChange: (value: FinancialGoalType[]) => void;
}

// Predefined goal options
const predefinedGoals = [
  'Living expenses',
  'Emergency Fund',
  'Wealth accumulation',
  'Education',
  'Legacy',
  'Buy a car',
  'Retirement',
  'Buy a house',
  'Having kids',
  'Marriage',
  'Medical & Health',
];

// Interest level options
const interestLevels = [
  { value: 'already-planned', label: 'Already planned' },
  { value: 'strongly-interested', label: 'Strongly interested' },
  { value: 'would-consider', label: 'Would consider' },
  { value: 'less-likely', label: 'Less likely to consider' },
  { value: 'would-not-consider', label: 'Would not consider' },
];

const FinancialGoalsQuestion: React.FC<FinancialGoalsQuestionProps> = ({ value = [], onChange }) => {
  const [customGoalName, setCustomGoalName] = useState('');
  
  // Initialize goals if empty
  const goals: FinancialGoalType[] = value.length > 0 ? value : [
    ...predefinedGoals.map(name => ({
      id: uuidv4(),
      name,
      interestLevel: 'would-not-consider',
      isCustom: false // Explicitly set isCustom to false for predefined goals
    })),
    // Add 'Other' as a special case
    {
      id: 'other',
      name: 'Other',
      interestLevel: 'would-not-consider',
      isCustom: false // Explicitly set isCustom to false for the 'Other' option
    }
  ];

  // Handle interest level change for a goal
  const handleInterestChange = (goalId: string, interestLevel: string) => {
    const updatedGoals = goals.map(goal => 
      goal.id === goalId ? { ...goal, interestLevel } : goal
    );
    onChange(updatedGoals);
  };

  // Add custom goal
  const handleAddCustomGoal = () => {
    if (!customGoalName.trim()) return;
    
    const newCustomGoal: FinancialGoalType = {
      id: uuidv4(),
      name: customGoalName,
      interestLevel: 'strongly-interested',
      isCustom: true
    };
    
    onChange([...goals, newCustomGoal]);
    setCustomGoalName('');
  };

  // Delete custom goal
  const handleDeleteCustomGoal = (goalId: string) => {
    const updatedGoals = goals.filter(goal => goal.id !== goalId);
    onChange(updatedGoals);
  };

  // Get custom goals
  const customGoals = goals.filter(goal => goal.isCustom === true);

  return (
    <QuestionCard 
      question="Indicate your level of interest in the following future expense items."
      description="For each goal, select your level of interest. You can also add custom goals."
    >
      <div className="space-y-8">
        {/* Predefined goals */}
        <div className="space-y-6">
          {goals.filter(goal => !goal.isCustom).map((goal) => (
            <div key={goal.id} className="border rounded-lg p-4">
              <div className="font-medium mb-3">{goal.name}</div>
              <RadioGroup 
                value={goal.interestLevel} 
                onValueChange={(value) => handleInterestChange(goal.id, value)}
                className="flex flex-wrap gap-3"
              >
                {interestLevels.map((level) => (
                  <div key={level.value} className="flex items-center space-x-2 bg-white border rounded-lg px-3 py-2 hover:bg-gray-50">
                    <RadioGroupItem value={level.value} id={`${goal.id}-${level.value}`} />
                    <Label 
                      htmlFor={`${goal.id}-${level.value}`}
                      className="cursor-pointer text-sm"
                    >
                      {level.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ))}
        </div>
        
        {/* Custom goals section */}
        <div className="border-t pt-6">
          <h3 className="font-medium mb-4">Custom Goals</h3>
          
          {/* Add custom goal input */}
          <div className="flex gap-3 mb-6">
            <Input
              placeholder="Enter custom goal name"
              value={customGoalName}
              onChange={(e) => setCustomGoalName(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={handleAddCustomGoal}
              disabled={!customGoalName.trim()}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Custom Goal
            </Button>
          </div>
          
          {/* List of custom goals */}
          {customGoals.length > 0 && (
            <div className="space-y-4">
              {customGoals.map((goal) => (
                <div key={goal.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <div className="font-medium">{goal.name}</div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteCustomGoal(goal.id)}
                    >
                      Remove
                    </Button>
                  </div>
                  <RadioGroup 
                    value={goal.interestLevel} 
                    onValueChange={(value) => handleInterestChange(goal.id, value)}
                    className="flex flex-wrap gap-3"
                  >
                    {interestLevels.map((level) => (
                      <div key={level.value} className="flex items-center space-x-2 bg-white border rounded-lg px-3 py-2 hover:bg-gray-50">
                        <RadioGroupItem value={level.value} id={`${goal.id}-${level.value}`} />
                        <Label 
                          htmlFor={`${goal.id}-${level.value}`}
                          className="cursor-pointer text-sm"
                        >
                          {level.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </QuestionCard>
  );
};

export default FinancialGoalsQuestion;
