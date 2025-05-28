
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
    const rotations = [-2, 1.5, -1, 2.5, -1.5, 1];
    return rotations[index % rotations.length];
  };

  const currentSection = sections[current];

  return (
    <div className="relative flex flex-col w-full">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-12 mt-6 sm:mt-8 px-4 sm:px-0">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold mb-4 sm:mb-0">What We Can Help</h2>
        
        {/* Navigation dots */}
        <div className="flex gap-3 sm:gap-4 items-center">
          {sections.map((_, index) => (
            <Button 
              key={index} 
              variant="ghost" 
              size="sm" 
              className={cn(
                "w-10 h-10 sm:w-12 sm:h-12 p-0 flex items-center justify-center rounded-full transition-all duration-300 touch-manipulation text-base sm:text-lg", 
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
        className={cn(
          "relative w-full flex items-center justify-center overflow-hidden",
          isMobile ? "min-h-[500px] sm:min-h-[600px]" : "min-h-[700px]"
        )}
        onMouseEnter={handleMouseEnter} 
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouch} 
        onTouchEnd={handleTouchEnd}
      >
        {/* Desktop: Multiple containers visible */}
        {!isMobile && (
          <div className="absolute inset-0 flex items-center justify-center">
            {sections.map((section, index) => {
              if (index === current) return null;
              
              const isNext = index === (current + 1) % sections.length;
              const isPrev = index === (current - 1 + sections.length) % sections.length;
              const isFarNext = index === (current + 2) % sections.length;
              const isFarPrev = index === (current - 2 + sections.length) % sections.length;
              
              let transform = '';
              let opacity = 0.1;
              let scale = 0.6;
              let zIndex = 1;
              
              if (isNext) {
                transform = 'translateX(400px) rotate(8deg)';
                opacity = 0.4;
                scale = 0.8;
                zIndex = 2;
              } else if (isPrev) {
                transform = 'translateX(-400px) rotate(-8deg)';
                opacity = 0.4;
                scale = 0.8;
                zIndex = 2;
              } else if (isFarNext) {
                transform = 'translateX(650px) rotate(12deg)';
                opacity = 0.15;
                scale = 0.6;
              } else if (isFarPrev) {
                transform = 'translateX(-650px) rotate(-12deg)';
                opacity = 0.15;
                scale = 0.6;
              }
              
              return (
                <div
                  key={section.id}
                  className="absolute w-[500px] h-[450px] bg-white rounded-2xl shadow-xl transition-all duration-1000 cursor-pointer"
                  style={{
                    transform: `${transform} scale(${scale})`,
                    opacity,
                    zIndex
                  }}
                  onClick={() => scrollToSection(index)}
                >
                  <div className="p-8 h-full flex flex-col">
                    <div className="flex-1 flex flex-col justify-center space-y-6">
                      <h3 className="text-2xl font-semibold text-black tracking-tight leading-tight">
                        {section.title}
                      </h3>
                      <div className="space-y-4 text-gray-600 text-base leading-relaxed">
                        {section.content}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Mobile: Background containers (slightly visible) */}
        {isMobile && (
          <div className="absolute inset-0 flex items-center justify-center">
            {sections.map((section, index) => {
              if (index === current) return null;
              
              const isNext = index === (current + 1) % sections.length;
              const isPrev = index === (current - 1 + sections.length) % sections.length;
              
              return (
                <div
                  key={section.id}
                  className={cn(
                    "absolute w-80 sm:w-96 h-96 sm:h-[450px] bg-white rounded-2xl shadow-lg transition-all duration-1000 cursor-pointer",
                    "opacity-20 scale-75",
                    isNext && "translate-x-32 sm:translate-x-40 rotate-8",
                    isPrev && "-translate-x-32 sm:-translate-x-40 -rotate-8"
                  )}
                  style={{
                    zIndex: 1
                  }}
                  onClick={() => scrollToSection(index)}
                />
              );
            })}
          </div>
        )}

        {/* Main active container */}
        <div
          className={cn(
            "relative bg-white rounded-2xl shadow-2xl transition-all duration-600 cursor-pointer z-10",
            isMobile ? "w-80 sm:w-96 h-96 sm:h-[450px]" : "w-[500px] h-[450px]",
            isFlipping && "animate-pulse"
          )}
          style={{
            transform: `rotate(${getRotation(current)}deg)`,
          }}
          onClick={() => scrollToSection((current + 1) % sections.length)}
        >
          {/* Polaroid-style container */}
          <div className={cn("h-full flex flex-col", isMobile ? "p-6 sm:p-8" : "p-10")}>
            {/* Content area */}
            <div className="flex-1 flex flex-col justify-center space-y-6">
              <h3 className={cn(
                "font-semibold text-black tracking-tight leading-tight",
                isMobile ? "text-xl sm:text-2xl" : "text-3xl"
              )}>
                {currentSection.title}
              </h3>
              <div className={cn(
                "space-y-4 text-gray-600 leading-relaxed",
                isMobile ? "text-sm sm:text-base" : "text-lg"
              )}>
                {currentSection.content}
              </div>
            </div>
            
            {/* Bottom action area */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <Button 
                asChild 
                size={isMobile ? "sm" : "default"}
                className="bg-black/80 hover:bg-black text-white transition-all duration-300"
              >
                <Link to="/services" className="inline-flex items-center">
                  How We Can Help <ArrowRight size={isMobile ? 14 : 16} className="ml-1" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/5 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />
        </div>
      </div>
      
      {/* Mobile progress indicator */}
      <div className="mt-8 flex justify-center md:hidden">
        <div className="flex gap-3">
          {sections.map((_, index) => (
            <span 
              key={index}
              className={cn(
                "block w-2.5 h-2.5 rounded-full transition-all duration-300", 
                current === index ? "bg-black w-8" : "bg-gray-300"
              )}
            />
          ))}
        </div>
      </div>

      {/* Auto-play indicator */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          {autoplayPaused ? 'Auto-play paused' : 'Auto-rotating every 8 seconds'}
        </p>
      </div>
    </div>
  );
};

export default InteractiveContainerSection;
