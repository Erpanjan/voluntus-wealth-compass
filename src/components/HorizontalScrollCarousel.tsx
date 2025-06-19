
import React from 'react';
import XScroll from '@/components/ui/x-scroll';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCarousel } from './carousel/useCarousel';
import { createCarouselSections } from './carousel/carouselData';
import CarouselHeader from './carousel/CarouselHeader';
import CarouselCard from './carousel/CarouselCard';

const HorizontalScrollCarousel = () => {
  const { t } = useLanguage();
  const containerSections = createCarouselSections(t);
  const { scrollViewportRef, isMobile, isClient, infiniteItems, cardWidth } = useCarousel(containerSections);

  // Show loading state during hydration
  if (!isClient) {
    return (
      <div className="w-full">
        <CarouselHeader />
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse text-gray-400">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <CarouselHeader />

      {/* Horizontal Scroll Container */}
      <div className="mx-auto w-full">
        <XScroll ref={scrollViewportRef} className="mobile-swipe-container">
          <div 
            className={`flex touch-manipulation ${
              isMobile 
                ? 'gap-3 p-3 pb-6' 
                : 'gap-12 px-6 md:px-12 pb-8 sm:pb-12 justify-start'
            }`}
          >
            {infiniteItems.map((section) => (
              <CarouselCard
                key={section.id}
                section={section}
                cardWidth={cardWidth}
                isMobile={isMobile}
              />
            ))}
          </div>
        </XScroll>
      </div>
    </div>
  );
};

export default HorizontalScrollCarousel;
