
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { HEADER_CONFIG } from '@/components/layout/header/constants';

export const useTransitionState = () => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const location = useLocation();

  const isOnLoginPage = location.pathname === '/login';

  const handleLoginClick = (e: React.MouseEvent) => {
    if (location.pathname === '/login') {
      e.preventDefault();
      return;
    }
    
    setIsTransitioning(true);
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, HEADER_CONFIG.TRANSITION_DURATION);
  };

  return {
    isOnLoginPage,
    isTransitioning,
    handleLoginClick
  };
};
