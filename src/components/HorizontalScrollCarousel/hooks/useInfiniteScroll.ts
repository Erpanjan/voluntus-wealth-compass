
import { useEffect, useCallback } from 'react';
import { CarouselScrollProps } from '../types';
import { CAROUSEL_CONFIG } from '../carouselConfig';

export const useInfiniteScroll = ({ 
  scrollViewportRef, 
  totalCardWidth, 
  sectionLength, 
  isClient 
}: CarouselScrollProps) => {
  
  const handleScroll = useCallback(() => {
    const viewport = scrollViewportRef.current;
    if (!viewport || !isClient) return;

    const { scrollLeft, scrollWidth, clientWidth } = viewport;
    const maxScroll = scrollWidth - clientWidth;
    const sectionWidth = totalCardWidth * sectionLength;

    // Reset to middle section when scrolling near the edges
    if (scrollLeft <= sectionWidth * CAROUSEL_CONFIG.RESET_THRESHOLD) {
      viewport.scrollTo({
        left: scrollLeft + sectionWidth,
        behavior: 'auto'
      });
    } else if (scrollLeft >= maxScroll - sectionWidth * CAROUSEL_CONFIG.RESET_THRESHOLD) {
      viewport.scrollTo({
        left: scrollLeft - sectionWidth,
        behavior: 'auto'
      });
    }
  }, [totalCardWidth, sectionLength, isClient, scrollViewportRef]);

  useEffect(() => {
    const viewport = scrollViewportRef.current;
    if (!viewport || !isClient) return;

    // Initial position to start in the middle section
    const initialPosition = totalCardWidth * sectionLength;
    viewport.scrollTo({
      left: initialPosition,
      behavior: 'auto'
    });

    // Add scroll listener with throttling
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    viewport.addEventListener('scroll', throttledScroll, { passive: true });
    
    return () => {
      viewport.removeEventListener('scroll', throttledScroll);
    };
  }, [handleScroll, totalCardWidth, sectionLength, isClient]);
};
