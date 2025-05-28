
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useIsMobile } from '@/hooks/use-mobile';
import { useSwipeGesture } from '@/hooks/useSwipeGesture';
import { cn } from '@/lib/utils';

type SectionData = {
  id: string;
  title: string;
  subtitle?: string;
  content: React.ReactNode;
  background: 'white' | 'light' | 'dark';
};

type AnimationState = {
  isAnimating: boolean;
  direction: 'left' | 'right' | null;
  type: 'swipe' | 'flip' | null;
};

interface MainContainerProps {
  currentSection: SectionData;
  current: number;
  animationState: AnimationState;
  onNavigate: (index: number) => void;
  sectionsLength: number;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

const MainContainer: React.FC<MainContainerProps> = ({
  currentSection,
  current,
  animationState,
  onNavigate,
  sectionsLength,
  onSwipeLeft,
  onSwipeRight
}) => {
  const isMobile = useIsMobile();

  // Generate random rotation for polaroid effect
  const getRotation = (index: number) => {
    const rotations = [-2, 1.5, -1, 2.5, -1.5, 1];
    return rotations[index % rotations.length];
  };

  // Handle swipe gestures on mobile
  const swipeProps = useSwipeGesture({
    onSwipeLeft,
    onSwipeRight
  });

  // Handle click navigation (fallback for mobile, primary for desktop)
  const handleClick = () => {
    if (!isMobile && !animationState.isAnimating) {
      onNavigate((current + 1) % sectionsLength);
    }
  };

  // Get animation classes based on animation state
  const getAnimationClasses = () => {
    if (!animationState.isAnimating) return '';
    
    if (isMobile && animationState.type === 'swipe') {
      if (animationState.direction === 'left') {
        return 'animate-swipe-out-left';
      } else if (animationState.direction === 'right') {
        return 'animate-swipe-out-right';
      }
    } else if (!isMobile && animationState.type === 'flip') {
      return 'animate-pulse';
    }
    
    return '';
  };

  return (
    <div
      className={cn(
        "relative bg-white rounded-2xl shadow-2xl transition-all duration-300 z-10 mx-auto",
        "will-change-transform", // GPU acceleration
        isMobile ? "w-[90vw] max-w-md h-[480px] sm:h-[540px]" : "w-[500px] h-[480px] cursor-pointer",
        !isMobile && !animationState.isAnimating && "hover:shadow-3xl hover:-translate-y-1",
        getAnimationClasses()
      )}
      style={{
        // Only apply rotation on desktop, keep mobile containers straight
        transform: isMobile ? 'rotate(0deg)' : `rotate(${getRotation(current)}deg)`,
        ...(!isMobile ? {} : swipeProps.style)
      }}
      onClick={handleClick}
      {...(isMobile ? swipeProps : {})}
    >
      {/* Polaroid-style container with enhanced mobile layout */}
      <div className={cn("h-full flex flex-col", isMobile ? "p-6 sm:p-7" : "p-6")}>
        {/* Content area - enhanced spacing for mobile */}
        <div className="flex-1 flex flex-col justify-center space-y-3 min-h-0">
          <h3 className={cn(
            "font-semibold text-black tracking-tight leading-tight",
            isMobile ? "text-2xl sm:text-3xl" : "text-2xl"
          )}>
            {currentSection.title}
          </h3>
          <div className={cn(
            "space-y-3 text-gray-600 leading-relaxed flex-1 overflow-hidden",
            isMobile ? "text-base sm:text-lg" : "text-base"
          )}>
            {currentSection.content}
          </div>
        </div>
        
        {/* Bottom action area - enhanced for mobile */}
        <div className="mt-3 pt-3 border-t border-gray-100 flex-shrink-0">
          <Button 
            asChild 
            size={isMobile ? "default" : "default"}
            className="bg-black/80 hover:bg-black text-white transition-all duration-300"
          >
            <Link to="/services" className="inline-flex items-center">
              How We Can Help <ArrowRight size={isMobile ? 16 : 16} className="ml-1" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Hover overlay - only on desktop */}
      {!isMobile && (
        <div className="absolute inset-0 bg-black/5 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />
      )}
    </div>
  );
};

export default MainContainer;
