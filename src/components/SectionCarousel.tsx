
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
  const [isSticky, setIsSticky] = useState(false);
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionHeight = useRef<number>(0);
  const scrollThreshold = useRef<number>(0);
  
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

  // Initialize section height after component mounts
  useEffect(() => {
    if (containerRef.current) {
      sectionHeight.current = window.innerHeight; // Use viewport height as section height
      
      // Recalculate on resize
      const handleResize = () => {
        sectionHeight.current = window.innerHeight;
      };
      
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  // Handle sticky section scrolling behavior
  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize dimensions after the component is mounted
    const initializePositions = () => {
      if (!containerRef.current) return;
      
      // Get the initial position of the section
      const sectionTop = containerRef.current.getBoundingClientRect().top + window.scrollY;
      scrollThreshold.current = sectionTop - 100; // Buffer before section starts
      
      // Set height of container to accommodate all sections
      const totalSectionsHeight = sectionHeight.current * sections.length;
      if (containerRef.current) {
        containerRef.current.style.height = `${totalSectionsHeight}px`;
      }
    };
    
    // Call once to initialize
    initializePositions();
    
    // Also call after a short delay to ensure all elements have proper dimensions
    setTimeout(initializePositions, 500);
    
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const currentScrollY = window.scrollY;
      
      // Check if we've scrolled to the section
      if (currentScrollY >= scrollThreshold.current) {
        setIsVisible(true);
        
        // Calculate which section we're currently viewing based on scroll position
        const relativeScroll = currentScrollY - scrollThreshold.current;
        const totalCarouselHeight = sectionHeight.current * sections.length;
        
        // If we're within our virtual carousel height
        if (relativeScroll < totalCarouselHeight) {
          setIsSticky(true);
          
          // Calculate which slide to show based on scroll position
          const slideIndex = Math.min(
            Math.floor(relativeScroll / sectionHeight.current),
            sections.length - 1
          );
          
          // Only update if the section changed
          if (current !== slideIndex && api) {
            scrollToSection(slideIndex);
          }
          
          containerRef.current.style.position = 'sticky';
          containerRef.current.style.top = '0';
          
        } else {
          // User has scrolled past our virtual section
          setIsSticky(false);
          containerRef.current.style.position = 'relative';
        }
      } else {
        // We haven't reached the section yet
        setIsVisible(false);
        setIsSticky(false);
        containerRef.current.style.position = 'relative';
      }
    };
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on mount
    
    // Add resize event to recalculate dimensions
    window.addEventListener('resize', initializePositions);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', initializePositions);
    };
  }, [sections.length, current, api, scrollToSection]);

  // Manually handle scrolling to the navigation dot positions
  const handleDotClick = (index: number) => {
    scrollToSection(index);
    
    // Also scroll the window to the correct position
    const targetScrollPosition = scrollThreshold.current + (index * sectionHeight.current) + 10;
    window.scrollTo({
      top: targetScrollPosition,
      behavior: 'smooth'
    });
  };

  // Pause autoplay when interacting
  const handleMouseEnter = useCallback(() => setAutoplayPaused(true), []);
  const handleMouseLeave = useCallback(() => setAutoplayPaused(false), []);

  return (
    <div 
      ref={containerRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleMouseEnter}
      onTouchEnd={handleMouseLeave}
    >
      <div className={cn(
        "w-full h-screen transition-opacity duration-300",
        isSticky ? "fixed top-0 left-0" : "relative"
      )}>
        <Carousel
          setApi={setApi}
          className="w-full h-full"
          orientation="vertical"
          opts={{
            align: "start",
            loop: false,
            skipSnaps: false,
            dragFree: false,
            axis: 'y',
          }}
        >
          <CarouselContent className="h-full">
            {sections.map((section, index) => (
              <CarouselItem key={section.id} className="basis-full h-full">
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
                  onClick={() => handleDotClick(index)}
                  aria-label={`Go to section ${index + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SectionCarousel;
