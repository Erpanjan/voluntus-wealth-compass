
import React from 'react';
import { cn } from '@/lib/utils';

interface ValueCardProps {
  title: string;
  subtitle: string;
  description: string;
  index: number;
}

const ValueCard: React.FC<ValueCardProps> = ({ title, subtitle, description, index }) => {
  return (
    <div 
      className="p-6 rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-300 max-w-md w-full"
      style={{ animationDelay: `${0.1 * index}s` }}
    >
      <h3 className="text-lg md:text-xl font-semibold mb-2">{title}</h3>
      <p className="text-sm text-voluntus-text-secondary mb-4">{subtitle}</p>
      <p className="text-voluntus-text-secondary">{description}</p>
    </div>
  );
};

export default ValueCard;
