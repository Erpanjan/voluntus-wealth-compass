
import { useState } from 'react';
import { useScrollState } from '@/hooks/useScrollState';
import { useNavigationState } from '@/hooks/useNavigationState';
import { useTransitionState } from '@/hooks/useTransitionState';
import { NAV_LINKS } from './constants';
import { HeaderLogicReturn } from './types';

export const useHeaderLogic = (): HeaderLogicReturn => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Use the new focused hooks
  const scrolled = useScrollState();
  const { isActive, handleNavLinkClick } = useNavigationState();
  const { isOnLoginPage, isTransitioning, handleLoginClick } = useTransitionState();

  return {
    isMenuOpen,
    setIsMenuOpen,
    scrolled,
    isActive,
    navLinks: NAV_LINKS,
    handleNavLinkClick,
    handleLoginClick,
    isOnLoginPage,
    isTransitioning
  };
};
