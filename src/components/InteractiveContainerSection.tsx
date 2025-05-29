
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

// Optimized animation state for better performance
type AnimationState = {
  isAnimating: boolean;
  direction: 'left' | 'right' | null;
  type: 'swipe' | 'flip' | null;
};

const InteractiveContainerSection: React.FC<InteractiveContainerSectionProps> = ({
  sections,
  autoplayInterval = 8000
}) => {
  const [current, setCurrent] = useState(0);
  const [autoplayPaused, setAutoplayPaused] = useState(false);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const [animationState, setAnimationState] = useState<AnimationState>({
    isAnimating: false,
    direction: null,
    type: null
  });
  const isMobile = useIsMobile();
  
  // Auto-scroll effect - pause when user is actively interacting
  useEffect(() => {
    if (autoplayPaused || isUserInteracting || animationState.isAnimating) return;
    
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % sections.length);
    }, autoplayInterval);
    
    return () => clearInterval(interval);
  }, [autoplayPaused, isUserInteracting, animationState.isAnimating, autoplayInterval, sections.length]);

  // Optimized navigation with reduced animation duration
  const scrollToSection = useCallback((index: number, direction?: 'left' | 'right') => {
    if (animationState.isAnimating) return;
    
    const animationType = isMobile && direction ? 'swipe' : 'flip';
    
    setAnimationState({
      isAnimating: true,
      direction: direction || null,
      type: animationType
    });
    
    setCurrent(index);
    
    // Mark user as interacting to pause autoplay temporarily
    setIsUserInteracting(true);
    
    // Reduced animation duration for smoother feel
    const animationDuration = animationType === 'swipe' ? 300 : 500;
    
    setTimeout(() => {
      setAnimationState({
        isAnimating: false,
        direction: null,
        type: null
      });
      // Resume autoplay after interaction
      setTimeout(() => setIsUserInteracting(false), 3000);
    }, animationDuration);
  }, [animationState.isAnimating, isMobile]);

  // Memoized swipe handlers
  const handleSwipeLeft = useCallback(() => {
    const nextIndex = (current + 1) % sections.length;
    scrollToSection(nextIndex, 'left');
  }, [current, sections.length, scrollToSection]);

  const handleSwipeRight = useCallback(() => {
    const prevIndex = (current - 1 + sections.length) % sections.length;
    scrollToSection(prevIndex, 'right');
  }, [current, sections.length, scrollToSection]);

  // Optimized interaction handlers
  const handleMouseEnter = useCallback(() => {
    if (!isMobile) setAutoplayPaused(true);
  }, [isMobile]);
  
  const handleMouseLeave = useCallback(() => {
    if (!isMobile) setAutoplayPaused(false);
  }, [isMobile]);

  const handleTouchStart = useCallback(() => {
    if (isMobile) setIsUserInteracting(true);
  }, [isMobile]);

  const handleTouchEnd = useCallback(() => {
    if (isMobile) {
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
      
      {/* Interactive container area with optimized styling */}
      <div 
        className={cn(
          "relative w-full flex items-center justify-center overflow-hidden swipe-container",
          isMobile ? "min-h-[580px] sm:min-h-[660px]" : "min-h-[580px]",
          animationState.isAnimating && "animating"
        )}
        onMouseEnter={handleMouseEnter} 
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart} 
        onTouchEnd={handleTouchEnd}
        style={{
          willChange: 'transform',
          contain: 'layout style paint'
        }}
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
          animationState={animationState}
          onNavigate={(index) => scrollToSection(index)}
          sectionsLength={sections.length}
          onSwipeLeft={handleSwipeLeft}
          onSwipeRight={handleSwipeRight}
        />
      </div>
    </div>
  );
};

export default InteractiveContainerSection;
