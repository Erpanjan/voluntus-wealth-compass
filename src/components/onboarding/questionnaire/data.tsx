
import React from 'react';
import { 
  CircleCheck, 
  PiggyBank, 
  BarChart3, 
  Home, 
  Car, 
  Heart, 
  BookOpen, 
  Landmark, 
  Sparkles,
  Star
} from 'lucide-react';
import { Goal } from './types';

// Define financial goals with icons
export const defaultFinancialGoals: Goal[] = [
  { id: 'living-expenses', name: 'Living expenses', icon: <PiggyBank className="h-5 w-5" /> },
  { id: 'emergency-fund', name: 'Emergency Fund', icon: <CircleCheck className="h-5 w-5" /> },
  { id: 'wealth-accumulation', name: 'Wealth accumulation', icon: <BarChart3 className="h-5 w-5" /> },
  { id: 'education', name: 'Education', icon: <BookOpen className="h-5 w-5" /> },
  { id: 'legacy', name: 'Legacy', icon: <Landmark className="h-5 w-5" /> },
  { id: 'car', name: 'Buy a car', icon: <Car className="h-5 w-5" /> },
  { id: 'retirement', name: 'Retirement', icon: <Sparkles className="h-5 w-5" /> },
  { id: 'house', name: 'Buy a house', icon: <Home className="h-5 w-5" /> },
  { id: 'kids', name: 'Having kids', icon: <Heart className="h-5 w-5" /> },
  { id: 'marriage', name: 'Marriage', icon: <Heart className="h-5 w-5" /> },
  { id: 'medical', name: 'Medical & Health', icon: <CircleCheck className="h-5 w-5" /> }
];

// Define interest level options for goals
export const interestLevelOptions = [
  "Already planned",
  "Strongly interested",
  "Would consider",
  "Less likely to consider",
  "Would not consider"
];

// Define time horizon options for goals
export const timeHorizonOptions = [
  "Less than 1 year",
  "1 to 3 years",
  "4 to 7 years", 
  "8 to 15 years",
  "More than 15 years"
];

// Function to get background style for numbered questions
export const getNumberedBackground = (questionNumber: number) => {
  const colors = [
    'from-blue-500 to-blue-600',      // Step 1
    'from-indigo-500 to-indigo-600',  // Step 2
    'from-purple-500 to-purple-600',  // Step 3
    'from-fuchsia-500 to-fuchsia-600', // Step 4
    'from-pink-500 to-pink-600',      // Step 5
    'from-rose-500 to-rose-600',      // Step 6
    'from-orange-500 to-orange-600',  // Step 7
    'from-amber-500 to-amber-600',    // Step 8
    'from-yellow-500 to-yellow-600',  // Step 9
    'from-lime-500 to-lime-600',      // Step 10
    'from-green-500 to-green-600',    // Step 11
    'from-emerald-500 to-emerald-600', // Step 12
    'from-teal-500 to-teal-600',      // Step 13
    'from-cyan-500 to-cyan-600',      // Step 14
    'from-sky-500 to-sky-600'         // Step 15
  ];
  return `bg-gradient-to-br ${colors[questionNumber - 1] || colors[0]}`;
};

export const getLikertScale = (value: number) => {
  switch(value) {
    case 1: return "Strongly Disagree";
    case 2: return "Disagree";
    case 3: return "Neutral";
    case 4: return "Agree";
    case 5: return "Strongly Agree";
    default: return "Neutral";
  }
};
