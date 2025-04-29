
import React, { useState, useEffect, useCallback } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
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
    <div 
      className="relative h-full"
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
              {section.content}
            </CarouselItem>
          ))}
        </CarouselContent>

        <div className="absolute left-0 bottom-12 w-full z-10 flex justify-center">
          <div className="flex gap-3 items-center bg-white/80 backdrop-blur-sm rounded-full px-4 py-2">
            {sections.map((section, index) => (
              <Button
                key={section.id}
                variant="ghost"
                size="sm"
                className={cn(
                  "w-2.5 h-2.5 rounded-full p-0 transition-all duration-300 ease-in-out",
                  current === index 
                    ? "bg-black w-8" 
                    : "bg-gray-300 hover:bg-gray-400"
                )}
                onClick={() => scrollToSection(index)}
                aria-label={`Go to section ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <CarouselPrevious className="hidden md:flex -left-12 lg:-left-16" />
        <CarouselNext className="hidden md:flex -right-12 lg:-right-16" />
      </Carousel>
    </div>
  );
};

export default SectionCarousel;
