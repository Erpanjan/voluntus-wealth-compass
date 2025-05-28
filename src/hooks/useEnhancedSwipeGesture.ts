
import { useEffect, useRef, useState } from 'react';

interface SwipeHandlers {
  onSwipeLeft?: (velocity: number) => void;
  onSwipeRight?: (velocity: number) => void;
  onSwipeStart?: () => void;
  onSwipeEnd?: () => void;
}

interface SwipeGestureOptions {
  minSwipeDistance?: number;
  minSwipeVelocity?: number;
  rubberBandThreshold?: number;
}

export const useEnhancedSwipeGesture = (
  handlers: SwipeHandlers,
  options: SwipeGestureOptions = {}
) => {
  const {
    minSwipeDistance = 50,
    minSwipeVelocity = 0.3,
    rubberBandThreshold = 30
  } = options;

  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const touchCurrentRef = useRef<{ x: number; y: number } | null>(null);
  const [isRubberBanding, setIsRubberBanding] = useState(false);
  const [rubberBandDirection, setRubberBandDirection] = useState<'left' | 'right' | null>(null);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };
    touchCurrentRef.current = { x: touch.clientX, y: touch.clientY };
    handlers.onSwipeStart?.();
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!touchStartRef.current) return;

    const touch = e.touches[0];
    touchCurrentRef.current = { x: touch.clientX, y: touch.clientY };
    
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;

    // Check if it's primarily a horizontal movement
    if (Math.abs(deltaY) > Math.abs(deltaX)) return;

    // Rubber band effect for small movements
    if (Math.abs(deltaX) > rubberBandThreshold && Math.abs(deltaX) < minSwipeDistance) {
      const direction = deltaX > 0 ? 'right' : 'left';
      if (!isRubberBanding || rubberBandDirection !== direction) {
        setIsRubberBanding(true);
        setRubberBandDirection(direction);
      }
    } else if (isRubberBanding) {
      setIsRubberBanding(false);
      setRubberBandDirection(null);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!touchStartRef.current || !touchCurrentRef.current) return;

    const deltaX = touchCurrentRef.current.x - touchStartRef.current.x;
    const deltaY = touchCurrentRef.current.y - touchStartRef.current.y;
    const deltaTime = Date.now() - touchStartRef.current.time;
    
    const distance = Math.abs(deltaX);
    const velocity = distance / deltaTime;

    // Reset rubber band state
    setIsRubberBanding(false);
    setRubberBandDirection(null);

    // Check if it's a horizontal swipe (not vertical scroll)
    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      handlers.onSwipeEnd?.();
      return;
    }

    // Check if swipe meets minimum requirements
    if (distance >= minSwipeDistance && velocity >= minSwipeVelocity) {
      if (deltaX > 0) {
        handlers.onSwipeRight?.(velocity);
      } else {
        handlers.onSwipeLeft?.(velocity);
      }
    }

    handlers.onSwipeEnd?.();
    touchStartRef.current = null;
    touchCurrentRef.current = null;
  };

  const swipeProps = {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
    className: `touch-manipulation ${isRubberBanding ? `animate-rubber-band-${rubberBandDirection}` : ''}`,
    style: {
      touchAction: 'pan-y pinch-zoom'
    }
  };

  return { swipeProps, isRubberBanding, rubberBandDirection };
};
