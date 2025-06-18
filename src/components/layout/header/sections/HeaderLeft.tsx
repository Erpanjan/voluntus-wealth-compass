
import React from 'react';
import Logo from '../Logo';
import ConditionalVisibility from '../ConditionalVisibility';
import { HeaderSectionProps } from '../types';

const HeaderLeft: React.FC<HeaderSectionProps & { 
  onLogoClick: () => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
}> = ({ visibilityState, onLogoClick, isMenuOpen, setIsMenuOpen }) => {
  const shouldHide = visibilityState.isOnLoginPage || visibilityState.isTransitioning;

  const handleLogoClick = () => {
    if (isMenuOpen) setIsMenuOpen(false);
    onLogoClick();
  };

  return (
    <ConditionalVisibility condition={shouldHide}>
      <Logo handleNavLinkClick={handleLogoClick} />
    </ConditionalVisibility>
  );
};

export default HeaderLeft;
