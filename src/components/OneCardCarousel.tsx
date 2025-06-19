
import React, { useEffect, useRef, useCallback, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { useLanguage } from '@/contexts/LanguageContext';
import CarouselCard from './enhanced-carousel/CarouselCard';
import CarouselNavigation from './enhanced-carousel/CarouselNavigation';
import CarouselIndicators from './enhanced-carousel/CarouselIndicators';

interface ContentSection {
  id: string;
  title: string;
  content: React.ReactNode;
}

const OneCardCarousel = () => {
  const { t } = useLanguage();
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  // Autoplay plugin with smart pause behavior
  const autoplayRef = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true,
      align: 'center',
      skipSnaps: false,
      dragFree: false
    },
    [autoplayRef.current]
  );

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
          <p className="mb-4">
            {t('container.gambling.text1')}
          </p>
          <p>
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
          <p className="mb-4">
            {t('container.complicated.text1')}
          </p>
          <p>
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
          <p className="mb-4">
            {t('container.bestInterest.text1')}
          </p>
          <p>
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
          <p className="mb-4">
            {t('container.accountability.text1')}
          </p>
          <p>
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
          <p className="mb-4">
            {t('container.staticAdvice.text1')}
          </p>
          <p>
            {t('container.staticAdvice.text2')}
          </p>
        </>
      )
    }
  ];

  // Navigation handlers
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback((index: number) => {
    if (emblaApi) emblaApi.scrollTo(index);
  }, [emblaApi]);

  // Update scroll states
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCurrentSlide(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        scrollPrev();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        scrollNext();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [scrollPrev, scrollNext]);

  // Setup embla event listeners
  useEffect(() => {
    if (!emblaApi) return;

    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);

    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

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

      {/* Carousel Container */}
      <div className="relative">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {containerSections.map((section, index) => (
              <div 
                key={section.id}
                className="flex-none w-full"
              >
                <CarouselCard 
                  section={{ ...section, originalIndex: index }}
                  isMobile={isMobile}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        <CarouselNavigation
          canScrollPrev={canScrollPrev}
          canScrollNext={canScrollNext}
          onPrevious={scrollPrev}
          onNext={scrollNext}
          isMobile={isMobile}
        />
      </div>

      {/* Indicators and Progress */}
      <CarouselIndicators
        totalSlides={containerSections.length}
        currentSlide={currentSlide}
        onSlideSelect={scrollTo}
        isMobile={isMobile}
      />
    </div>
  );
};

export default OneCardCarousel;
