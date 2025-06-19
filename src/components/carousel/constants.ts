

export const CAROUSEL_CONFIG = {
  MOBILE_BREAKPOINT: 768,
  
  // Simplified widths to prevent cutoff
  CARD_WIDTH: {
    MOBILE: 'calc(100vw - 6rem)', // Account for padding and gaps
    DESKTOP: 'calc(100vw - 10rem)', // Account for padding and gaps
  },
  
  GAP: {
    MOBILE: '1.5rem', // 24px
    DESKTOP: '2rem', // 32px
  },
  
  PADDING: {
    MOBILE: '2rem', // 32px - inner container padding only
    DESKTOP: '3rem', // 48px - inner container padding only
  },
  
  AUTO_SCROLL: {
    INTERVAL: 4000, // 4 seconds
    PAUSE_ON_INTERACTION: 3000, // 3 seconds pause after interaction
  },
} as const;

