
import React, { useState, useEffect, useRef, useCallback } from 'react';
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
}

const SectionCarousel: React.FC<SectionCarouselProps> = ({
  sections
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Array<HTMLDivElement | null>>(sections.map(() => null));
  const isMobile = useIsMobile();
  const [isScrolling, setIsScrolling] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Initialize scroll behavior
  useEffect(() => {
    if (!hasInitialized) {
      setTimeout(() => {
        setHasInitialized(true);
      }, 1000); // Allow time for the page to render
    }
  }, [hasInitialized]);

  // Handle scroll detection and section changes
  useEffect(() => {
    if (!hasInitialized) return;
    
    const handleScroll = () => {
      if (isScrolling || !containerRef.current) return;

      const scrollPosition = window.scrollY;
      const containerTop = containerRef.current.offsetTop;
      const containerHeight = containerRef.current.offsetHeight;
      const viewportHeight = window.innerHeight;
      
      // Calculate hero section height and problem statement section top position
      // The problem statement section is the second section (after hero)
      const heroSectionHeight = viewportHeight;  
      const problemSectionTop = heroSectionHeight;
      
      // Only show navigation dots when scroll is within the problem statement section bounds
      // Show only after we've scrolled past the hero section
      const isPastHero = scrollPosition > heroSectionHeight * 0.7;
      const isBeforeEnd = scrollPosition < (containerTop + containerHeight - viewportHeight/2);
      
      // Update visibility - only show when we're in the problem statement section
      setIsVisible(isPastHero && isBeforeEnd);
      
      if (isPastHero && isBeforeEnd) {
        // Calculate which section to display based on relative position within container
        const sectionHeight = viewportHeight; // Each section is viewport height
        const relativeScroll = scrollPosition - heroSectionHeight;
        const sectionIndex = Math.min(
          Math.floor(relativeScroll / sectionHeight),
          sections.length - 1
        );
        
        if (sectionIndex !== currentIndex && sectionIndex >= 0) {
          setCurrentIndex(sectionIndex);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentIndex, isScrolling, sections.length, hasInitialized]);

  // Scroll to selected section
  const scrollToSection = useCallback((index: number) => {
    setIsScrolling(true);
    
    if (containerRef.current) {
      const viewportHeight = window.innerHeight;
      const heroSectionHeight = viewportHeight;
      const targetY = heroSectionHeight + (index * viewportHeight);
      
      window.scrollTo({
        top: targetY,
        behavior: 'smooth'
      });
      
      // Set new active index and reset scrolling flag
      setTimeout(() => {
        setCurrentIndex(index);
        setIsScrolling(false);
      }, 800);
    }
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="relative scroll-snap-container" 
      style={{ height: `${sections.length * 100}vh` }}
    >
      {/* Navigation dots - only visible when within problem statements section */}
      <div className={cn(
        "fixed left-0 top-1/2 transform -translate-y-1/2 z-20 ml-4 lg:ml-8 transition-opacity duration-300",
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      )}>
        <div className="flex flex-col gap-3 items-center bg-white/80 backdrop-blur-sm rounded-full px-2 py-4 shadow-md">
          {sections.map((section, index) => (
            <Button
              key={section.id}
              variant="ghost"
              size="sm"
              className={cn(
                "rounded-full p-0 transition-all duration-300 ease-in-out h-2.5 min-w-0",
                currentIndex === index 
                  ? "bg-black w-2.5 h-8" 
                  : "bg-gray-300 hover:bg-gray-400 w-2.5 h-2.5"
              )}
              onClick={() => scrollToSection(index)}
              aria-label={`Go to section ${index + 1}`}
            />
          ))}
        </div>
      </div>
      
      {/* Section content */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden">
        {sections.map((section, index) => (
          <div 
            key={section.id} 
            ref={el => sectionRefs.current[index] = el}
            className={cn(
              "absolute top-0 left-0 w-full h-screen transition-opacity duration-500",
              index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            )}
          >
            {section.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionCarousel;
