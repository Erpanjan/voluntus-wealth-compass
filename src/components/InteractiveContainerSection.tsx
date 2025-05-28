
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

type SectionData = {
  id: string;
  title: string;
  subtitle?: string;
  content: React.ReactNode;
  background: 'white' | 'light' | 'dark';
};

interface InteractiveContainerSectionProps {
  sections: SectionData[];
  autoplayInterval?: number;
}

const InteractiveContainerSection: React.FC<InteractiveContainerSectionProps> = ({
  sections,
  autoplayInterval = 8000
}) => {
  const [current, setCurrent] = useState(0);
  const [autoplayPaused, setAutoplayPaused] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const isMobile = useIsMobile();
  
  // Auto-scroll effect
  useEffect(() => {
    if (autoplayPaused) return;
    
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % sections.length);
    }, autoplayInterval);
    
    return () => clearInterval(interval);
  }, [autoplayPaused, autoplayInterval, sections.length]);

  // Handle manual navigation
  const scrollToSection = useCallback((index: number) => {
    if (isFlipping) return;
    
    setIsFlipping(true);
    setCurrent(index);
    
    setTimeout(() => setIsFlipping(false), 600);
  }, [isFlipping]);

  // Pause autoplay when interacting
  const handleMouseEnter = useCallback(() => setAutoplayPaused(true), []);
  const handleMouseLeave = useCallback(() => setAutoplayPaused(false), []);
  const handleTouch = useCallback(() => setAutoplayPaused(true), []);
  const handleTouchEnd = useCallback(() => {
    setTimeout(() => setAutoplayPaused(false), 3000);
  }, []);

  // Generate random rotation for polaroid effect
  const getRotation = (index: number) => {
    const rotations = [-3, 2, -1, 4, -2, 1];
    return rotations[index % rotations.length];
  };

  const currentSection = sections[current];

  return (
    <div className="relative flex flex-col w-full">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 mt-4 sm:mt-6 px-4 sm:px-0">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold mb-4 sm:mb-0">What We Can Help</h2>
        
        {/* Navigation dots */}
        <div className="flex gap-2 sm:gap-3 items-center">
          {sections.map((_, index) => (
            <Button 
              key={index} 
              variant="ghost" 
              size="sm" 
              className={cn(
                "w-8 h-8 sm:w-10 sm:h-10 p-0 flex items-center justify-center rounded-full transition-all duration-300 touch-manipulation", 
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
      
      {/* Interactive container area */}
      <div 
        className="relative w-full min-h-[400px] sm:min-h-[500px] flex items-center justify-center overflow-hidden"
        onMouseEnter={handleMouseEnter} 
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouch} 
        onTouchEnd={handleTouchEnd}
      >
        {/* Background containers (slightly visible) */}
        <div className="absolute inset-0 flex items-center justify-center">
          {sections.map((section, index) => {
            if (index === current) return null;
            
            const isNext = index === (current + 1) % sections.length;
            const isPrev = index === (current - 1 + sections.length) % sections.length;
            
            return (
              <div
                key={section.id}
                className={cn(
                  "absolute w-80 sm:w-96 h-80 sm:h-96 bg-white rounded-xl shadow-lg transition-all duration-1000 cursor-pointer",
                  "opacity-20 scale-75",
                  isNext && "translate-x-32 sm:translate-x-40 rotate-12",
                  isPrev && "-translate-x-32 sm:-translate-x-40 -rotate-12"
                )}
                style={{
                  transform: `${isNext ? 'translateX(160px) rotate(12deg)' : isPrev ? 'translateX(-160px) rotate(-12deg)' : ''} scale(0.75)`,
                  zIndex: 1
                }}
                onClick={() => scrollToSection(index)}
              />
            );
          })}
        </div>

        {/* Main active container */}
        <div
          className={cn(
            "relative w-80 sm:w-96 h-80 sm:h-96 bg-white rounded-xl shadow-2xl transition-all duration-600 cursor-pointer z-10",
            isFlipping && "animate-pulse"
          )}
          style={{
            transform: `rotate(${getRotation(current)}deg)`,
          }}
          onClick={() => scrollToSection((current + 1) % sections.length)}
        >
          {/* Polaroid-style container */}
          <div className="p-6 sm:p-8 h-full flex flex-col">
            {/* Content area */}
            <div className="flex-1 flex flex-col justify-center space-y-4">
              <h3 className="text-lg sm:text-xl font-semibold text-black tracking-tight leading-tight">
                {currentSection.title}
              </h3>
              <div className="space-y-3 text-gray-600 text-sm sm:text-base leading-relaxed">
                {currentSection.content}
              </div>
            </div>
            
            {/* Bottom action area */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <Button 
                asChild 
                size="sm"
                className="bg-black/80 hover:bg-black text-white transition-all duration-300 text-xs sm:text-sm"
              >
                <Link to="/services" className="inline-flex items-center">
                  How We Can Help <ArrowRight size={14} className="ml-1" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/5 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none" />
        </div>
      </div>
      
      {/* Mobile progress indicator */}
      <div className="mt-6 flex justify-center md:hidden">
        <div className="flex gap-2">
          {sections.map((_, index) => (
            <span 
              key={index}
              className={cn(
                "block w-2 h-2 rounded-full transition-all duration-300", 
                current === index ? "bg-black w-6" : "bg-gray-300"
              )}
            />
          ))}
        </div>
      </div>

      {/* Auto-play indicator */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          {autoplayPaused ? 'Auto-play paused' : 'Auto-rotating every 8 seconds'}
        </p>
      </div>
    </div>
  );
};

export default InteractiveContainerSection;
