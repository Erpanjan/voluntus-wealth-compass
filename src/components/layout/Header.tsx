
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useScrollState } from '@/hooks/useScrollState';
import { useNavigationState } from '@/hooks/useNavigationState';
import { useTransitionState } from '@/hooks/useTransitionState';
import { getHeaderBackgroundClass } from '@/utils/headerUtils';
import { HEADER_CLASSES, NAV_LINKS } from './header/constants';
import HeaderLeft from './header/sections/HeaderLeft';
import HeaderCenter from './header/sections/HeaderCenter';
import HeaderRight from './header/sections/HeaderRight';
import NavLinks from './header/NavLinks';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Custom hooks for different concerns
  const scrolled = useScrollState();
  const { isActive, handleNavLinkClick } = useNavigationState();
  const { isOnLoginPage, isTransitioning, handleLoginClick } = useTransitionState();
  
  // Visibility state for child components
  const visibilityState = { isOnLoginPage, isTransitioning };
  
  // Header background logic
  const headerBackgroundClass = getHeaderBackgroundClass(isOnLoginPage, scrolled, isMenuOpen);
  
  const handleLogoClick = () => {
    window.requestAnimationFrame(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  };
  
  return (
    <header className={cn(HEADER_CLASSES.FIXED_HEADER, headerBackgroundClass)}>
      <div className={HEADER_CLASSES.CONTAINER}>
        {/* Left Section - Logo */}
        <HeaderLeft 
          visibilityState={visibilityState}
          onLogoClick={handleLogoClick}
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
        />

        {/* Center Section - Navigation */}
        <HeaderCenter 
          visibilityState={visibilityState}
          navLinks={NAV_LINKS}
          isActive={isActive}
          handleNavLinkClick={handleNavLinkClick}
        />

        {/* Right Section - Language, Login, Mobile Menu */}
        <HeaderRight 
          visibilityState={visibilityState}
          isActive={isActive}
          handleLoginClick={handleLoginClick}
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
        />
      </div>

      {/* Mobile menu container */}
      <div className={cn(
        HEADER_CLASSES.MOBILE_MENU_CONTAINER,
        isMenuOpen && !isOnLoginPage && !isTransitioning 
          ? HEADER_CLASSES.MOBILE_MENU_VISIBLE
          : HEADER_CLASSES.MOBILE_MENU_HIDDEN
      )}>
        <NavLinks 
          navLinks={NAV_LINKS} 
          isActive={isActive} 
          handleNavLinkClick={(e, isActivePath) => {
            handleNavLinkClick(e, isActivePath);
            setIsMenuOpen(false);
          }} 
          handleLoginClick={(e) => {
            handleLoginClick(e);
            setIsMenuOpen(false);
          }}
          isMobile={true}
        />
      </div>
    </header>
  );
};

export default Header;
