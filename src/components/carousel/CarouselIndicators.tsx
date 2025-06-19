
import React from 'react';
import { cn } from '@/lib/utils';

interface CarouselIndicatorsProps {
  total: number;
  current: number;
  onDotClick: (index: number) => void;
  className?: string;
}

const CarouselIndicators: React.FC<CarouselIndicatorsProps> = ({
  total,
  current,
  onDotClick,
  className,
}) => {
  return (
    <div className={cn("flex justify-center items-center space-x-2", className)}>
      {Array.from({ length: total }, (_, index) => (
        <button
          key={index}
          onClick={() => onDotClick(index)}
          className={cn(
            "w-2 h-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400",
            current === index
              ? "bg-black w-8 h-2" // Active dot is elongated
              : "bg-gray-300 hover:bg-gray-400"
          )}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </div>
  );
};

export default CarouselIndicators;
