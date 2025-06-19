
export const CAROUSEL_CONFIG = {
  MOBILE_BREAKPOINT: 768,
  
  // Very conservative widths to guarantee no cutoff
  CARD_WIDTH: {
    MOBILE: 'calc(100vw - 8rem)', // Very conservative: 4rem padding total + 4rem safety buffer
    DESKTOP: 'calc(100vw - 16rem)', // Very conservative: 6rem padding total + 10rem safety buffer
  },
  
  GAP: {
    MOBILE: '1rem', // 16px - reduced gap
    DESKTOP: '1.5rem', // 24px - reduced gap
  },
  
  PADDING: {
    MOBILE: '2rem', // 32px total (1rem each side)
    DESKTOP: '3rem', // 48px total (1.5rem each side)
  },
  
  AUTO_SCROLL: {
    INTERVAL: 4000, // 4 seconds
    PAUSE_ON_INTERACTION: 3000, // 3 seconds pause after interaction
  },
} as const;
