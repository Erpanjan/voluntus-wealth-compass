
import { useEffect, useRef } from 'react';

interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

interface SwipeGestureOptions {
  minSwipeDistance?: number;
  minSwipeVelocity?: number;
}

export const useSwipeGesture = (
  handlers: SwipeHandlers,
  options: SwipeGestureOptions = {}
) => {
  const {
    minSwipeDistance = 50,
    minSwipeVelocity = 0.3
  } = options;

  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const touchEndRef = useRef<{ x: number; y: number; time: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };
    touchEndRef.current = null;
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!touchStartRef.current) return;

    const touch = e.changedTouches[0];
    touchEndRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };

    const deltaX = touchEndRef.current.x - touchStartRef.current.x;
    const deltaY = touchEndRef.current.y - touchStartRef.current.y;
    const deltaTime = touchEndRef.current.time - touchStartRef.current.time;
    
    const distance = Math.abs(deltaX);
    const velocity = distance / deltaTime;

    // Check if it's a horizontal swipe (not vertical scroll)
    if (Math.abs(deltaY) > Math.abs(deltaX)) return;

    // Check if swipe meets minimum requirements
    if (distance >= minSwipeDistance && velocity >= minSwipeVelocity) {
      if (deltaX > 0) {
        handlers.onSwipeRight?.();
      } else {
        handlers.onSwipeLeft?.();
      }
    }

    touchStartRef.current = null;
    touchEndRef.current = null;
  };

  const swipeProps = {
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd,
    style: {
      touchAction: 'pan-y pinch-zoom' // Allow vertical scroll but handle horizontal
    }
  };

  return swipeProps;
};
