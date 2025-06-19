
export const CAROUSEL_CONFIG = {
  // Card sizing
  MOBILE_CARD_WIDTH_PERCENTAGE: 0.95,
  WEB_CARD_WIDTH_PERCENTAGE: 0.87,
  MAX_CARD_WIDTH: 900,
  
  // Spacing
  MOBILE_GAP: 20,
  WEB_GAP: 40,
  
  // Heights
  MOBILE_MIN_HEIGHT: 420,
  WEB_MIN_HEIGHT: 500,
  
  // Padding
  MOBILE_PADDING: {
    horizontal: '2.5%',
    vertical: '3',
    bottom: '8'
  },
  WEB_PADDING: {
    horizontal: '6.5%',
    vertical: '6',
    bottom: '12'
  },
  
  // Infinite scroll
  SECTION_COPIES: 3,
  RESET_THRESHOLD: 0.1,
  
  // Breakpoints
  MOBILE_BREAKPOINT: 768,
  
  // Animation
  SCROLL_BEHAVIOR: 'smooth' as const,
  THROTTLE_DELAY: 16
} as const;

export const CAROUSEL_CLASSES = {
  container: "one-card-carousel scroll-smooth",
  card: "shrink-0 rounded-3xl bg-white shadow-lg hover:shadow-xl transition-all duration-500 relative premium-card",
  badge: "absolute bg-gradient-to-r from-gray-100 to-gray-50 text-gray-800 rounded-full font-semibold shadow-sm",
  button: "bg-black hover:bg-gray-900 text-white transition-all duration-300 self-start shadow-md hover:shadow-lg transform hover:scale-[1.02]"
} as const;
