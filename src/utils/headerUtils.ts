
import { HEADER_CONFIG } from '@/components/layout/header/constants';

/**
 * Scrolls to top of page with smooth behavior
 */
export const scrollToTop = (delay = 50): void => {
  setTimeout(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, delay);
};

/**
 * Determines if a path is active based on current location
 */
export const isPathActive = (targetPath: string, currentPath: string): boolean => {
  if (targetPath === '/') {
    return currentPath === '/';
  }
  return currentPath.startsWith(targetPath);
};

/**
 * Checks if scroll position is past threshold
 */
export const isScrolled = (): boolean => {
  return window.scrollY > HEADER_CONFIG.SCROLL_THRESHOLD;
};

/**
 * Gets header background class based on state
 */
export const getHeaderBackgroundClass = (
  isOnLoginPage: boolean,
  scrolled: boolean,
  isMenuOpen: boolean
): string => {
  if (isOnLoginPage) {
    return 'bg-white/90 backdrop-blur-sm shadow-sm';
  }
  
  if (scrolled || isMenuOpen) {
    return 'bg-white shadow-sm';
  }
  
  return 'bg-transparent';
};
