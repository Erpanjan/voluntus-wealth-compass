
import React, { useCallback, useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

interface ContentSection {
  id: string;
  title: string;
  content: React.ReactNode;
}

const EnhancedHorizontalCarousel = () => {
  const { t } = useLanguage();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [autoplayPlugin] = useState(() => 
    Autoplay({ delay: 5000, stopOnInteraction: true, stopOnMouseEnter: true })
  );

  const containerSections: ContentSection[] = [
    {
      id: "gambling",
      title: t('container.gambling.title'),
      content: (
        <>
          <p className="mb-6 text-base sm:text-lg leading-relaxed text-gray-600">
            {t('container.gambling.text1')}
          </p>
          <p className="text-base sm:text-lg leading-relaxed text-gray-600">
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
          <p className="mb-6 text-base sm:text-lg leading-relaxed text-gray-600">
            {t('container.complicated.text1')}
          </p>
          <p className="text-base sm:text-lg leading-relaxed text-gray-600">
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
          <p className="mb-6 text-base sm:text-lg leading-relaxed text-gray-600">
            {t('container.bestInterest.text1')}
          </p>
          <p className="text-base sm:text-lg leading-relaxed text-gray-600">
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
          <p className="mb-6 text-base sm:text-lg leading-relaxed text-gray-600">
            {t('container.accountability.text1')}
          </p>
          <p className="text-base sm:text-lg leading-relaxed text-gray-600">
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
          <p className="mb-6 text-base sm:text-lg leading-relaxed text-gray-600">
            {t('container.staticAdvice.text1')}
          </p>
          <p className="text-base sm:text-lg leading-relaxed text-gray-600">
            {t('container.staticAdvice.text2')}
          </p>
        </>
      )
    }
  ];

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });

    // Handle autoplay state changes
    const handleAutoplayStop = () => setIsAutoPlaying(false);
    const handleAutoplayPlay = () => setIsAutoPlaying(true);

    autoplayPlugin.on("autoplay:stop", handleAutoplayStop);
    autoplayPlugin.on("autoplay:play", handleAutoplayPlay);

    return () => {
      autoplayPlugin.off("autoplay:stop", handleAutoplayStop);
      autoplayPlugin.off("autoplay:play", handleAutoplayPlay);
    };
  }, [api, autoplayPlugin]);

  const toggleAutoplay = useCallback(() => {
    if (!autoplayPlugin) return;
    
    if (isAutoPlaying) {
      autoplayPlugin.stop();
    } else {
      autoplayPlugin.play();
    }
  }, [autoplayPlugin, isAutoPlaying]);

  const scrollToPrevious = useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const scrollToNext = useCallback(() => {
    api?.scrollNext();
  }, [api]);

  const scrollTo = useCallback((index: number) => {
    api?.scrollTo(index);
  }, [api]);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-12 md:mb-16 px-4 sm:px-6">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight text-gray-900">
          {t('home.whatWeCanHelp')}
        </h2>
      </div>

      {/* Enhanced Carousel Container */}
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <Carousel
          setApi={setApi}
          className="w-full"
          plugins={[autoplayPlugin]}
          opts={{
            align: "center",
            loop: true,
            skipSnaps: false,
            dragFree: false,
          }}
        >
          <CarouselContent className="-ml-4">
            {containerSections.map((section, index) => (
              <CarouselItem key={section.id} className="pl-4">
                <div className="w-full flex justify-center">
                  <div className="w-full max-w-4xl bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-500 ease-out transform hover:-translate-y-1">
                    <div className="p-8 sm:p-10 md:p-12 lg:p-16">
                      <div className="text-center mb-8">
                        <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 leading-tight mb-8">
                          {section.title}
                        </h3>
                        <div className="max-w-3xl mx-auto">
                          {section.content}
                        </div>
                      </div>
                      
                      <div className="flex justify-center mt-10">
                        <Button 
                          asChild 
                          size="lg"
                          className="bg-gray-900 hover:bg-gray-800 text-white transition-all duration-300 px-8 py-4 text-lg font-medium rounded-full shadow-md hover:shadow-lg transform hover:scale-105"
                        >
                          <Link to="/services" className="inline-flex items-center">
                            {t('home.howWeCanHelp')} 
                            <ArrowRight size={20} className="ml-3 transition-transform group-hover:translate-x-1" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Custom Navigation Arrows */}
          <div className="hidden md:block">
            <Button
              variant="outline"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/90 backdrop-blur-sm border-gray-200 hover:bg-white hover:scale-110 transition-all duration-200 shadow-lg z-10"
              onClick={scrollToPrevious}
            >
              <ChevronLeft className="h-6 w-6 text-gray-700" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/90 backdrop-blur-sm border-gray-200 hover:bg-white hover:scale-110 transition-all duration-200 shadow-lg z-10"
              onClick={scrollToNext}
            >
              <ChevronRight className="h-6 w-6 text-gray-700" />
            </Button>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex justify-between items-center mt-6 px-4">
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-full"
              onClick={scrollToPrevious}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-full"
              onClick={scrollToNext}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </Carousel>

        {/* Dots Indicator */}
        <div className="flex justify-center items-center mt-8 space-x-6">
          <div className="flex items-center space-x-2">
            {Array.from({ length: count }).map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === current - 1
                    ? 'bg-gray-900 scale-125'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                onClick={() => scrollTo(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
          
          {/* Autoplay Control */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleAutoplay}
            className="text-gray-500 hover:text-gray-700 p-2"
            aria-label={isAutoPlaying ? "Pause autoplay" : "Resume autoplay"}
          >
            {isAutoPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Progress Indicator */}
        <div className="text-center mt-4 text-sm text-gray-500">
          {current} of {count}
        </div>
      </div>
    </div>
  );
};

export default EnhancedHorizontalCarousel;
