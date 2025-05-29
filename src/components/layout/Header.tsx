
import { cn } from '@/lib/utils';
import { useHeaderLogic } from './header/useHeaderLogic';
import Logo from './header/Logo';
import NavLinks from './header/NavLinks';
import LoginButton from './header/LoginButton';
import MobileMenu from './header/MobileMenu';
import LanguageSelector from '@/components/LanguageSelector';

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
        {/* Logo on the left */}
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

        {/* Navigation centered absolutely */}
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

        {/* Right side elements: Language selector, Login button, Mobile menu */}
        <div className="flex items-center space-x-2">
          {/* Language selector - now with conditional visibility */}
          <div className={cn(
            "transition-opacity duration-300 ease-in-out",
            isOnLoginPage || isTransitioning ? "opacity-0 pointer-events-none" : "opacity-100"
          )}>
            <LanguageSelector />
          </div>
          
          {/* Login button - hidden on login page */}
          <div className={cn(
            "transition-opacity duration-300 ease-in-out",
            isOnLoginPage || isTransitioning ? "opacity-0 pointer-events-none" : "opacity-100"
          )}>
            <LoginButton 
              handleLoginClick={handleLoginClick} 
              isActive={isActive('/login')}
            />
          </div>
          
          {/* Mobile menu - hidden on login page */}
          <div className={cn(
            "transition-opacity duration-300 ease-in-out",
            isOnLoginPage || isTransitioning ? "opacity-0 pointer-events-none" : "opacity-100"
          )}>
            <MobileMenu
              isMenuOpen={isMenuOpen}
              setIsMenuOpen={setIsMenuOpen}
            />
          </div>
        </div>
      </div>

      {/* Mobile menu container */}
      <div className={cn(
        "container-custom lg:hidden transition-all duration-300 ease-in-out overflow-hidden",
        isMenuOpen && !isOnLoginPage && !isTransitioning 
          ? "max-h-[32rem] opacity-100 pb-4" 
          : "max-h-0 opacity-0 pointer-events-none"
      )}>
        <NavLinks 
          navLinks={navLinks} 
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
