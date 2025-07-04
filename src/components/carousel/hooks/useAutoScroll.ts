
import { useCallback, useEffect, useRef, useState } from 'react';
import { CAROUSEL_CONFIG } from '../constants';

export const useAutoScroll = (
  containerRef: React.RefObject<HTMLDivElement>,
  totalItems: number,
  isEnabled: boolean = true
) => {
  const [isPaused, setIsPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout>();
  const pauseTimeoutRef = useRef<NodeJS.Timeout>();
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();

  const scrollToIndex = useCallback((index: number) => {
    if (!containerRef.current) return;
    
    const cards = containerRef.current.querySelectorAll('[data-carousel-card]');
    const targetCard = cards[index];
    
    if (targetCard) {
      targetCard.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
      setCurrentIndex(index);
    }
  }, [containerRef]);

  const goToNext = useCallback(() => {
    const nextIndex = (currentIndex + 1) % totalItems;
    scrollToIndex(nextIndex);
  }, [currentIndex, totalItems, scrollToIndex]);

  const pauseAutoScroll = useCallback(() => {
    setIsPaused(true);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
    }
    
    // Resume after pause duration
    pauseTimeoutRef.current = setTimeout(() => {
      setIsPaused(false);
    }, CAROUSEL_CONFIG.AUTO_SCROLL.PAUSE_ON_INTERACTION);
  }, []);

  const handleScroll = useCallback(() => {
    setIsUserScrolling(true);
    
    // Clear existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    // Pause auto-scroll during user scrolling
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Resume auto-scroll after user stops scrolling
    scrollTimeoutRef.current = setTimeout(() => {
      setIsUserScrolling(false);
    }, 500); // Wait 500ms after scroll stops
  }, []);

  // Auto-scroll effect
  useEffect(() => {
    if (!isEnabled || isPaused || isUserScrolling || totalItems <= 1) return;

    intervalRef.current = setInterval(() => {
      goToNext();
    }, CAROUSEL_CONFIG.AUTO_SCROLL.INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isEnabled, isPaused, isUserScrolling, totalItems, goToNext]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  return {
    currentIndex,
    scrollToIndex,
    pauseAutoScroll,
    isPaused,
    handleScroll
  };
};
