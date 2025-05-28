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
  const [animationState, setAnimationState] = useState<'idle' | 'preparing' | 'swiping-left' | 'swiping-right' | 'completing'>('idle');
  const isMobile = useIsMobile();
  
  // Auto-scroll effect - pause when user is actively interacting
  useEffect(() => {
    if (autoplayPaused || isUserInteracting || isSwipeAnimating) return;
    
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % sections.length);
    }, autoplayInterval);
    
    return () => clearInterval(interval);
  }, [autoplayPaused, isUserInteracting, isSwipeAnimating, autoplayInterval, sections.length]);

  // Enhanced scroll to section with improved animation coordination
  const scrollToSection = useCallback((index: number, direction?: 'left' | 'right') => {
    if (isFlipping || isSwipeAnimating) return;
    
    // Enhanced mobile animation flow
    if (isMobile && direction) {
      setAnimationState('preparing');
      setSwipeDirection(direction);
      setIsSwipeAnimating(true);
      
      // Start the swipe animation
      setTimeout(() => {
        setAnimationState(direction === 'left' ? 'swiping-left' : 'swiping-right');
        setCurrent(index);
      }, 50);
      
      // Complete the animation
      setTimeout(() => {
        setAnimationState('completing');
      }, 350);
      
      // Reset animation state
      setTimeout(() => {
        setIsSwipeAnimating(false);
        setSwipeDirection(null);
        setAnimationState('idle');
      }, 450);
    } else {
      // Desktop animation
      setIsFlipping(true);
      setCurrent(index);
      setTimeout(() => setIsFlipping(false), 600);
    }
    
    // Mark user as interacting to pause autoplay temporarily
    setIsUserInteracting(true);
    setTimeout(() => setIsUserInteracting(false), 3000);
  }, [isFlipping, isSwipeAnimating, isMobile]);

  // Handle swipe navigation with enhanced direction tracking
  const handleSwipeLeft = useCallback(() => {
    const nextIndex = (current + 1) % sections.length;
    scrollToSection(nextIndex, 'left');
  }, [current, sections.length, scrollToSection]);

  const handleSwipeRight = useCallback(() => {
    const prevIndex = (current - 1 + sections.length) % sections.length;
    scrollToSection(prevIndex, 'right');
  }, [current, sections.length, scrollToSection]);

  // Enhanced swipe start/end handlers
  const handleSwipeStart = useCallback(() => {
    if (isMobile) {
      setIsUserInteracting(true);
      setAnimationState('preparing');
    }
  }, [isMobile]);

  const handleSwipeEnd = useCallback(() => {
    if (isMobile && animationState === 'preparing') {
      setAnimationState('idle');
    }
  }, [isMobile, animationState]);

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
      
      {/* Interactive container area - enhanced for better mobile animations */}
      <div 
        className={cn(
          "relative w-full flex items-center justify-center",
          isMobile ? "min-h-[580px] sm:min-h-[660px]" : "min-h-[580px] overflow-hidden",
          isSwipeAnimating && "pointer-events-none"
        )}
        onMouseEnter={handleMouseEnter} 
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart} 
        onTouchEnd={handleTouchEnd}
      >
        {/* Background containers - only show on desktop or when not animating */}
        {!isMobile && (
          <BackgroundContainers 
            sections={sections}
            current={current}
            onNavigate={(index) => scrollToSection(index)}
          />
        )}

        {/* Main active container with enhanced props */}
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
          sections={sections}
          animationState={animationState}
          onSwipeStart={handleSwipeStart}
          onSwipeEnd={handleSwipeEnd}
        />
      </div>
    </div>
  );
};

export default InteractiveContainerSection;
