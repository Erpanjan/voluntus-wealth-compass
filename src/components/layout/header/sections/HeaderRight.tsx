
import React from 'react';
import LanguageSelector from '@/components/LanguageSelector';
import LoginButton from '../LoginButton';
import MobileMenu from '../MobileMenu';
import ConditionalVisibility from '../ConditionalVisibility';
import { HeaderSectionProps } from '../types';
import { HEADER_CLASSES } from '../constants';

const HeaderRight: React.FC<HeaderSectionProps & {
  isActive: (path: string) => boolean;
  handleLoginClick: (e: React.MouseEvent) => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
}> = ({ 
  visibilityState, 
  isActive, 
  handleLoginClick, 
  isMenuOpen, 
  setIsMenuOpen 
}) => {
  const shouldHide = visibilityState.isOnLoginPage || visibilityState.isTransitioning;

  return (
    <div className={HEADER_CLASSES.RIGHT_SECTION}>
      <ConditionalVisibility condition={shouldHide}>
        <LanguageSelector />
      </ConditionalVisibility>
      
      <ConditionalVisibility condition={shouldHide}>
        <LoginButton 
          handleLoginClick={handleLoginClick} 
          isActive={isActive('/login')}
        />
      </ConditionalVisibility>
      
      <ConditionalVisibility condition={shouldHide}>
        <MobileMenu
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
        />
      </ConditionalVisibility>
    </div>
  );
};

export default HeaderRight;
