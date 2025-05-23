
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { debounce } from '@/lib/utils';

export const useHeaderLogic = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Check if we're on the login page
  const isOnLoginPage = location.pathname === '/login';

  const isActive = useCallback((path: string) => {
    return location.pathname === path;
  }, [location.pathname]);

  // Optimized scroll handler with debouncing
  useEffect(() => {
    const handleScroll = debounce(() => {
      const offset = window.scrollY;
      setScrolled(offset > 50);
    }, 10);

    // Use passive listener for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial check
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Scroll to top when route changes (except for login)
  useEffect(() => {
    if (!isOnLoginPage) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.pathname, isOnLoginPage]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const navLinks = useMemo(() => [
    { name: 'HOME', path: '/' },
    { name: 'SERVICE & PRICING', path: '/services' },
    { name: 'INSIGHT', path: '/insight' },
    { name: 'EVENT', path: '/event' },
    { name: 'ABOUT', path: '/about' },
    { name: 'CONTACT US', path: '/contact' },
  ], []);

  const handleNavLinkClick = useCallback((e: React.MouseEvent, isActivePath: boolean) => {
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
  }, [isMenuOpen]);
  
  const handleLoginClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    
    // Check if user is already on the login page
    if (location.pathname === '/login') {
      return;
    }
    
    setIsAnimating(true);
    
    // Navigate to login with current location as state
    requestAnimationFrame(() => {
      setTimeout(() => {
        navigate('/login', { 
          state: { from: location },
          replace: false 
        });
        setIsAnimating(false);
      }, 150);
    });
  }, [location, navigate]);

  // Clean up animation class when component unmounts
  useEffect(() => {
    return () => {
      document.body.classList.remove('login-transition');
    };
  }, []);

  return {
    isMenuOpen,
    setIsMenuOpen,
    scrolled,
    isActive,
    navLinks,
    handleNavLinkClick,
    handleLoginClick,
    isAnimating,
    isOnLoginPage
  };
};
