import React, { useEffect, useRef, useCallback, useState } from 'react';
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
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Check if we're on mobile and if we're on the client
  useEffect(() => {
    setIsClient(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const containerSections: ContentSection[] = [
    {
      id: "gambling",
      title: t('container.gambling.title'),
      content: (
        <>
          <p className="mb-4 text-sm sm:text-base leading-6 sm:leading-7">
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
          <p className="mb-4 text-sm sm:text-base leading-6 sm:leading-7">
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
          <p className="mb-4 text-sm sm:text-base leading-6 sm:leading-7">
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
          <p className="mb-4 text-sm sm:text-base leading-6 sm:leading-7">
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
          <p className="mb-4 text-sm sm:text-base leading-6 sm:leading-7">
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

  // Calculate card width based on viewport - one card for web, multiple for mobile
  const getCardWidth = useCallback(() => {
    if (!isClient || typeof window === 'undefined') return 300; // Fallback for SSR
    
    const viewportWidth = window.innerWidth;
    if (viewportWidth < 640) {
      // Mobile: keep existing behavior - 85% of viewport, max 280px
      return Math.min(280, viewportWidth * 0.85);
    } else {
      // Web/Desktop: one card at a time - container width minus padding
      const containerPadding = viewportWidth < 1024 ? 48 : 96; // 3rem or 6rem total padding
      return Math.min(800, viewportWidth - containerPadding);
    }
  }, [isClient]);

  const [cardWidth, setCardWidth] = useState(() => getCardWidth());
  // Adjust gap based on screen size and single-card display
  const cardGap = isMobile ? 12 : 48; // Larger gap for web to ensure proper spacing
  const totalCardWidth = cardWidth + cardGap;
  const sectionLength = containerSections.length;

  // Update card width on resize
  useEffect(() => {
    if (!isClient) return;
    
    const handleResize = () => {
      const newCardWidth = getCardWidth();
      setCardWidth(newCardWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [getCardWidth, isClient]);

  const handleScroll = useCallback(() => {
    const viewport = scrollViewportRef.current;
    if (!viewport || !isClient) return;

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
  }, [totalCardWidth, sectionLength, isClient]);

  useEffect(() => {
    const viewport = scrollViewportRef.current;
    if (!viewport || !isClient) return;

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

    viewport.addEventListener('scroll', throttledScroll, { passive: true });
    
    return () => {
      viewport.removeEventListener('scroll', throttledScroll);
    };
  }, [handleScroll, totalCardWidth, sectionLength, isClient]);

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
              <div
                key={section.id}
                className="shrink-0 rounded-2xl sm:rounded-3xl bg-white shadow-soft hover:shadow-hover transition-shadow duration-300 relative mobile-card-transition"
                style={{ 
                  width: `${cardWidth}px`,
                  minHeight: isMobile ? '280px' : '400px'
                }}
              >
                {/* Progress Numbering Badge */}
                <div className={`absolute bg-gray-100 text-gray-700 rounded-full text-xs sm:text-sm font-medium ${
                  isMobile ? 'top-3 right-3 px-2 py-1' : 'top-4 right-4 md:top-6 md:right-6 px-3 py-1.5'
                }`}>
                  {section.originalIndex + 1}
                </div>
                
                <div className={`h-full flex flex-col ${isMobile ? 'p-4 pt-3' : 'p-6 md:p-8 lg:p-10 pt-4'}`}>
                  <h3 className={`font-semibold text-black mb-4 sm:mb-6 leading-tight ${
                    isMobile ? 'text-lg pr-6' : 'text-xl md:text-2xl lg:text-3xl pr-8 sm:pr-0'
                  }`}>
                    {section.title}
                  </h3>
                  <div className={`text-gray-600 flex-1 ${isMobile ? 'mb-4' : 'mb-6 sm:mb-8'}`}>
                    {section.content}
                  </div>
                  <Button 
                    asChild 
                    size={isMobile ? "sm" : "lg"}
                    className="bg-black/80 hover:bg-black text-white transition-all duration-200 self-start mobile-touch-target"
                  >
                    <Link to="/services" className="inline-flex items-center">
                      {t('home.howWeCanHelp')} <ArrowRight size={isMobile ? 14 : 18} className="ml-2" />
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
