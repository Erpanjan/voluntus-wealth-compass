
import { ReactNode } from 'react';
import { Home, Shield, TrendingUp, GraduationCap, HeartHandshake, Car, Landmark, Building, Baby, Heart, Activity, Star } from 'lucide-react';
import { Goal } from './types';

export const getNumberedBackground = (num: number): string => {
  return 'bg-amber-500';
};

export const getLikertScale = (value: number): string => {
  switch (value) {
    case 1:
      return 'Strongly Disagree';
    case 2:
      return 'Disagree';
    case 3:
      return 'Neutral';
    case 4:
      return 'Agree';
    case 5:
      return 'Strongly Agree';
    default:
      return 'Neutral';
  }
};

export const timeHorizonOptions = [
  'Less than 1 year',
  '1 to 3 years',
  '4 to 7 years',
  '8 to 15 years',
  'More than 15 years'
];

export const defaultFinancialGoals: Goal[] = [
  { id: 'living-expenses', name: 'Living expenses', icon: <Home className="h-5 w-5" /> },
  { id: 'emergency-fund', name: 'Emergency Fund', icon: <Shield className="h-5 w-5" /> },
  { id: 'wealth-accumulation', name: 'Wealth accumulation', icon: <TrendingUp className="h-5 w-5" /> },
  { id: 'education', name: 'Education', icon: <GraduationCap className="h-5 w-5" /> },
  { id: 'legacy', name: 'Legacy', icon: <HeartHandshake className="h-5 w-5" /> },
  { id: 'buy-car', name: 'Buy a car', icon: <Car className="h-5 w-5" /> },
  { id: 'retirement', name: 'Retirement', icon: <Landmark className="h-5 w-5" /> },
  { id: 'buy-house', name: 'Buy a house', icon: <Building className="h-5 w-5" /> },
  { id: 'having-kids', name: 'Having kids', icon: <Baby className="h-5 w-5" /> },
  { id: 'marriage', name: 'Marriage', icon: <Heart className="h-5 w-5" /> },
  { id: 'medical-health', name: 'Medical & Health', icon: <Activity className="h-5 w-5" /> }
];

export const goalInterestOptions = [
  'Already planned',
  'Strongly interested',
  'Would consider',
  'Less likely to consider',
  'Would not consider'
];
