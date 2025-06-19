
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CarouselArrowsProps {
  onPrevious: () => void;
  onNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  isMobile: boolean;
}

const CarouselArrows: React.FC<CarouselArrowsProps> = ({
  onPrevious,
  onNext,
  canScrollPrev,
  canScrollNext,
  isMobile
}) => {
  if (isMobile) return null; // Hide arrows on mobile for touch interaction

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        onClick={onPrevious}
        disabled={!canScrollPrev}
        className={`absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-soft border-gray-200 transition-all duration-300 ${
          canScrollPrev ? 'opacity-100' : 'opacity-50'
        }`}
        aria-label="Previous slide"
      >
        <ChevronLeft size={20} />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        onClick={onNext}
        disabled={!canScrollNext}
        className={`absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-soft border-gray-200 transition-all duration-300 ${
          canScrollNext ? 'opacity-100' : 'opacity-50'
        }`}
        aria-label="Next slide"
      >
        <ChevronRight size={20} />
      </Button>
    </>
  );
};

export default CarouselArrows;
