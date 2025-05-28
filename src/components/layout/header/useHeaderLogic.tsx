
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const useHeaderLogic = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Navigation links with translation keys
  const navLinks = [
    { path: '/', label: 'HOME', translationKey: 'nav.home' },
    { path: '/services', label: 'SERVICES', translationKey: 'nav.services' },
    { path: '/insight', label: 'INSIGHT', translationKey: 'nav.insight' },
    { path: '/about', label: 'ABOUT US', translationKey: 'nav.about' },
    { path: '/contact', label: 'CONTACT US', translationKey: 'nav.contact' },
  ];

  const isOnLoginPage = location.pathname === '/login';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top whenever location changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [location.pathname]);

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const handleNavLinkClick = (e: React.MouseEvent, isActivePath: boolean) => {
    // Always scroll to top when clicking any nav link
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }, 50); // Small delay to ensure navigation has occurred
  };

  const handleLoginClick = (e: React.MouseEvent) => {
    if (location.pathname === '/login') {
      e.preventDefault();
      return;
    }
    
    setIsTransitioning(true);
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  };

  return {
    isMenuOpen,
    setIsMenuOpen,
    scrolled,
    isActive,
    navLinks,
    handleNavLinkClick,
    handleLoginClick,
    isOnLoginPage,
    isTransitioning
  };
};
