
import React, { useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import CarouselHeader from './HorizontalScrollCarousel/CarouselHeader';
import CarouselContainer from './HorizontalScrollCarousel/CarouselContainer';
import { useCarouselDimensions } from './HorizontalScrollCarousel/hooks/useCarouselDimensions';
import { useInfiniteScroll } from './HorizontalScrollCarousel/hooks/useInfiniteScroll';
import { useCarouselData } from './HorizontalScrollCarousel/hooks/useCarouselData';

const HorizontalScrollCarousel = () => {
  const { t } = useLanguage();
  const scrollViewportRef = useRef<HTMLDivElement>(null);
  
  // Custom hooks for clean separation of concerns
  const { cardWidth, totalCardWidth, isMobile, isClient } = useCarouselDimensions();
  const { containerSections, infiniteItems } = useCarouselData();
  
  // Setup infinite scroll behavior
  useInfiniteScroll({
    scrollViewportRef,
    totalCardWidth,
    sectionLength: containerSections.length,
    isClient
  });

  // Show loading state during hydration
  if (!isClient) {
    return (
      <div className="w-full">
        <CarouselHeader title={t('home.whatWeCanHelp')} />
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse text-gray-400">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <CarouselHeader title={t('home.whatWeCanHelp')} />
      <CarouselContainer
        scrollViewportRef={scrollViewportRef}
        infiniteItems={infiniteItems}
        cardWidth={cardWidth}
        isMobile={isMobile}
      />
    </div>
  );
};

export default HorizontalScrollCarousel;
