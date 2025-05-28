
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useIsMobile } from '@/hooks/use-mobile';
import { useEnhancedSwipeGesture } from '@/hooks/useEnhancedSwipeGesture';
import SwipeCardTransition from './SwipeCardTransition';
import { cn } from '@/lib/utils';

type SectionData = {
  id: string;
  title: string;
  subtitle?: string;
  content: React.ReactNode;
  background: 'white' | 'light' | 'dark';
};

interface MainContainerProps {
  currentSection: SectionData;
  current: number;
  isFlipping: boolean;
  onNavigate: (index: number) => void;
  sectionsLength: number;
  swipeDirection?: 'left' | 'right' | null;
  isSwipeAnimating?: boolean;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  sections: SectionData[];
  animationState?: 'idle' | 'preparing' | 'swiping-left' | 'swiping-right' | 'completing';
  onSwipeStart?: () => void;
  onSwipeEnd?: () => void;
}

const MainContainer: React.FC<MainContainerProps> = ({
  currentSection,
  current,
  isFlipping,
  onNavigate,
  sectionsLength,
  swipeDirection,
  isSwipeAnimating,
  onSwipeLeft,
  onSwipeRight,
  sections,
  animationState = 'idle',
  onSwipeStart,
  onSwipeEnd
}) => {
  const isMobile = useIsMobile();

  // Generate random rotation for polaroid effect (desktop only)
  const getRotation = (index: number) => {
    const rotations = [-2, 1.5, -1, 2.5, -1.5, 1];
    return rotations[index % rotations.length];
  };

  // Get animation speed based on velocity
  const getAnimationSpeed = (velocity: number): 'fast' | 'normal' | 'slow' => {
    if (velocity > 0.8) return 'fast';
    if (velocity < 0.4) return 'slow';
    return 'normal';
  };

  // Handle enhanced swipe gestures on mobile
  const { swipeProps, isRubberBanding } = useEnhancedSwipeGesture({
    onSwipeLeft: (velocity) => {
      const speed = getAnimationSpeed(velocity);
      onSwipeLeft?.();
    },
    onSwipeRight: (velocity) => {
      const speed = getAnimationSpeed(velocity);
      onSwipeRight?.();
    },
    onSwipeStart,
    onSwipeEnd
  });

  // Handle click navigation (fallback for mobile, primary for desktop)
  const handleClick = () => {
    if (!isMobile && !isSwipeAnimating) {
      onNavigate((current + 1) % sectionsLength);
    }
  };

  // Get next and previous sections for card transitions
  const nextSection = sections[(current + 1) % sectionsLength];
  const prevSection = sections[(current - 1 + sectionsLength) % sectionsLength];

  if (isMobile) {
    return (
      <div
        className={cn(
          "relative mx-auto swipe-container",
          isSwipeAnimating && "animating"
        )}
        {...swipeProps}
      >
        <SwipeCardTransition
          currentSection={currentSection}
          nextSection={nextSection}
          prevSection={prevSection}
          animationState={animationState}
          swipeDirection={swipeDirection}
          animationSpeed={getAnimationSpeed(1)} // Default normal speed
        />
      </div>
    );
  }

  // Desktop version with original functionality
  return (
    <div
      className={cn(
        "relative bg-white rounded-2xl shadow-2xl transition-all duration-600 z-10 mx-auto w-[500px] h-[480px] cursor-pointer",
        isFlipping && "animate-pulse"
      )}
      style={{
        transform: `rotate(${getRotation(current)}deg)`
      }}
      onClick={handleClick}
    >
      {/* Polaroid-style container */}
      <div className="h-full flex flex-col p-6">
        {/* Content area */}
        <div className="flex-1 flex flex-col justify-center space-y-3 min-h-0">
          <h3 className="text-2xl font-semibold text-black tracking-tight leading-tight">
            {currentSection.title}
          </h3>
          <div className="space-y-3 text-gray-600 leading-relaxed flex-1 overflow-hidden text-base">
            {currentSection.content}
          </div>
        </div>
        
        {/* Bottom action area */}
        <div className="mt-3 pt-3 border-t border-gray-100 flex-shrink-0">
          <Button 
            asChild 
            size="default"
            className="bg-black/80 hover:bg-black text-white transition-all duration-300"
          >
            <Link to="/services" className="inline-flex items-center">
              How We Can Help <ArrowRight size={16} className="ml-1" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/5 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />
    </div>
  );
};

export default MainContainer;
