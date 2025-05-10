
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

  return (
    <div className="relative h-full flex flex-col">
      {/* Redesigned header section - title with navigation numbers next to it */}
      <div className="flex justify-between items-center mb-10 mt-6">
        <h2 className="text-3xl md:text-4xl font-semibold">How We Can Help</h2>
        
        {/* Navigation numbers replaced dots */}
        <div className="flex gap-3 items-center">
          {sections.map((section, index) => (
            <Button
              key={section.id}
              variant="ghost"
              size="sm"
              className={cn(
                "w-6 h-6 p-0 flex items-center justify-center rounded-full transition-all duration-300",
                current === index 
                  ? "font-bold text-black" 
                  : "text-gray-400 font-normal hover:text-gray-600"
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
        className="relative h-full flex-1"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleMouseEnter}
        onTouchEnd={handleMouseLeave}
      >
        <Carousel
          setApi={setApi}
          className="w-full h-full"
          opts={{
            align: "start",
            loop: true,
            skipSnaps: false,
            dragFree: false,
          }}
        >
          <CarouselContent className="h-full">
            {sections.map((section, index) => (
              <CarouselItem key={section.id} className="basis-full h-full flex items-center">
                <div className="w-full h-full p-6 bg-[#F1F1F1] rounded-lg shadow-sm">
                  {section.content}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="hidden md:flex -left-12 lg:-left-16" />
          <CarouselNext className="hidden md:flex -right-12 lg:-right-16" />
        </Carousel>
      </div>
      
      {/* Section indicator with numbers */}
      <div className="flex justify-center mt-6 gap-2">
        {sections.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToSection(index)}
            className={cn(
              "text-sm px-2 py-1 transition-all duration-300",
              current === index 
                ? "font-semibold text-black border-b-2 border-black" 
                : "text-gray-500 hover:text-gray-800"
            )}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SectionCarousel;
