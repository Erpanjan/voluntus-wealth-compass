
import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCarouselContent } from './carousel/CarouselContent';
import { useAutoScroll } from './carousel/hooks/useAutoScroll';
import { CAROUSEL_CONFIG } from './carousel/constants';
import CarouselCard from './carousel/CarouselCard';
import ScrollIndicators from './carousel/ScrollIndicators';
import { cn } from '@/lib/utils';

const HorizontalScrollCarousel = () => {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Check if we're on mobile and client-side
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
  
  // Create sections for smooth infinite scroll (3 copies)
  const infiniteItems = [
    ...containerSections.map((section, index) => ({ ...section, id: `${section.id}-1`, originalIndex: index })),
    ...containerSections.map((section, index) => ({ ...section, id: `${section.id}-2`, originalIndex: index })),
    ...containerSections.map((section, index) => ({ ...section, id: `${section.id}-3`, originalIndex: index }))
  ];

  const { currentIndex, scrollToIndex, pauseAutoScroll } = useAutoScroll(
    containerRef,
    containerSections.length,
    isClient
  );

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

      {/* Improved One-Card Carousel */}
      <div 
        className="relative"
        onMouseEnter={pauseAutoScroll}
        onTouchStart={pauseAutoScroll}
        style={{
          paddingLeft: isMobile ? CAROUSEL_CONFIG.PADDING.MOBILE : CAROUSEL_CONFIG.PADDING.DESKTOP,
          paddingRight: isMobile ? CAROUSEL_CONFIG.PADDING.MOBILE : CAROUSEL_CONFIG.PADDING.DESKTOP,
        }}
      >
        <div 
          ref={containerRef}
          className={cn(
            "w-full overflow-x-auto scroll-smooth hide-scrollbar",
            "snap-x snap-mandatory"
          )}
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            scrollPaddingLeft: isMobile ? CAROUSEL_CONFIG.PADDING.MOBILE : CAROUSEL_CONFIG.PADDING.DESKTOP,
            scrollPaddingRight: isMobile ? CAROUSEL_CONFIG.PADDING.MOBILE : CAROUSEL_CONFIG.PADDING.DESKTOP,
          }}
        >
          <div 
            className="flex"
            style={{ 
              gap: isMobile ? CAROUSEL_CONFIG.GAP.MOBILE : CAROUSEL_CONFIG.GAP.DESKTOP,
              paddingTop: isMobile ? '12px' : '24px',
              paddingBottom: isMobile ? '12px' : '24px'
            }}
          >
            {infiniteItems.map((section) => (
              <CarouselCard
                key={section.id}
                section={section}
                isMobile={isMobile}
              />
            ))}
          </div>
        </div>

        {/* Scroll Indicators */}
        <ScrollIndicators
          total={containerSections.length}
          current={currentIndex}
          onIndicatorClick={(index) => {
            scrollToIndex(index);
            pauseAutoScroll();
          }}
        />
      </div>

      {/* CSS for hiding scrollbar */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `
      }} />
    </div>
  );
};

export default HorizontalScrollCarousel;
