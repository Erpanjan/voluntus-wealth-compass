
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const useHeaderLogic = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Optimized scroll handler with throttling
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const offset = window.scrollY;
          setScrolled(offset > 50);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Add effect to scroll to top when route changes - optimized
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

  const handleNavLinkClick = (e: React.MouseEvent, isActivePath: boolean) => {
    if (isActivePath) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
    
    // Close mobile menu if it's open
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
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
    
    // Navigate after animation begins for perceived performance improvement
    window.requestAnimationFrame(() => {
      // Use a shorter timeout for faster transition
      setTimeout(() => {
        navigate('/login');
      }, 300); // Reduced from 600ms
    });
  };

  return {
    isMenuOpen,
    setIsMenuOpen,
    scrolled,
    isActive,
    navLinks,
    handleNavLinkClick,
    handleLoginClick
  };
};
