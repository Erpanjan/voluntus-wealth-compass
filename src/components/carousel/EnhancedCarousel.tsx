
import React, { useCallback, useEffect, useState } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel';
import { useIsMobile } from '@/hooks/use-mobile';
import CarouselIndicators from './CarouselIndicators';
import { cn } from '@/lib/utils';

interface EnhancedCarouselProps {
  children: React.ReactNode[];
  autoplay?: boolean;
  autoplayDelay?: number;
  className?: string;
  showIndicators?: boolean;
  showNavigation?: boolean;
}

const EnhancedCarousel: React.FC<EnhancedCarouselProps> = ({
  children,
  autoplay = false,
  autoplayDelay = 5000,
  className,
  showIndicators = true,
  showNavigation = true,
}) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [isAutoplayPaused, setIsAutoplayPaused] = useState(false);
  const isMobile = useIsMobile();

  const updateCarouselState = useCallback(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    setCount(api.scrollSnapList().length);
  }, [api]);

  useEffect(() => {
    if (!api) return;

    updateCarouselState();
    api.on('select', updateCarouselState);
    api.on('reInit', updateCarouselState);

    return () => {
      api?.off('select', updateCarouselState);
    };
  }, [api, updateCarouselState]);

  // Autoplay functionality
  useEffect(() => {
    if (!api || !autoplay || isAutoplayPaused) return;

    const interval = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0); // Loop back to start
      }
    }, autoplayDelay);

    return () => clearInterval(interval);
  }, [api, autoplay, autoplayDelay, isAutoplayPaused]);

  const goToSlide = useCallback((index: number) => {
    api?.scrollTo(index);
  }, [api]);

  const handleMouseEnter = () => {
    if (autoplay) setIsAutoplayPaused(true);
  };

  const handleMouseLeave = () => {
    if (autoplay) setIsAutoplayPaused(false);
  };

  return (
    <div 
      className={cn("relative w-full", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Carousel
        setApi={setApi}
        className="w-full"
        opts={{
          align: "center",
          loop: true,
          skipSnaps: false,
          dragFree: false,
        }}
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {children.map((child, index) => (
            <CarouselItem
              key={index}
              className={cn(
                "pl-2 md:pl-4 basis-full",
                isMobile ? "min-h-[320px]" : "min-h-[400px]"
              )}
            >
              <div className={cn(
                "h-full transition-all duration-300",
                current === index ? "opacity-100 scale-100" : "opacity-70 scale-95"
              )}>
                {child}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {showNavigation && (
          <>
            <CarouselPrevious 
              className={cn(
                "transition-all duration-200 bg-white/90 hover:bg-white border-gray-200 shadow-md",
                isMobile ? "-left-2 h-8 w-8" : "-left-12 h-10 w-10"
              )}
            />
            <CarouselNext 
              className={cn(
                "transition-all duration-200 bg-white/90 hover:bg-white border-gray-200 shadow-md",
                isMobile ? "-right-2 h-8 w-8" : "-right-12 h-10 w-10"
              )}
            />
          </>
        )}
      </Carousel>

      {showIndicators && (
        <CarouselIndicators
          total={count}
          current={current}
          onDotClick={goToSlide}
          className="mt-6"
        />
      )}

      {/* Progress counter */}
      <div className="text-center mt-4">
        <span className="text-sm text-gray-500 font-medium">
          {current + 1} / {count}
        </span>
      </div>
    </div>
  );
};

export default EnhancedCarousel;
