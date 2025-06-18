
import React from 'react';
import { Button } from "@/components/ui/button";
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface NavigationDotsProps {
  sectionsLength: number;
  current: number;
  onNavigate: (index: number) => void;
}

const NavigationDots: React.FC<NavigationDotsProps> = ({
  sectionsLength,
  current,
  onNavigate
}) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex gap-2 sm:gap-3 md:gap-4 items-center">
      {Array.from({ length: sectionsLength }, (_, index) => (
        <Button 
          key={index} 
          variant="ghost" 
          size="sm" 
          className={cn(
            "p-0 flex items-center justify-center rounded-full transition-all duration-300 touch-manipulation", 
            isMobile ? "w-8 h-8 text-sm" : "w-10 h-10 sm:w-12 sm:h-12 text-base sm:text-lg",
            current === index ? "font-bold text-black" : "text-gray-400 font-normal hover:text-gray-600"
          )} 
          onClick={() => onNavigate(index)} 
          aria-label={`Go to section ${index + 1}`}
        >
          {index + 1}
        </Button>
      ))}
    </div>
  );
};

export default NavigationDots;
