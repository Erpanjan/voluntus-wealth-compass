
import { useState, useEffect } from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined)

  useEffect(() => {
    // Use modern ResizeObserver for better performance instead of matchMedia
    const updateMobileState = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    // Initialize state
    updateMobileState()
    
    // Use throttled resize handler for better performance
    let resizeTimeout: number | null = null;
    const handleResize = () => {
      if (resizeTimeout === null) {
        resizeTimeout = window.setTimeout(() => {
          resizeTimeout = null
          updateMobileState()
        }, 100) // Throttle to 100ms
      }
    }

    // Use passive listener for better performance
    window.addEventListener('resize', handleResize, { passive: true })
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize)
      if (resizeTimeout) {
        window.clearTimeout(resizeTimeout)
      }
    }
  }, [])

  return !!isMobile
}
