
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

type SectionData = {
  id: string;
  title: string;
  subtitle?: string; 
  content: React.ReactNode;
  background: 'white' | 'light' | 'dark';
};

interface SectionCarouselProps {
  sections: SectionData[];
  autoplayInterval?: number;
}

const SectionCarousel: React.FC<SectionCarouselProps> = ({
  sections,
  autoplayInterval = 10000
}) => {
  const [api, setApi] = useState<any>();
  const [current, setCurrent] = useState(0);
  const [autoplayPaused, setAutoplayPaused] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Handle scroll to selected section
  const scrollToSection = useCallback((index: number) => {
    if (!api) return;
    api.scrollTo(index);
    setCurrent(index);
  }, [api]);

  // Auto-scroll effect
  useEffect(() => {
    if (!api || autoplayPaused) return;
    
    const interval = setInterval(() => {
      api.scrollNext();
    }, autoplayInterval);

    return () => clearInterval(interval);
  }, [api, autoplayPaused, autoplayInterval]);

  // Sync current slide with carousel
  useEffect(() => {
    if (!api) return;
    
    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  // Check if section is in viewport
  useEffect(() => {
    const checkVisibility = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Consider visible when at least 30% of the container is in view
      const threshold = 0.3;
      const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
      const containerHeight = rect.height;
      
      setIsVisible(visibleHeight > containerHeight * threshold);
    };

    window.addEventListener('scroll', checkVisibility);
    checkVisibility(); // Check on mount
    
    return () => {
      window.removeEventListener('scroll', checkVisibility);
    };
  }, []);

  // Pause autoplay when interacting
  const handleMouseEnter = useCallback(() => setAutoplayPaused(true), []);
  const handleMouseLeave = useCallback(() => setAutoplayPaused(false), []);

  return (
    <div 
      ref={containerRef}
      className="relative h-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleMouseEnter}
      onTouchEnd={handleMouseLeave}
    >
      <Carousel
        setApi={setApi}
        className="w-full h-full"
        orientation="vertical"
        opts={{
          align: "start",
          loop: true,
          skipSnaps: false,
          dragFree: false,
          axis: 'y',
        }}
      >
        <CarouselContent className="h-full flex flex-col">
          {sections.map((section, index) => (
            <CarouselItem key={section.id} className="basis-full h-full flex-shrink-0">
              {section.content}
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      
      {/* Side navigation dots */}
      {isVisible && (
        <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-10">
          <div className="flex flex-col gap-3 items-center bg-white/80 backdrop-blur-sm rounded-full px-2 py-4">
            {sections.map((section, index) => (
              <Button
                key={section.id}
                variant="ghost"
                size="sm"
                className={cn(
                  "w-2.5 h-2.5 rounded-full p-0 transition-all duration-300 ease-in-out",
                  current === index 
                    ? "bg-black h-8" 
                    : "bg-gray-300 hover:bg-gray-400"
                )}
                onClick={() => scrollToSection(index)}
                aria-label={`Go to section ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SectionCarousel;
