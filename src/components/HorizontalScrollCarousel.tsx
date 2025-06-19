
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
      setIsMobile(window.innerWidth < 768);
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
          <p className="mb-6 text-base sm:text-lg leading-7 sm:leading-8 text-gray-700">
            {t('container.gambling.text1')}
          </p>
          <p className="text-base sm:text-lg leading-7 sm:leading-8 text-gray-700">
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
          <p className="mb-6 text-base sm:text-lg leading-7 sm:leading-8 text-gray-700">
            {t('container.complicated.text1')}
          </p>
          <p className="text-base sm:text-lg leading-7 sm:leading-8 text-gray-700">
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
          <p className="mb-6 text-base sm:text-lg leading-7 sm:leading-8 text-gray-700">
            {t('container.bestInterest.text1')}
          </p>
          <p className="text-base sm:text-lg leading-7 sm:leading-8 text-gray-700">
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
          <p className="mb-6 text-base sm:text-lg leading-7 sm:leading-8 text-gray-700">
            {t('container.accountability.text1')}
          </p>
          <p className="text-base sm:text-lg leading-7 sm:leading-8 text-gray-700">
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
          <p className="mb-6 text-base sm:text-lg leading-7 sm:leading-8 text-gray-700">
            {t('container.staticAdvice.text1')}
          </p>
          <p className="text-base sm:text-lg leading-7 sm:leading-8 text-gray-700">
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

  // Calculate card width for one-card-at-a-time display
  const getCardWidth = useCallback(() => {
    if (!isClient || typeof window === 'undefined') return 350;
    
    const viewportWidth = window.innerWidth;
    if (viewportWidth < 768) {
      // Mobile: 95% of viewport width for immersive experience
      return Math.min(viewportWidth * 0.95, viewportWidth - 20);
    } else {
      // Web: 85-90% of viewport width, max 900px for optimal reading
      return Math.min(900, viewportWidth * 0.87);
    }
  }, [isClient]);

  const [cardWidth, setCardWidth] = useState(() => getCardWidth());
  const cardGap = isMobile ? 20 : 40; // Larger gap for better separation
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
            className={`flex ${isMobile ? 'gap-5 p-3 pb-8' : 'gap-10 p-6 pb-12'}`}
            style={{ paddingLeft: isMobile ? '2.5%' : '6.5%', paddingRight: isMobile ? '2.5%' : '6.5%' }}
          >
            {infiniteItems.map((section) => (
              <div
                key={section.id}
                className="shrink-0 rounded-3xl bg-white shadow-lg hover:shadow-xl transition-all duration-500 relative premium-card"
                style={{ 
                  width: `${cardWidth}px`,
                  minHeight: isMobile ? '420px' : '500px',
                  scrollSnapAlign: 'center',
                  scrollSnapStop: 'always'
                }}
              >
                {/* Enhanced Progress Numbering Badge */}
                <div className={`absolute bg-gradient-to-r from-gray-100 to-gray-50 text-gray-800 rounded-full font-semibold shadow-sm ${
                  isMobile ? 'top-4 right-4 px-3 py-2 text-sm' : 'top-6 right-6 px-4 py-2 text-base'
                }`}>
                  {section.originalIndex + 1}
                </div>
                
                <div className={`h-full flex flex-col ${isMobile ? 'p-6 pt-5' : 'p-8 md:p-10 lg:p-12'}`}>
                  <h3 className={`font-bold text-black mb-6 sm:mb-8 leading-tight ${
                    isMobile ? 'text-xl pr-12' : 'text-2xl md:text-3xl lg:text-4xl pr-16'
                  }`}>
                    {section.title}
                  </h3>
                  <div className={`flex-1 ${isMobile ? 'mb-6' : 'mb-8'}`}>
                    {section.content}
                  </div>
                  <Button 
                    asChild 
                    size={isMobile ? "default" : "lg"}
                    className="bg-black hover:bg-gray-900 text-white transition-all duration-300 self-start shadow-md hover:shadow-lg transform hover:scale-[1.02]"
                  >
                    <Link to="/services" className="inline-flex items-center font-medium">
                      {t('home.howWeCanHelp')} <ArrowRight size={isMobile ? 16 : 20} className="ml-3" />
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
