
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
    isOnLoginPage,
    isTransitioning
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
        {/* Logo on the left - use opacity transition instead of hiding */}
        <div className={cn(
          "transition-opacity duration-300 ease-in-out",
          isOnLoginPage || isTransitioning ? "opacity-0 pointer-events-none" : "opacity-100"
        )}>
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
        </div>

        {/* Navigation centered absolutely - use opacity transition */}
        <div className={cn(
          "transition-opacity duration-300 ease-in-out",
          isOnLoginPage || isTransitioning ? "opacity-0 pointer-events-none" : "opacity-100"
        )}>
          <NavLinks 
            navLinks={navLinks} 
            isActive={isActive} 
            handleNavLinkClick={(e, isActivePath) => handleNavLinkClick(e, isActivePath)} 
          />
        </div>

        {/* Login button and mobile menu */}
        <div className="flex items-center">
          {/* Desktop Login Button */}
          <div className={cn(
            "transition-opacity duration-300 ease-in-out",
            isOnLoginPage || isTransitioning ? "opacity-0 pointer-events-none" : "opacity-100"
          )}>
            <LoginButton 
              handleLoginClick={handleLoginClick} 
              isActive={isActive('/login')}
            />
          </div>
          
          {/* Mobile Menu Toggle */}
          <div className={cn(
            "transition-opacity duration-300 ease-in-out",
            isOnLoginPage || isTransitioning ? "opacity-0 pointer-events-none" : "opacity-100"
          )}>
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
        </div>
      </div>
    </header>
  );
};

export default Header;
