
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
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
  <div className="h-full flex flex-col p-6 sm:p-7 bg-white rounded-2xl shadow-2xl">
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
        <Link to="/services" className="inline-flex items-center text-white no-underline">
          How We Can Help <ArrowRight size={16} className="ml-1" />
        </Link>
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
  const baseCardClasses = "absolute inset-0 w-full h-full transition-all duration-400 ease-out";

  const getAnimationClasses = (cardType: 'current' | 'next' | 'prev') => {
    if (animationState === 'preparing') {
      return cardType === 'current' ? 'transform scale-[1.02]' : '';
    }
    
    if (animationState === 'swiping-left') {
      if (cardType === 'current') return 'animate-swipe-out-left';
      if (cardType === 'next') return 'animate-swipe-in-left';
    }
    
    if (animationState === 'swiping-right') {
      if (cardType === 'current') return 'animate-swipe-out-right';
      if (cardType === 'prev') return 'animate-swipe-in-right';
    }
    
    return '';
  };

  const getCurrentCardPosition = () => {
    if (animationState === 'idle' || animationState === 'preparing') {
      return 'relative z-20';
    }
    return 'absolute inset-0 z-20';
  };

  const getNextCardPosition = () => {
    if (animationState === 'swiping-left') {
      return 'absolute inset-0 z-10';
    }
    return 'absolute inset-0 z-10 translate-x-full opacity-0';
  };

  const getPrevCardPosition = () => {
    if (animationState === 'swiping-right') {
      return 'absolute inset-0 z-10';
    }
    return 'absolute inset-0 z-10 -translate-x-full opacity-0';
  };

  return (
    <div className="relative w-full h-full overflow-hidden" style={{ perspective: '1000px' }}>
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
