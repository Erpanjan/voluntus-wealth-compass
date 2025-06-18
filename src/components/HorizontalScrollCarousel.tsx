
import React, { useEffect, useRef, useCallback } from 'react';
import XScroll from '@/components/ui/x-scroll';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ContentSection {
  id: string;
  title: string;
  content: React.ReactNode;
}

const HorizontalScrollCarousel = () => {
  const { t } = useLanguage();
  const scrollViewportRef = useRef<HTMLDivElement>(null);

  const containerSections: ContentSection[] = [
    {
      id: "gambling",
      title: t('container.gambling.title'),
      content: (
        <>
          <p className="mb-3 sm:mb-4 text-sm sm:text-base leading-6 sm:leading-7">
            {t('container.gambling.text1')}
          </p>
          <p className="text-sm sm:text-base leading-6 sm:leading-7">
            {t('container.gambling.text2')}
          </p>
        </>
      )
    },
    {
      id: "complicated",
      title: t('container.complicated.title'),
      content: (
        <>
          <p className="mb-3 sm:mb-4 text-sm sm:text-base leading-6 sm:leading-7">
            {t('container.complicated.text1')}
          </p>
          <p className="text-sm sm:text-base leading-6 sm:leading-7">
            {t('container.complicated.text2')}
          </p>
        </>
      )
    },
    {
      id: "best-interest",
      title: t('container.bestInterest.title'),
      content: (
        <>
          <p className="mb-3 sm:mb-4 text-sm sm:text-base leading-6 sm:leading-7">
            {t('container.bestInterest.text1')}
          </p>
          <p className="text-sm sm:text-base leading-6 sm:leading-7">
            {t('container.bestInterest.text2')}
          </p>
        </>
      )
    },
    {
      id: "accountability",
      title: t('container.accountability.title'),
      content: (
        <>
          <p className="mb-3 sm:mb-4 text-sm sm:text-base leading-6 sm:leading-7">
            {t('container.accountability.text1')}
          </p>
          <p className="text-sm sm:text-base leading-6 sm:leading-7">
            {t('container.accountability.text2')}
          </p>
        </>
      )
    },
    {
      id: "static-advice",
      title: t('container.staticAdvice.title'),
      content: (
        <>
          <p className="mb-3 sm:mb-4 text-sm sm:text-base leading-6 sm:leading-7">
            {t('container.staticAdvice.text1')}
          </p>
          <p className="text-sm sm:text-base leading-6 sm:leading-7">
            {t('container.staticAdvice.text2')}
          </p>
        </>
      )
    }
  ];

  // Create three copies for infinite scroll
  const infiniteItems = [
    ...containerSections.map((section, index) => ({ ...section, id: `${section.id}-1`, originalIndex: index })),
    ...containerSections.map((section, index) => ({ ...section, id: `${section.id}-2`, originalIndex: index })),
    ...containerSections.map((section, index) => ({ ...section, id: `${section.id}-3`, originalIndex: index }))
  ];

  // Calculate card width based on viewport - mobile-first responsive design
  const getCardWidth = () => {
    if (typeof window !== 'undefined') {
      const viewportWidth = window.innerWidth;
      if (viewportWidth < 640) return Math.min(320, viewportWidth * 0.85); // Mobile: 85% with max 320px
      if (viewportWidth < 1024) return viewportWidth * 0.7; // Tablet: 70% of viewport
      return Math.min(550, viewportWidth * 0.55); // Desktop: max 550px or 55% of viewport
    }
    return 320; // Mobile-first fallback
  };

  const cardWidth = getCardWidth();
  const cardGap = window.innerWidth < 640 ? 12 : window.innerWidth < 1024 ? 20 : 32;
  const totalCardWidth = cardWidth + cardGap;
  const sectionLength = containerSections.length;

  const handleScroll = useCallback(() => {
    const viewport = scrollViewportRef.current;
    if (!viewport) return;

    const { scrollLeft, scrollWidth, clientWidth } = viewport;
    const maxScroll = scrollWidth - clientWidth;
    const sectionWidth = totalCardWidth * sectionLength;

    // Reset to middle section when scrolling near the edges
    if (scrollLeft <= sectionWidth * 0.1) {
      viewport.scrollTo({
        left: scrollLeft + sectionWidth,
        behavior: 'auto'
      });
    } else if (scrollLeft >= maxScroll - sectionWidth * 0.1) {
      viewport.scrollTo({
        left: scrollLeft - sectionWidth,
        behavior: 'auto'
      });
    }
  }, [totalCardWidth, sectionLength]);

  useEffect(() => {
    const viewport = scrollViewportRef.current;
    if (!viewport) return;

    // Initial position to start in the middle section
    const initialPosition = totalCardWidth * sectionLength;
    viewport.scrollTo({
      left: initialPosition,
      behavior: 'auto'
    });

    // Add scroll listener with throttling
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    viewport.addEventListener('scroll', throttledScroll);
    
    // Handle window resize to recalculate card width
    const handleResize = () => {
      const newCardWidth = getCardWidth();
      const newCardGap = window.innerWidth < 640 ? 12 : window.innerWidth < 1024 ? 20 : 32;
      const newTotalCardWidth = newCardWidth + newCardGap;
      const newInitialPosition = newTotalCardWidth * sectionLength;
      viewport.scrollTo({
        left: newInitialPosition,
        behavior: 'auto'
      });
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      viewport.removeEventListener('scroll', throttledScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [handleScroll, totalCardWidth, sectionLength, cardGap]);

  return (
    <div className="w-full">
      {/* Header - Mobile optimized */}
      <div className="mb-6 sm:mb-8 md:mb-12 lg:mb-16 px-3 sm:px-4 md:px-6">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-semibold leading-tight">
          {t('home.whatWeCanHelp')}
        </h2>
      </div>

      {/* Horizontal Scroll Container - Mobile optimized */}
      <div className="mx-auto w-full">
        <XScroll ref={scrollViewportRef} className="mobile-swipe-container touch-manipulation">
          <div className="flex gap-3 sm:gap-5 md:gap-6 lg:gap-8 p-3 sm:p-4 md:p-6 pb-6 sm:pb-8 md:pb-12">
            {infiniteItems.map((section) => (
              <div
                key={section.id}
                className="shrink-0 rounded-xl sm:rounded-2xl md:rounded-3xl bg-white p-4 sm:p-5 md:p-6 lg:p-8 shadow-soft hover:shadow-hover transition-all duration-300 relative mobile-card-transition"
                style={{ 
                  width: `${cardWidth}px`, 
                  minHeight: window.innerWidth < 640 ? '280px' : window.innerWidth < 1024 ? '320px' : '380px'
                }}
              >
                {/* Progress Numbering Badge - Mobile optimized */}
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 md:top-5 md:right-5 lg:top-6 lg:right-6 bg-[#F2F2F2] text-[#666666] px-2 py-1 sm:px-2.5 sm:py-1 md:px-3 md:py-1.5 rounded-full text-xs sm:text-sm font-medium">
                  {section.originalIndex + 1}
                </div>
                
                <div className="h-full flex flex-col pt-1 sm:pt-2 md:pt-4">
                  <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-semibold text-[#333333] mb-3 sm:mb-4 md:mb-6 leading-tight pr-6 sm:pr-8 md:pr-0">
                    {section.title}
                  </h3>
                  <div className="text-[#666666] mb-4 sm:mb-5 md:mb-6 lg:mb-8 flex-1">
                    {section.content}
                  </div>
                  <Button 
                    asChild 
                    size={window.innerWidth < 640 ? "sm" : window.innerWidth < 1024 ? "default" : "lg"}
                    className="bg-black/90 hover:bg-black text-white transition-all duration-200 self-start text-xs sm:text-sm md:text-base mobile-touch-target"
                  >
                    <Link to="/services" className="inline-flex items-center">
                      {t('home.howWeCanHelp')} 
                      <ArrowRight 
                        size={window.innerWidth < 640 ? 14 : window.innerWidth < 1024 ? 16 : 18} 
                        className="ml-1.5 sm:ml-2" 
                      />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </XScroll>
      </div>
    </div>
  );
};

export default HorizontalScrollCarousel;
