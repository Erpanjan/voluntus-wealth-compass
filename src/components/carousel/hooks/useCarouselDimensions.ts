
import { useState, useEffect, useCallback } from 'react';
import { CAROUSEL_CONFIG } from '../constants';
import { CarouselDimensions } from '../types';

export const useCarouselDimensions = (isClient: boolean, isMobile: boolean): CarouselDimensions => {
  const getCardWidth = useCallback(() => {
    if (!isClient || typeof window === 'undefined') return CAROUSEL_CONFIG.DEFAULT_CARD_WIDTH;
    
    const viewportWidth = window.innerWidth;
    
    if (viewportWidth < CAROUSEL_CONFIG.MOBILE_BREAKPOINT) {
      const totalPadding = viewportWidth * (CAROUSEL_CONFIG.PADDING.MOBILE * 2);
      const availableWidth = viewportWidth - totalPadding;
      return Math.floor(availableWidth * CAROUSEL_CONFIG.CARD_WIDTH_RATIO);
    } else {
      const totalPadding = viewportWidth * (CAROUSEL_CONFIG.PADDING.DESKTOP * 2);
      const availableWidth = viewportWidth - totalPadding;
      const calculatedWidth = Math.floor(availableWidth * CAROUSEL_CONFIG.CARD_WIDTH_RATIO);
      return Math.min(calculatedWidth, CAROUSEL_CONFIG.MAX_CARD_WIDTH);
    }
  }, [isClient]);

  const getCardGap = useCallback(() => {
    if (!isClient || typeof window === 'undefined') return CAROUSEL_CONFIG.DEFAULT_GAP;
    
    const viewportWidth = window.innerWidth;
    if (viewportWidth < CAROUSEL_CONFIG.MOBILE_BREAKPOINT) {
      return Math.floor(viewportWidth * CAROUSEL_CONFIG.GAP_RATIO.MOBILE);
    } else {
      return Math.floor(viewportWidth * CAROUSEL_CONFIG.GAP_RATIO.DESKTOP);
    }
  }, [isClient, isMobile]);

  const [cardWidth, setCardWidth] = useState(() => getCardWidth());
  const [cardGap, setCardGap] = useState(() => getCardGap());

  useEffect(() => {
    if (!isClient) return;
    
    const handleResize = () => {
      const newCardWidth = getCardWidth();
      const newCardGap = getCardGap();
      setCardWidth(newCardWidth);
      setCardGap(newCardGap);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [getCardWidth, getCardGap, isClient]);

  return {
    cardWidth,
    cardGap,
    totalCardWidth: cardWidth + cardGap,
  };
};
