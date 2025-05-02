
import React from 'react';
import { motion } from 'framer-motion';

interface QuestionCardProps {
  question: string;
  description?: string;
  children: React.ReactNode;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ 
  question, 
  description, 
  children 
}) => {
  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-800">{question}</h2>
        {description && <p className="text-gray-600">{description}</p>}
      </div>
      <div className="pt-4">
        {children}
      </div>
    </motion.div>
  );
};

export default QuestionCard;
