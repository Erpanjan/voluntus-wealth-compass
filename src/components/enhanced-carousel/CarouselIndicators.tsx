
import React from 'react';

interface CarouselIndicatorsProps {
  totalSlides: number;
  currentSlide: number;
  onSlideSelect: (index: number) => void;
  isMobile: boolean;
}

const CarouselIndicators: React.FC<CarouselIndicatorsProps> = ({
  totalSlides,
  currentSlide,
  onSlideSelect,
  isMobile
}) => {
  return (
    <div className={`flex justify-center items-center space-x-2 ${
      isMobile ? 'mt-6' : 'mt-8'
    }`}>
      {/* Dot Indicators */}
      <div className="flex space-x-2">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <button
            key={index}
            className={`rounded-full transition-all duration-200 ${
              index === currentSlide
                ? isMobile 
                  ? 'w-6 h-2 bg-gray-900' 
                  : 'w-8 h-2 bg-gray-900'
                : isMobile 
                  ? 'w-2 h-2 bg-gray-300 hover:bg-gray-400' 
                  : 'w-3 h-3 bg-gray-300 hover:bg-gray-400'
            }`}
            onClick={() => onSlideSelect(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      
      {/* Progress Counter */}
      <div className={`ml-4 text-gray-500 font-medium ${
        isMobile ? 'text-sm' : 'text-base'
      }`}>
        {currentSlide + 1} / {totalSlides}
      </div>
    </div>
  );
};

export default CarouselIndicators;
