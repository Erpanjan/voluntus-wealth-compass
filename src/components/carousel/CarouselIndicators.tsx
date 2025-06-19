
import React from 'react';

interface CarouselIndicatorsProps {
  currentIndex: number;
  totalItems: number;
  onIndicatorClick: (index: number) => void;
  isMobile: boolean;
}

const CarouselIndicators: React.FC<CarouselIndicatorsProps> = ({
  currentIndex,
  totalItems,
  onIndicatorClick,
  isMobile
}) => {
  return (
    <div className={`flex justify-center items-center gap-2 ${isMobile ? 'mt-4' : 'mt-6'}`}>
      {Array.from({ length: totalItems }, (_, index) => (
        <button
          key={index}
          onClick={() => onIndicatorClick(index)}
          className={`transition-all duration-300 rounded-full ${
            index === currentIndex
              ? 'bg-black w-8 h-2'
              : 'bg-gray-300 hover:bg-gray-400 w-2 h-2'
          }`}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </div>
  );
};

export default CarouselIndicators;
