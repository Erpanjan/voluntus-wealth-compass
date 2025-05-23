
import { cn } from '@/lib/utils';
import { useHeaderLogic } from './header/useHeaderLogic';
import Logo from './header/Logo';
import NavLinks from './header/NavLinks';
import LoginButton from './header/LoginButton';
import MobileMenu from './header/MobileMenu';

const Header = () => {
  const {
    isMenuOpen,
    setIsMenuOpen,
    scrolled,
    isActive,
    navLinks,
    handleNavLinkClick,
    handleLoginClick,
    isOnLoginPage
  } = useHeaderLogic();
  
  return (
    <header 
      className={cn(
        'fixed top-0 left-0 w-full z-40 transition-all duration-300',
        // Show minimal header on login page with backdrop
        isOnLoginPage 
          ? 'bg-white/90 backdrop-blur-sm shadow-sm' 
          : (scrolled || isMenuOpen ? 'bg-white shadow-sm' : 'bg-transparent')
      )}
    >
      <div className="container-custom py-4 flex justify-between items-center relative">
        {/* Logo on the left - hide on login page */}
        {!isOnLoginPage && (
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
        )}

        {/* Navigation centered absolutely - hide on login page */}
        {!isOnLoginPage && (
          <NavLinks 
            navLinks={navLinks} 
            isActive={isActive} 
            handleNavLinkClick={(e, isActivePath) => handleNavLinkClick(e, isActivePath)} 
          />
        )}

        {/* Login button and mobile menu - hide login button on login page */}
        {!isOnLoginPage && (
          <div className="flex items-center">
            <LoginButton 
              handleLoginClick={handleLoginClick} 
              isActive={isActive('/login')}
            />
            
            <MobileMenu
              isMenuOpen={isMenuOpen}
              setIsMenuOpen={setIsMenuOpen}
              navLinks={navLinks}
              isActive={isActive}
              handleNavLinkClick={(e, isActivePath) => handleNavLinkClick(e, isActivePath)}
              handleLoginClick={handleLoginClick}
              isLoginActive={isActive('/login')}
            />
          </div>
        )}
      </div>

      {/* Mobile menu container - hide on login page */}
      {!isOnLoginPage && isMenuOpen && (
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
