
import React, { useEffect, useRef, useState } from 'react';
import XScroll from '@/components/ui/x-scroll';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCarouselDimensions } from './carousel/hooks/useCarouselDimensions';
import { useCarouselScroll } from './carousel/hooks/useCarouselScroll';
import { useCarouselContent } from './carousel/CarouselContent';
import { CAROUSEL_CONFIG } from './carousel/constants';
import CarouselCard from './carousel/CarouselCard';
import { InfiniteSection } from './carousel/types';

const HorizontalScrollCarousel = () => {
  const { t } = useLanguage();
  const scrollViewportRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Check if we're on mobile and if we're on the client
  useEffect(() => {
    setIsClient(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < CAROUSEL_CONFIG.MOBILE_BREAKPOINT);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { containerSections } = useCarouselContent();
  const { cardWidth, cardGap, totalCardWidth } = useCarouselDimensions(isClient, isMobile);

  // Create three copies for infinite scroll
  const infiniteItems: InfiniteSection[] = [
    ...containerSections.map((section, index) => ({ ...section, id: `${section.id}-1`, originalIndex: index })),
    ...containerSections.map((section, index) => ({ ...section, id: `${section.id}-2`, originalIndex: index })),
    ...containerSections.map((section, index) => ({ ...section, id: `${section.id}-3`, originalIndex: index }))
  ];

  const sectionLength = containerSections.length;

  useCarouselScroll(scrollViewportRef, totalCardWidth, sectionLength, isClient);

  // Show loading state during hydration
  if (!isClient) {
    return (
      <div className="w-full">
        <div className="mb-8 sm:mb-12 md:mb-16 px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold leading-tight">
            {t('home.whatWeCanHelp')}
          </h2>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse text-gray-400">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8 sm:mb-12 md:mb-16 px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold leading-tight">
          {t('home.whatWeCanHelp')}
        </h2>
      </div>

      {/* Enhanced One-Card Horizontal Scroll Container */}
      <div className="mx-auto w-full">
        <XScroll 
          ref={scrollViewportRef} 
          className="one-card-carousel scroll-smooth"
          style={{
            scrollSnapType: 'x mandatory',
            scrollBehavior: 'smooth'
          }}
        >
          <div 
            className="flex"
            style={{ 
              gap: `${cardGap}px`,
              // Smart padding system for one-card visibility
              paddingLeft: isMobile ? '5%' : '7.5%',
              paddingRight: isMobile ? '5%' : '7.5%',
              paddingTop: isMobile ? '12px' : '24px',
              paddingBottom: isMobile ? '32px' : '48px'
            }}
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
