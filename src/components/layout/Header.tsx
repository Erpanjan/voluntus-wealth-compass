
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useHeaderLogic } from './header/useHeaderLogic';
import Logo from './header/Logo';
import NavLinks from './header/NavLinks';
import LoginButton from './header/LoginButton';
import MobileMenu from './header/MobileMenu';
import LanguageSwitcher from './header/LanguageSwitcher';

const Header = () => {
  const {
    isMenuOpen,
    setIsMenuOpen,
    scrolled,
    isActive,
    navLinks,
    handleNavLinkClick,
    handleLoginClick
  } = useHeaderLogic();
  
  return (
    <header 
      className={cn(
        'fixed top-0 left-0 w-full z-50 transition-all duration-300',
        scrolled || isMenuOpen ? 'bg-white shadow-sm' : 'bg-transparent'
      )}
    >
      <div className="container-custom py-4 flex justify-between items-center relative">
        {/* Logo on the left */}
        <Logo 
          handleNavLinkClick={() => {
            if (isMenuOpen) setIsMenuOpen(false);
            window.requestAnimationFrame(() => {
              window.scrollTo({
                top: 0,
                behavior: 'smooth'
              });
            });
          }}
        />

        {/* Navigation centered absolutely */}
        <NavLinks 
          navLinks={navLinks} 
          isActive={isActive} 
          handleNavLinkClick={(e, isActivePath) => handleNavLinkClick(e, isActivePath)} 
        />

        {/* Language switcher and Login button */}
        <div className="flex items-center space-x-2">
          <LanguageSwitcher />
          <LoginButton handleLoginClick={handleLoginClick} />
          <MobileMenu
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
            navLinks={navLinks}
            isActive={isActive}
            handleNavLinkClick={(e, isActivePath) => handleNavLinkClick(e, isActivePath)}
            handleLoginClick={handleLoginClick}
          />
        </div>
      </div>

      {/* Mobile menu container rendered directly in Header for positioning */}
      {isMenuOpen && (
        <div className="container-custom lg:hidden pb-6 animate-fade-in">
          <NavLinks 
            navLinks={navLinks} 
            isActive={isActive} 
            handleNavLinkClick={(e, isActivePath) => handleNavLinkClick(e, isActivePath)} 
            isMobile={true}
          />
        </div>
      )}
    </header>
  );
};

export default Header;
