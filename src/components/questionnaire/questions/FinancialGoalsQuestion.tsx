
import React, { useState } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import QuestionCard from '../QuestionCard';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface FinancialGoalType {
  id: string;
  name: string;
  interestLevel: string;
  isCustom?: boolean;
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

// Interest level options with consistent lowercase kebab-case values
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
      interestLevel: 'would-not-consider', // Use consistent lowercase kebab-case
      isCustom: false
    })),
    // Add 'Other' as a special case
    {
      id: 'other',
      name: 'Other',
      interestLevel: 'would-not-consider', // Use consistent lowercase kebab-case
      isCustom: false
    }
  ];

  // Handle interest level change for a goal
  const handleInterestChange = (goalId: string, interestLevel: string) => {
    console.log(`Setting goal ${goalId} interest level to: ${interestLevel}`);
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
      interestLevel: 'strongly-interested', // Use consistent lowercase kebab-case
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

  // Get standard goals
  const standardGoals = goals.filter(goal => !goal.isCustom);

  return (
    <QuestionCard 
      question="Indicate your level of interest in the following future expense items."
      description="For each goal, select your level of interest. You can also add custom goals."
    >
      <div className="space-y-6">
        {/* Predefined goals - Table layout */}
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="w-1/3">Financial Goal</TableHead>
                <TableHead>Level of Interest</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {standardGoals.map((goal) => (
                <TableRow key={goal.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{goal.name}</TableCell>
                  <TableCell>
                    <RadioGroup 
                      value={goal.interestLevel} 
                      onValueChange={(value) => handleInterestChange(goal.id, value)}
                      className="flex flex-wrap gap-2"
                    >
                      {interestLevels.map((level) => (
                        <div key={level.value} className="flex items-center space-x-1.5 bg-white border rounded-lg px-2 py-1 hover:bg-gray-50">
                          <RadioGroupItem value={level.value} id={`${goal.id}-${level.value}`} />
                          <Label 
                            htmlFor={`${goal.id}-${level.value}`}
                            className="cursor-pointer text-xs whitespace-nowrap"
                          >
                            {level.label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {/* Custom goals section */}
        <div className="pt-4">
          <h3 className="font-medium mb-4">Custom Goals</h3>
          
          {/* Add custom goal input */}
          <div className="flex gap-3 mb-4">
            <Input
              placeholder="Enter custom goal name"
              value={customGoalName}
              onChange={(e) => setCustomGoalName(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={handleAddCustomGoal}
              disabled={!customGoalName.trim()}
              size="sm"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
          
          {/* List of custom goals */}
          {customGoals.length > 0 ? (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="w-1/3">Custom Goal</TableHead>
                    <TableHead>Level of Interest</TableHead>
                    <TableHead className="w-20">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customGoals.map((goal) => (
                    <TableRow key={goal.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{goal.name}</TableCell>
                      <TableCell>
                        <RadioGroup 
                          value={goal.interestLevel} 
                          onValueChange={(value) => handleInterestChange(goal.id, value)}
                          className="flex flex-wrap gap-2"
                        >
                          {interestLevels.map((level) => (
                            <div key={level.value} className="flex items-center space-x-1.5 bg-white border rounded-lg px-2 py-1 hover:bg-gray-50">
                              <RadioGroupItem value={level.value} id={`${goal.id}-${level.value}`} />
                              <Label 
                                htmlFor={`${goal.id}-${level.value}`}
                                className="cursor-pointer text-xs whitespace-nowrap"
                              >
                                {level.label}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteCustomGoal(goal.id)}
                          className="text-gray-500 hover:text-red-500"
                        >
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-gray-500 text-sm italic">No custom goals added yet.</p>
          )}
        </div>
      </div>
    </QuestionCard>
  );
};

export default FinancialGoalsQuestion;
