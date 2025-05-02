
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Add effect to scroll to top when route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const navLinks = [
    { name: 'HOME', path: '/' },
    { name: 'SERVICE & PRICING', path: '/services' },
    { name: 'INSIGHT', path: '/insight' },
    { name: 'EVENT', path: '/event' },
    { name: 'ABOUT', path: '/about' },
    { name: 'CONTACT US', path: '/contact' },
  ];

  const handleNavLinkClick = () => {
    // Close mobile menu if it's open
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
    
    // Scroll to top of the page
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  const handleLoginClick = (e) => {
    e.preventDefault();
    
    // Check if user is already on the login page
    if (location.pathname === '/login') {
      // Do nothing if already on login page
      return;
    }
    
    setIsAnimating(true);
    
    // Add a fade-out animation to the entire page with scale effect
    document.body.classList.add('login-transition');
    
    // Navigate after animation completes
    setTimeout(() => {
      navigate('/login');
    }, 600); // Match this with the CSS animation duration
  };

  return (
    <header 
      className={cn(
        'fixed top-0 left-0 w-full z-50 transition-all duration-300',
        scrolled || isMenuOpen ? 'bg-white shadow-sm' : 'bg-transparent'
      )}
    >
      <div className="container-custom py-4 flex justify-between items-center relative">
        {/* Logo on the left */}
        <Link to="/" className="flex items-center ml-[-20px]" onClick={handleNavLinkClick}>
          {isMobile ? (
            // Stacked logo for mobile
            <div className="flex flex-col items-center">
              <img 
                src="/lovable-uploads/e4b4f8b7-8d82-468f-b861-b6a593038f7c.png" 
                alt="Voluntus Logo" 
                className="h-16" 
              />
            </div>
          ) : (
            // Horizontal logo for desktop
            <div className="flex items-center">
              <img 
                src="/lovable-uploads/e4b4f8b7-8d82-468f-b861-b6a593038f7c.png" 
                alt="Voluntus Logo" 
                className="h-16" 
              />
            </div>
          )}
        </Link>

        {/* Navigation centered absolutely */}
        <nav className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={(e) => {
                if (isActive(link.path)) {
                  e.preventDefault();
                  window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                  });
                } else {
                  handleNavLinkClick();
                }
              }}
              className={cn(
                "px-5 py-2 text-xs tracking-wide transition-all duration-300",
                isActive(link.path) 
                  ? 'font-semibold text-black' 
                  : 'font-normal text-[#9F9EA1] hover:text-black'
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Login button on the right */}
        <div className="flex items-center">
          <button 
            onClick={handleLoginClick} 
            className="hidden lg:block text-[#9F9EA1] hover:text-black text-xs tracking-wide border border-[#9F9EA1] hover:border-black rounded-full px-4 py-1 transition-all duration-300 ease-in-out hover:bg-black/5"
            aria-label="Login to client portal"
          >
            LOGIN
          </button>
          
          <div className="flex lg:hidden space-x-4 items-center">
            <button 
              onClick={handleLoginClick}
              className="text-[#9F9EA1] hover:text-black text-xs border border-[#9F9EA1] hover:border-black rounded-full px-4 py-1 transition-all duration-300 ease-in-out hover:bg-black/5"
              aria-label="Login to client portal"
            >
              LOGIN
            </button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="container-custom lg:hidden pb-6 animate-fade-in">
          <nav className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={(e) => {
                  if (isActive(link.path)) {
                    e.preventDefault();
                    window.scrollTo({
                      top: 0,
                      behavior: 'smooth'
                    });
                    setIsMenuOpen(false);
                  } else {
                    handleNavLinkClick();
                  }
                }}
                className={cn(
                  'py-2 text-sm transition-all duration-300',
                  isActive(link.path) 
                    ? 'font-semibold text-black border-l-2 border-black pl-3' 
                    : 'font-normal text-[#9F9EA1] hover:text-black pl-3'
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
