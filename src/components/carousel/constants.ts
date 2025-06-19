
export const CAROUSEL_CONFIG = {
  MOBILE_BREAKPOINT: 768,
  
  // Optimized viewport-based widths for better proportions
  CARD_WIDTH: {
    MOBILE: 'calc(100vw - 3rem)', // Reduced padding for better mobile experience
    DESKTOP: 'min(45vw, 580px)', // Smaller cards for better readability
  },
  
  GAP: {
    MOBILE: '1.25rem', // 20px - tighter spacing for mobile
    DESKTOP: '1.5rem', // 24px - cleaner spacing for desktop
  },
  
  PADDING: {
    MOBILE: '1.5rem', // 24px - reduced outer padding
    DESKTOP: '3rem', // 48px - cleaner outer padding
  },
  
  AUTO_SCROLL: {
    INTERVAL: 5000, // 5 seconds - slightly slower for better readability
    PAUSE_ON_INTERACTION: 3000, // 3 seconds pause after interaction
  },
} as const;
