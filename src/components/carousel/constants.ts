
export const CAROUSEL_CONFIG = {
  MOBILE_BREAKPOINT: 768,
  DEFAULT_CARD_WIDTH: 350,
  DEFAULT_GAP: 60,
  
  PADDING: {
    MOBILE: 0.05, // 5% on each side
    DESKTOP: 0.075, // 7.5% on each side
  },
  
  GAP_RATIO: {
    MOBILE: 0.15, // 15% of viewport
    DESKTOP: 0.2, // 20% of viewport
  },
  
  CARD_WIDTH_RATIO: 0.9, // 90% of available width
  MAX_CARD_WIDTH: 800,
  
  SCROLL_THRESHOLD: 0.1, // 10% threshold for infinite scroll reset
} as const;
