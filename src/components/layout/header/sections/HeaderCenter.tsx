
import React from 'react';
import NavLinks from '../NavLinks';
import ConditionalVisibility from '../ConditionalVisibility';
import { HeaderSectionProps } from '../types';
import { NavigationLink } from '../types';

const HeaderCenter: React.FC<HeaderSectionProps & {
  navLinks: readonly NavigationLink[];
  isActive: (path: string) => boolean;
  handleNavLinkClick: (e: React.MouseEvent, isActivePath: boolean) => void;
}> = ({ visibilityState, navLinks, isActive, handleNavLinkClick }) => {
  const shouldHide = visibilityState.isOnLoginPage || visibilityState.isTransitioning;

  return (
    <ConditionalVisibility condition={shouldHide}>
      <NavLinks 
        navLinks={navLinks} 
        isActive={isActive} 
        handleNavLinkClick={handleNavLinkClick} 
      />
    </ConditionalVisibility>
  );
};

export default HeaderCenter;
