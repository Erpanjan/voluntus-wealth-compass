
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
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Array<HTMLDivElement | null>>(sections.map(() => null));
  const isMobile = useIsMobile();
  const [isScrolling, setIsScrolling] = useState(false);

  // Handle scroll detection and section changes
  useEffect(() => {
    const handleScroll = () => {
      if (isScrolling || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const containerCenter = containerRect.top + containerRect.height / 2;
      
      // Determine which section is most visible based on its position relative to the viewport
      let minDistance = Infinity;
      let newIndex = currentIndex;
      
      sectionRefs.current.forEach((sectionRef, index) => {
        if (!sectionRef) return;
        
        const sectionRect = sectionRef.getBoundingClientRect();
        const sectionCenter = sectionRect.top + sectionRect.height / 2;
        const distance = Math.abs(containerCenter - sectionCenter);
        
        if (distance < minDistance) {
          minDistance = distance;
          newIndex = index;
        }
      });
      
      if (newIndex !== currentIndex) {
        setCurrentIndex(newIndex);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentIndex, isScrolling]);

  // Scroll to selected section
  const scrollToSection = useCallback((index: number) => {
    setIsScrolling(true);
    
    if (sectionRefs.current[index]) {
      const yOffset = -100; // Offset to account for any headers
      const sectionTop = sectionRefs.current[index]?.getBoundingClientRect().top ?? 0;
      const y = sectionTop + window.scrollY + yOffset;
      
      window.scrollTo({ top: y, behavior: 'smooth' });
      
      // Set new active index and reset scrolling flag
      setTimeout(() => {
        setCurrentIndex(index);
        setIsScrolling(false);
      }, 800);
    }
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {/* Navigation dots */}
      <div className="fixed left-0 top-1/2 transform -translate-y-1/2 z-10 ml-4 lg:ml-8">
        <div className="flex flex-col gap-3 items-center bg-white/80 backdrop-blur-sm rounded-full px-2 py-4">
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
      <div className="min-h-screen">
        {sections.map((section, index) => (
          <div 
            key={section.id} 
            ref={el => sectionRefs.current[index] = el}
            className={cn(
              "min-h-screen transition-opacity duration-500",
              index === currentIndex ? "opacity-100" : "opacity-0"
            )}
            style={{ 
              position: index === currentIndex ? 'relative' : 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              zIndex: index === currentIndex ? 10 : -1
            }}
          >
            {section.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionCarousel;
