
import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CarouselNavigationProps {
  canScrollPrev: boolean;
  canScrollNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
  isMobile: boolean;
}

const CarouselNavigation: React.FC<CarouselNavigationProps> = ({
  canScrollPrev,
  canScrollNext,
  onPrevious,
  onNext,
  isMobile
}) => {
  return (
    <>
      {/* Previous Button */}
      <Button
        variant="outline"
        size="icon"
        className={`absolute top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white border-gray-200 shadow-lg ${
          isMobile 
            ? 'left-2 h-10 w-10' 
            : 'left-4 lg:-left-16 h-12 w-12'
        } ${!canScrollPrev ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={onPrevious}
        disabled={!canScrollPrev}
        aria-label="Previous slide"
      >
        <ArrowLeft className={isMobile ? 'h-4 w-4' : 'h-5 w-5'} />
      </Button>

      {/* Next Button */}
      <Button
        variant="outline"
        size="icon"
        className={`absolute top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white border-gray-200 shadow-lg ${
          isMobile 
            ? 'right-2 h-10 w-10' 
            : 'right-4 lg:-right-16 h-12 w-12'
        } ${!canScrollNext ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={onNext}
        disabled={!canScrollNext}
        aria-label="Next slide"
      >
        <ArrowRight className={isMobile ? 'h-4 w-4' : 'h-5 w-5'} />
      </Button>
    </>
  );
};

export default CarouselNavigation;
