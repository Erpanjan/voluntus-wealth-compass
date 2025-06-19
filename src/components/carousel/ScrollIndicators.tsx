
import React from 'react';
import { cn } from '@/lib/utils';

interface ScrollIndicatorsProps {
  total: number;
  current: number;
  onIndicatorClick: (index: number) => void;
  className?: string;
}

const ScrollIndicators: React.FC<ScrollIndicatorsProps> = ({
  total,
  current,
  onIndicatorClick,
  className
}) => {
  return (
    <div className={cn("flex justify-center gap-2 mt-6", className)}>
      {Array.from({ length: total }, (_, index) => (
        <button
          key={index}
          onClick={() => onIndicatorClick(index)}
          className={cn(
            "w-2 h-2 rounded-full transition-all duration-300",
            current === index 
              ? "bg-black w-6" 
              : "bg-gray-300 hover:bg-gray-400"
          )}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </div>
  );
};

export default ScrollIndicators;
