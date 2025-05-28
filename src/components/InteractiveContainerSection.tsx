
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
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [isSwipeAnimating, setIsSwipeAnimating] = useState(false);
  const isMobile = useIsMobile();
  
  // Auto-scroll effect - pause when user is actively interacting
  useEffect(() => {
    if (autoplayPaused || isUserInteracting || isSwipeAnimating) return;
    
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % sections.length);
    }, autoplayInterval);
    
    return () => clearInterval(interval);
  }, [autoplayPaused, isUserInteracting, isSwipeAnimating, autoplayInterval, sections.length]);

  // Handle manual navigation with swipe animation
  const scrollToSection = useCallback((index: number, direction?: 'left' | 'right') => {
    if (isFlipping || isSwipeAnimating) return;
    
    // Determine swipe direction if not provided
    if (isMobile && direction) {
      setSwipeDirection(direction);
      setIsSwipeAnimating(true);
    } else {
      setIsFlipping(true);
    }
    
    setCurrent(index);
    
    // Mark user as interacting to pause autoplay temporarily
    setIsUserInteracting(true);
    
    const animationDuration = isMobile && direction ? 300 : 600;
    
    setTimeout(() => {
      if (isMobile && direction) {
        setIsSwipeAnimating(false);
        setSwipeDirection(null);
      } else {
        setIsFlipping(false);
      }
      // Resume autoplay after interaction
      setTimeout(() => setIsUserInteracting(false), 3000);
    }, animationDuration);
  }, [isFlipping, isSwipeAnimating, isMobile]);

  // Handle swipe navigation with direction
  const handleSwipeLeft = useCallback(() => {
    const nextIndex = (current + 1) % sections.length;
    scrollToSection(nextIndex, 'left');
  }, [current, sections.length, scrollToSection]);

  const handleSwipeRight = useCallback(() => {
    const prevIndex = (current - 1 + sections.length) % sections.length;
    scrollToSection(prevIndex, 'right');
  }, [current, sections.length, scrollToSection]);

  // Pause autoplay when interacting (mouse events for desktop)
  const handleMouseEnter = useCallback(() => {
    if (!isMobile) setAutoplayPaused(true);
  }, [isMobile]);
  
  const handleMouseLeave = useCallback(() => {
    if (!isMobile) setAutoplayPaused(false);
  }, [isMobile]);

  // Touch events for mobile
  const handleTouchStart = useCallback(() => {
    if (isMobile) setIsUserInteracting(true);
  }, [isMobile]);

  const handleTouchEnd = useCallback(() => {
    if (isMobile) {
      // Resume autoplay after a delay on mobile
      setTimeout(() => setIsUserInteracting(false), 3000);
    }
  }, [isMobile]);

  const currentSection = sections[current];

  return (
    <div className="relative flex flex-col w-full">
      {/* Header section */}
      <ContainerHeader 
        sectionsLength={sections.length}
        current={current}
        onNavigate={(index) => scrollToSection(index)}
      />
      
      {/* Interactive container area - updated height for larger mobile containers */}
      <div 
        className={cn(
          "relative w-full flex items-center justify-center overflow-hidden swipe-container",
          isMobile ? "min-h-[580px] sm:min-h-[660px]" : "min-h-[580px]",
          isSwipeAnimating && "animating"
        )}
        onMouseEnter={handleMouseEnter} 
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart} 
        onTouchEnd={handleTouchEnd}
      >
        {/* Background containers */}
        <BackgroundContainers 
          sections={sections}
          current={current}
          onNavigate={(index) => scrollToSection(index)}
        />

        {/* Main active container */}
        <MainContainer 
          currentSection={currentSection}
          current={current}
          isFlipping={isFlipping}
          onNavigate={(index) => scrollToSection(index)}
          sectionsLength={sections.length}
          swipeDirection={swipeDirection}
          isSwipeAnimating={isSwipeAnimating}
          onSwipeLeft={handleSwipeLeft}
          onSwipeRight={handleSwipeRight}
        />
      </div>
    </div>
  );
};

export default InteractiveContainerSection;
