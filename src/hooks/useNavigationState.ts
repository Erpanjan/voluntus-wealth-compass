
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { isPathActive, scrollToTop } from '@/utils/headerUtils';

export const useNavigationState = () => {
  const location = useLocation();

  // Scroll to top whenever location changes
  useEffect(() => {
    scrollToTop();
  }, [location.pathname]);

  const isActive = (path: string) => {
    return isPathActive(path, location.pathname);
  };

  const handleNavLinkClick = (e: React.MouseEvent, isActivePath: boolean) => {
    // Always scroll to top when clicking any nav link
    scrollToTop();
  };

  return {
    location,
    isActive,
    handleNavLinkClick
  };
};
