
import { useState, useEffect, useCallback } from 'react';
import { CarouselDimensions } from '../types';
import { CAROUSEL_CONFIG } from '../carouselConfig';

export const useCarouselDimensions = (): CarouselDimensions => {
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Check if we're on mobile and if we're on the client
  useEffect(() => {
    setIsClient(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < CAROUSEL_CONFIG.MOBILE_BREAKPOINT);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Calculate card width for one-card-at-a-time display
  const getCardWidth = useCallback(() => {
    if (!isClient || typeof window === 'undefined') return 350;
    
    const viewportWidth = window.innerWidth;
    if (viewportWidth < CAROUSEL_CONFIG.MOBILE_BREAKPOINT) {
      // Mobile: 95% of viewport width for immersive experience
      return Math.min(viewportWidth * CAROUSEL_CONFIG.MOBILE_CARD_WIDTH_PERCENTAGE, viewportWidth - 20);
    } else {
      // Web: 85-90% of viewport width, max 900px for optimal reading
      return Math.min(CAROUSEL_CONFIG.MAX_CARD_WIDTH, viewportWidth * CAROUSEL_CONFIG.WEB_CARD_WIDTH_PERCENTAGE);
    }
  }, [isClient]);

  const [cardWidth, setCardWidth] = useState(() => getCardWidth());
  const cardGap = isMobile ? CAROUSEL_CONFIG.MOBILE_GAP : CAROUSEL_CONFIG.WEB_GAP;
  const totalCardWidth = cardWidth + cardGap;

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

  return {
    cardWidth,
    cardGap,
    totalCardWidth,
    isMobile,
    isClient
  };
};
