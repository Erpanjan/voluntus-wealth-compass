
import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useQuestionnaire } from '../QuestionnaireContext';

export const QuestionnaireHeader: React.FC = () => {
  const { points, progress } = useQuestionnaire();

  const getStepAchievement = (step: number) => {
    const achievements = [
      { name: "Foundation Builder", icon: "GaugeCircle", description: "Building your financial profile" },
      { name: "Financial Explorer", icon: "Star", description: "Exploring investment expertise" },
      { name: "Investment Apprentice", icon: "Award", description: "Setting financial goals" },
      { name: "Goal Hunter", icon: "Trophy", description: "Defining your risk tolerance" },
      { name: "Strategic Planner", icon: "CircleCheck", description: "Completing your financial strategy" }
    ];
    
    // Map step ranges to achievements
    if (step >= 1 && step <= 3) return achievements[0];
    if (step >= 4 && step <= 7) return achievements[1];
    if (step >= 8 && step <= 10) return achievements[2];
    if (step >= 11 && step <= 13) return achievements[3];
    return achievements[4];
  };

  const achievement = getStepAchievement(Math.ceil(progress / 7));

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <div>
            <span className="font-medium text-gray-800">{achievement.name}</span>
          </div>
        </div>
        <div className="flex items-center text-amber-500 font-bold">
          <Star className="h-4 w-4 mr-1" />
          <span>{points} points</span>
        </div>
      </div>
    </div>
  );
};
