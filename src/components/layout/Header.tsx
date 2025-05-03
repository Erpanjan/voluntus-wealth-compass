
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import Logo from './Logo';
import NavLinks from './navigation/NavLinks';
import MobileMenu from './navigation/MobileMenu';
import LoginButton from './navigation/LoginButton';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

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

  const handleNavLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, isActive: boolean) => {
    // Close mobile menu if it's open
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
    
    // If already on the page, prevent navigation and just scroll to top
    if (isActive) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
    
    // Scroll to top of the page
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  const handleLoginClick = (e: React.MouseEvent) => {
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
        <Logo isMobile={isMobile} onClick={() => setIsMenuOpen(false)} />

        {/* Navigation centered absolutely */}
        <nav className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 items-center">
          <NavLinks links={navLinks} onLinkClick={handleNavLinkClick} />
        </nav>

        {/* Login button on the right */}
        <div className="flex items-center">
          <LoginButton onClick={handleLoginClick} />
          
          <div className="flex lg:hidden space-x-4 items-center">
            <LoginButton onClick={handleLoginClick} isMobile />
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

      <MobileMenu 
        isOpen={isMenuOpen} 
        links={navLinks} 
        onLinkClick={handleNavLinkClick} 
      />
    </header>
  );
};

export default Header;
