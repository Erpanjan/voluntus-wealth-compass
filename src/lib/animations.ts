
/**
 * Utility functions for animations throughout the application
 */

/**
 * Apply a fade-in animation to an element with a delay
 * @param delay Delay in seconds
 * @returns Style object for React components
 */
export const fadeIn = (delay: number = 0) => ({
  opacity: 0,
  animation: `fadeIn 0.5s ease-out forwards`,
  animationDelay: `${delay}s`
});

/**
 * Apply a slide-in animation from specified direction
 * @param direction Direction to slide from ('left', 'right', 'top', 'bottom')
 * @param delay Delay in seconds
 * @returns Style object for React components
 */
export const slideIn = (direction: 'left' | 'right' | 'top' | 'bottom', delay: number = 0) => {
  const translateMap = {
    left: 'translateX(-20px)',
    right: 'translateX(20px)',
    top: 'translateY(-20px)',
    bottom: 'translateY(20px)'
  };
  
  return {
    opacity: 0,
    transform: translateMap[direction],
    animation: `slideIn 0.5s ease-out forwards`,
    animationDelay: `${delay}s`
  };
};

/**
 * Apply a scale animation
 * @param delay Delay in seconds
 * @returns Style object for React components
 */
export const scaleIn = (delay: number = 0) => ({
  opacity: 0,
  transform: 'scale(0.95)',
  animation: `scaleIn 0.5s ease-out forwards`,
  animationDelay: `${delay}s`
});

/**
 * Creates staggered animations for list items
 * @param index Item index in the list
 * @param baseDelay Base delay before starting the stagger
 * @param staggerAmount Amount of delay between each item
 * @returns Delay in seconds
 */
export const staggered = (index: number, baseDelay: number = 0, staggerAmount: number = 0.1) => {
  return baseDelay + (index * staggerAmount);
};
