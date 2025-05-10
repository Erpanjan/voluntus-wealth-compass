
import React, { useState, useEffect, useCallback } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

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
  const isMobile = useIsMobile();

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

  // Pause autoplay when interacting
  const handleMouseEnter = useCallback(() => setAutoplayPaused(true), []);
  const handleMouseLeave = useCallback(() => setAutoplayPaused(false), []);
  const handleTouch = useCallback(() => setAutoplayPaused(true), []);
  const handleTouchEnd = useCallback(() => {
    // Resume after short delay to allow for completing the tap
    setTimeout(() => setAutoplayPaused(false), 3000);
  }, []);

  return (
    <div className="relative flex flex-col w-full">
      {/* Redesigned header section for better mobile accessibility */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 mt-4 sm:mt-6 px-4 sm:px-0">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold mb-4 sm:mb-0">What We Can Help</h2>
        
        {/* Navigation numbers with larger touch targets */}
        <div className="flex gap-2 sm:gap-3 items-center">
          {sections.map((section, index) => (
            <Button 
              key={section.id} 
              variant="ghost" 
              size="sm" 
              className={cn(
                "w-10 h-10 p-0 flex items-center justify-center rounded-full transition-all duration-300 touch-manipulation", 
                current === index ? "font-bold text-black" : "text-gray-400 font-normal hover:text-gray-600"
              )} 
              onClick={() => scrollToSection(index)} 
              aria-label={`Go to section ${index + 1}`}
            >
              {index + 1}
            </Button>
          ))}
        </div>
      </div>
      
      <div 
        className="relative w-full" 
        onMouseEnter={handleMouseEnter} 
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouch} 
        onTouchEnd={handleTouchEnd}
      >
        <Carousel 
          setApi={setApi} 
          className="w-full" 
          opts={{
            align: "start",
            loop: true,
            skipSnaps: false,
            dragFree: false
          }}
        >
          <CarouselContent>
            {sections.map((section, index) => (
              <CarouselItem key={section.id} className="basis-full">
                <div className="w-full p-4 sm:p-6 pb-6 sm:pb-8 bg-[#F1F1F1] rounded-lg shadow-sm">
                  {/* Content container with better mobile layout */}
                  <div className="flex flex-col">
                    <div className="space-y-3 sm:space-y-5">
                      <h2 className="text-xl sm:text-2xl font-semibold text-black tracking-tight mb-2 sm:mb-4 line-height-tight">
                        {section.title}
                      </h2>
                      <div className="space-y-3 sm:space-y-4 text-[#9F9EA1] text-base sm:text-lg mobile-text-container">
                        {section.content}
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Larger touch targets for carousel navigation on mobile */}
          <CarouselPrevious className="hidden md:flex -left-12 lg:-left-16 h-10 w-10" />
          <CarouselNext className="hidden md:flex -right-12 lg:-right-16 h-10 w-10" />
        </Carousel>
      </div>
      
      {/* Mobile scroll indicator */}
      <div className="mt-4 flex justify-center md:hidden">
        <div className="flex gap-2">
          {sections.map((_, index) => (
            <span 
              key={index}
              className={cn(
                "block w-2 h-2 rounded-full transition-all", 
                current === index ? "bg-black" : "bg-gray-300"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SectionCarousel;
