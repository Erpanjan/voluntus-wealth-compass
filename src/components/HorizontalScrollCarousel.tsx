
import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCarouselContent } from './carousel/CarouselContent';
import { useAutoScroll } from './carousel/hooks/useAutoScroll';
import { CAROUSEL_CONFIG } from './carousel/constants';
import CarouselCard from './carousel/CarouselCard';
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

  const { pauseAutoScroll, handleScroll } = useAutoScroll(
    containerRef,
    containerSections.length,
    isClient
  );

  // Show loading state during hydration
  if (!isClient) {
    return (
      <div className="w-full">
        <div className="mb-12 px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight text-gray-900">
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
    <div className="w-full bg-gray-50/30">
      {/* Header - Improved spacing and typography */}
      <div className="mb-12 px-4 sm:px-6 pt-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight text-gray-900 max-w-4xl">
          {t('home.whatWeCanHelp')}
        </h2>
      </div>

      {/* Carousel Container - Enhanced with better background */}
      <div 
        className="relative pb-8"
        onMouseEnter={pauseAutoScroll}
        onTouchStart={pauseAutoScroll}
        style={{
          paddingLeft: isMobile ? CAROUSEL_CONFIG.PADDING.MOBILE : CAROUSEL_CONFIG.PADDING.DESKTOP,
          paddingRight: isMobile ? CAROUSEL_CONFIG.PADDING.MOBILE : CAROUSEL_CONFIG.PADDING.DESKTOP,
        }}
      >
        {/* Scroll Container */}
        <div 
          ref={containerRef}
          className={cn(
            "w-full overflow-x-auto scroll-smooth hide-scrollbar",
            "snap-x snap-mandatory"
          )}
          onScroll={handleScroll}
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
              gap: isMobile ? '1.25rem' : '1.5rem',
              paddingTop: '8px',
              paddingBottom: '8px'
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

        {/* Subtle scroll indicators */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex space-x-1 opacity-40">
          {containerSections.map((_, index) => (
            <div
              key={index}
              className="w-1.5 h-1.5 bg-gray-400 rounded-full"
            />
          ))}
        </div>
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
