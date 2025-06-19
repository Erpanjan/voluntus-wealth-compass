
export const CAROUSEL_CONFIG = {
  MOBILE_BREAKPOINT: 768,
  
  // Fixed viewport-based widths for predictable one-card display
  CARD_WIDTH: {
    MOBILE: '85vw', // 85% of viewport width on mobile
    DESKTOP: '70vw', // 70% of viewport width on desktop
  },
  
  GAP: {
    MOBILE: '2rem', // 32px
    DESKTOP: '3rem', // 48px
  },
  
  PADDING: {
    MOBILE: '1rem', // 16px
    DESKTOP: '2rem', // 32px
  },
  
  AUTO_SCROLL: {
    INTERVAL: 4000, // 4 seconds
    PAUSE_ON_INTERACTION: 3000, // 3 seconds pause after interaction
  },
} as const;
