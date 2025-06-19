
export const CAROUSEL_CONFIG = {
  MOBILE_BREAKPOINT: 768,
  
  // Improved viewport-based widths to prevent cutoff
  CARD_WIDTH: {
    MOBILE: 'calc(100vw - 4rem)', // Account for container margins
    DESKTOP: 'calc(100vw - 8rem)', // Account for container margins with max constraint
  },
  
  GAP: {
    MOBILE: '1.5rem', // 24px - reduced for better fit
    DESKTOP: '2rem', // 32px - reduced for better fit
  },
  
  PADDING: {
    MOBILE: '2rem', // 32px - container outer padding
    DESKTOP: '4rem', // 64px - container outer padding
  },
  
  AUTO_SCROLL: {
    INTERVAL: 4000, // 4 seconds
    PAUSE_ON_INTERACTION: 3000, // 3 seconds pause after interaction
  },
} as const;
