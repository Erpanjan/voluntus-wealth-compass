
import React from 'react';
import XScroll from '@/components/ui/x-scroll';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCarousel } from './carousel/useCarousel';
import { createCarouselSections } from './carousel/carouselData';
import CarouselHeader from './carousel/CarouselHeader';
import CarouselCard from './carousel/CarouselCard';
import CarouselIndicators from './carousel/CarouselIndicators';
import CarouselArrows from './carousel/CarouselArrows';

const HorizontalScrollCarousel = () => {
  const { t } = useLanguage();
  const containerSections = createCarouselSections(t);
  const { 
    scrollViewportRef, 
    isMobile, 
    isClient, 
    infiniteItems, 
    cardWidth,
    currentIndex,
    canScrollPrev,
    canScrollNext,
    scrollPrevious,
    scrollNext,
    scrollToIndex,
    totalItems
  } = useCarousel(containerSections);

  // Show loading state during hydration
  if (!isClient) {
    return (
      <div className="w-full">
        <CarouselHeader />
        <div className="flex justify-center items-center h-80">
          <div className="animate-pulse text-gray-400 text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full" role="region" aria-label="Services carousel">
      <CarouselHeader />

      {/* Enhanced Horizontal Scroll Container */}
      <div className="mx-auto w-full relative">
        {/* Navigation Arrows */}
        <CarouselArrows
          onPrevious={scrollPrevious}
          onNext={scrollNext}
          canScrollPrev={canScrollPrev}
          canScrollNext={canScrollNext}
          isMobile={isMobile}
        />

        <XScroll 
          ref={scrollViewportRef} 
          className="mobile-swipe-container"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          <div 
            className={`flex touch-manipulation ${
              isMobile 
                ? 'gap-3 p-3 pb-2' 
                : 'gap-12 px-6 md:px-12 pb-4 sm:pb-6 justify-start'
            }`}
          >
            {infiniteItems.map((section) => (
              <div
                key={section.id}
                style={{ scrollSnapAlign: 'center' }}
              >
                <CarouselCard
                  section={section}
                  cardWidth={cardWidth}
                  isMobile={isMobile}
                />
              </div>
            ))}
          </div>
        </XScroll>

        {/* Navigation Indicators */}
        <CarouselIndicators
          currentIndex={currentIndex}
          totalItems={totalItems}
          onIndicatorClick={scrollToIndex}
          isMobile={isMobile}
        />
      </div>
    </div>
  );
};

export default HorizontalScrollCarousel;
