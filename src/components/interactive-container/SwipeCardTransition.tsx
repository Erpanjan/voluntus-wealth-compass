
import React from 'react';
import { cn } from '@/lib/utils';

type SectionData = {
  id: string;
  title: string;
  subtitle?: string;
  content: React.ReactNode;
  background: 'white' | 'light' | 'dark';
};

interface SwipeCardTransitionProps {
  currentSection: SectionData;
  nextSection?: SectionData;
  prevSection?: SectionData;
  animationState: 'idle' | 'preparing' | 'swiping-left' | 'swiping-right' | 'completing';
  swipeDirection?: 'left' | 'right' | null;
  animationSpeed?: 'fast' | 'normal' | 'slow';
}

const CardContent: React.FC<{ section: SectionData }> = ({ section }) => (
  <div className="h-full flex flex-col p-6 sm:p-7">
    <div className="flex-1 flex flex-col justify-center space-y-3 min-h-0">
      <h3 className="text-2xl sm:text-3xl font-semibold text-black tracking-tight leading-tight">
        {section.title}
      </h3>
      <div className="space-y-3 text-gray-600 leading-relaxed flex-1 overflow-hidden text-base sm:text-lg">
        {section.content}
      </div>
    </div>
    
    <div className="mt-3 pt-3 border-t border-gray-100 flex-shrink-0">
      <button className="bg-black/80 hover:bg-black text-white transition-all duration-300 px-4 py-2 rounded inline-flex items-center">
        How We Can Help →
      </button>
    </div>
  </div>
);

const SwipeCardTransition: React.FC<SwipeCardTransitionProps> = ({
  currentSection,
  nextSection,
  prevSection,
  animationState,
  swipeDirection,
  animationSpeed = 'normal'
}) => {
  const baseCardClasses = "absolute w-[90vw] max-w-md h-[480px] sm:h-[540px] bg-white rounded-2xl shadow-2xl transition-all duration-600";

  const getAnimationClasses = (cardType: 'current' | 'next' | 'prev') => {
    const speedClass = `swipe-${animationSpeed}`;
    
    if (animationState === 'preparing') {
      return cardType === 'current' ? 'swipe-card-preparing swipe-card-ready' : '';
    }
    
    if (animationState === 'swiping-left') {
      if (cardType === 'current') return `animate-swipe-out-left ${speedClass}`;
      if (cardType === 'next') return `animate-swipe-in-left ${speedClass}`;
    }
    
    if (animationState === 'swiping-right') {
      if (cardType === 'current') return `animate-swipe-out-right ${speedClass}`;
      if (cardType === 'prev') return `animate-swipe-in-right ${speedClass}`;
    }
    
    return '';
  };

  const getCurrentCardPosition = () => {
    if (animationState === 'idle' || animationState === 'preparing') {
      return 'relative z-10';
    }
    return 'absolute inset-0 z-10';
  };

  const getNextCardPosition = () => {
    if (animationState === 'swiping-left') {
      return 'absolute inset-0 z-5';
    }
    return 'swipe-next-card';
  };

  const getPrevCardPosition = () => {
    if (animationState === 'swiping-right') {
      return 'absolute inset-0 z-5';
    }
    return 'swipe-prev-card';
  };

  return (
    <div className="swipe-card-stack">
      {/* Current card */}
      <div className={cn(
        baseCardClasses,
        getCurrentCardPosition(),
        getAnimationClasses('current')
      )}>
        <CardContent section={currentSection} />
      </div>

      {/* Next card (for left swipe) */}
      {nextSection && (animationState === 'swiping-left' || animationState === 'preparing') && (
        <div className={cn(
          baseCardClasses,
          getNextCardPosition(),
          getAnimationClasses('next')
        )}>
          <CardContent section={nextSection} />
        </div>
      )}

      {/* Previous card (for right swipe) */}
      {prevSection && (animationState === 'swiping-right' || animationState === 'preparing') && (
        <div className={cn(
          baseCardClasses,
          getPrevCardPosition(),
          getAnimationClasses('prev')
        )}>
          <CardContent section={prevSection} />
        </div>
      )}
    </div>
  );
};

export default SwipeCardTransition;
