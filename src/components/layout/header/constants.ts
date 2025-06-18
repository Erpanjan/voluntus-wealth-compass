
// Header configuration constants
export const HEADER_CONFIG = {
  SCROLL_THRESHOLD: 20,
  TRANSITION_DURATION: 300,
  MOBILE_MENU_MAX_HEIGHT: '32rem',
  LOGO_HEIGHT: 14,
  SPACING: {
    CONTAINER_PADDING: 4,
    NAV_LINKS: 8,
    RIGHT_ELEMENTS: 2,
    MOBILE_MENU: 4
  }
} as const;

// CSS class constants
export const HEADER_CLASSES = {
  FIXED_HEADER: 'fixed top-0 left-0 w-full z-40 transition-all duration-300',
  CONTAINER: 'container-custom py-4 flex justify-between items-center relative',
  TRANSITION_OPACITY: 'transition-opacity duration-300 ease-in-out',
  HIDDEN_ON_LOGIN: 'opacity-0 pointer-events-none',
  VISIBLE: 'opacity-100',
  NAVIGATION_CENTER: 'hidden lg:flex absolute left-1/2 transform -translate-x-1/2 items-center space-x-8 -mt-2',
  RIGHT_SECTION: 'flex items-center space-x-2',
  MOBILE_MENU_CONTAINER: 'container-custom lg:hidden transition-all duration-300 ease-in-out overflow-hidden',
  MOBILE_MENU_VISIBLE: 'max-h-[32rem] opacity-100 pb-4',
  MOBILE_MENU_HIDDEN: 'max-h-0 opacity-0 pointer-events-none'
} as const;

// Navigation links configuration
export const NAV_LINKS = [
  { path: '/', label: 'HOME', translationKey: 'nav.home' },
  { path: '/services', label: 'SERVICES', translationKey: 'nav.services' },
  { path: '/insight', label: 'INSIGHT', translationKey: 'nav.insight' },
  { path: '/about', label: 'ABOUT US', translationKey: 'nav.about' },
  { path: '/contact', label: 'CONTACT US', translationKey: 'nav.contact' },
] as const;
