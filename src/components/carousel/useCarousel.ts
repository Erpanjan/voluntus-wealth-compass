
import { useState, useEffect, useCallback, useRef } from 'react';
import { ContentSection, CarouselItem } from './types';

export const useCarousel = (containerSections: ContentSection[]) => {
  const scrollViewportRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  // Check if we're on mobile and if we're on the client
  useEffect(() => {
    setIsClient(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Create three copies for infinite scroll
  const infiniteItems: CarouselItem[] = [
    ...containerSections.map((section, index) => ({ ...section, id: `${section.id}-1`, originalIndex: index })),
    ...containerSections.map((section, index) => ({ ...section, id: `${section.id}-2`, originalIndex: index })),
    ...containerSections.map((section, index) => ({ ...section, id: `${section.id}-3`, originalIndex: index }))
  ];

  // Calculate card width based on viewport - one card for web, multiple for mobile
  const getCardWidth = useCallback(() => {
    if (!isClient || typeof window === 'undefined') return 300; // Fallback for SSR
    
    const viewportWidth = window.innerWidth;
    if (viewportWidth < 640) {
      // Mobile: keep existing behavior - 85% of viewport, max 280px
      return Math.min(280, viewportWidth * 0.85);
    } else {
      // Web/Desktop: one card at a time - container width minus padding
      const containerPadding = viewportWidth < 1024 ? 48 : 96; // 3rem or 6rem total padding
      return Math.min(800, viewportWidth - containerPadding);
    }
  }, [isClient]);

  const [cardWidth, setCardWidth] = useState(() => getCardWidth());
  const cardGap = isMobile ? 12 : 48; // Larger gap for web to ensure proper spacing
  const totalCardWidth = cardWidth + cardGap;
  const sectionLength = containerSections.length;

  // Update card width on resize
  useEffect(() => {
    if (!isClient) return;
    
    const handleResize = () => {
      const newCardWidth = getCardWidth();
      setCardWidth(newCardWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [getCardWidth, isClient]);

  // Update current index and scroll states
  const updateScrollState = useCallback(() => {
    const viewport = scrollViewportRef.current;
    if (!viewport || !isClient) return;

    const { scrollLeft } = viewport;
    const newIndex = Math.round(scrollLeft / totalCardWidth) % sectionLength;
    setCurrentIndex(newIndex);
    
    // Update scroll button states
    setCanScrollPrev(scrollLeft > totalCardWidth * 0.5);
    setCanScrollNext(scrollLeft < (totalCardWidth * sectionLength * 2.5));
  }, [totalCardWidth, sectionLength, isClient]);

  const handleScroll = useCallback(() => {
    const viewport = scrollViewportRef.current;
    if (!viewport || !isClient) return;

    const { scrollLeft, scrollWidth, clientWidth } = viewport;
    const maxScroll = scrollWidth - clientWidth;
    const sectionWidth = totalCardWidth * sectionLength;

    // Reset to middle section when scrolling near the edges
    if (scrollLeft <= sectionWidth * 0.1) {
      viewport.scrollTo({
        left: scrollLeft + sectionWidth,
        behavior: 'auto'
      });
    } else if (scrollLeft >= maxScroll - sectionWidth * 0.1) {
      viewport.scrollTo({
        left: scrollLeft - sectionWidth,
        behavior: 'auto'
      });
    }

    updateScrollState();
  }, [totalCardWidth, sectionLength, isClient, updateScrollState]);

  // Navigation functions
  const scrollToIndex = useCallback((index: number) => {
    const viewport = scrollViewportRef.current;
    if (!viewport || !isClient) return;

    const targetScroll = (index + sectionLength) * totalCardWidth;
    viewport.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    });
  }, [totalCardWidth, sectionLength, isClient]);

  const scrollPrevious = useCallback(() => {
    const newIndex = currentIndex === 0 ? sectionLength - 1 : currentIndex - 1;
    scrollToIndex(newIndex);
  }, [currentIndex, sectionLength, scrollToIndex]);

  const scrollNext = useCallback(() => {
    const newIndex = (currentIndex + 1) % sectionLength;
    scrollToIndex(newIndex);
  }, [currentIndex, sectionLength, scrollToIndex]);

  // Keyboard navigation
  useEffect(() => {
    if (!isClient) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        scrollPrevious();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        scrollNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [scrollPrevious, scrollNext, isClient]);

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
    
    // Initial state update
    updateScrollState();
    
    return () => {
      viewport.removeEventListener('scroll', throttledScroll);
    };
  }, [handleScroll, totalCardWidth, sectionLength, isClient, updateScrollState]);

  return {
    scrollViewportRef,
    isMobile,
    isClient,
    infiniteItems,
    cardWidth,
    currentIndex,
    canScrollPrev,
    canScrollNext,
    scrollPrevious,
    scrollNext,
    scrollToIndex,
    totalItems: sectionLength
  };
};
