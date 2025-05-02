
import React from 'react';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { useQuestionnaire } from '../QuestionnaireContext';

export const AchievementNotification: React.FC = () => {
  const { achievementUnlocked } = useQuestionnaire();
  
  if (!achievementUnlocked) return null;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="fixed top-4 right-4 z-50 bg-gradient-to-r from-amber-400 to-amber-600 text-white p-4 rounded-lg shadow-lg"
    >
      <div className="flex items-center space-x-3">
        <Trophy className="h-6 w-6" />
        <div>
          <p className="font-bold">Achievement Unlocked!</p>
          <p>{achievementUnlocked}</p>
        </div>
      </div>
    </motion.div>
  );
};
