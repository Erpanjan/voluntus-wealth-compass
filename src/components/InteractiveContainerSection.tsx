
import React, { useState, useEffect, useCallback } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import ContainerHeader from './interactive-container/ContainerHeader';
import BackgroundContainers from './interactive-container/BackgroundContainers';
import MainContainer from './interactive-container/MainContainer';

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

  const currentSection = sections[current];

  return (
    <div className="relative flex flex-col w-full">
      {/* Header section */}
      <ContainerHeader 
        sectionsLength={sections.length}
        current={current}
        onNavigate={scrollToSection}
      />
      
      {/* Interactive container area - updated height for larger mobile containers */}
      <div 
        className={cn(
          "relative w-full flex items-center justify-center overflow-hidden",
          isMobile ? "min-h-[580px] sm:min-h-[660px]" : "min-h-[580px]"
        )}
        onMouseEnter={handleMouseEnter} 
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouch} 
        onTouchEnd={handleTouchEnd}
      >
        {/* Background containers */}
        <BackgroundContainers 
          sections={sections}
          current={current}
          onNavigate={scrollToSection}
        />

        {/* Main active container */}
        <MainContainer 
          currentSection={currentSection}
          current={current}
          isFlipping={isFlipping}
          onNavigate={scrollToSection}
          sectionsLength={sections.length}
        />
      </div>
    </div>
  );
};

export default InteractiveContainerSection;
