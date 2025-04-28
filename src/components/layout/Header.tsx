
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Check if the current route matches the link
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Handle scroll event to add background to header on scroll
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

  // Navigation links
  const navLinks = [
    { name: 'HOME', path: '/' },
    { name: 'SERVICE & PRICING', path: '/services' },
    { name: 'INSIGHT', path: '/insight' },
    { name: 'EVENT', path: '/event' },
    { name: 'ABOUT', path: '/about' },
    { name: 'CONTACT US', path: '/contact' },
  ];

  return (
    <header 
      className={cn(
        'fixed top-0 left-0 w-full z-50 transition-all duration-300',
        scrolled || isMenuOpen ? 'bg-white shadow-sm' : 'bg-transparent'
      )}
    >
      <div className="container-custom py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="text-2xl font-bold text-black">
            <span className="text-[#C8C8C9]">V</span>
          </div>
          <div className="hidden md:flex flex-col">
            <span className="font-semibold text-lg leading-none text-black">VOLUNTUS</span>
            <span className="text-xs text-[#9F9EA1] leading-none">LONG-TERM CAPITAL</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={cn(
                'text-sm font-medium hover:text-[#C8C8C9] transition-colors',
                isActive(link.path) ? 'text-[#C8C8C9]' : 'text-black'
              )}
            >
              {link.name}
            </Link>
          ))}

          {/* Login Button */}
          <Link to="/login">
            <Button variant="outline" className="rounded-full flex items-center gap-2">
              <User size={18} />
              <span className="hidden md:inline">Login</span>
            </Button>
          </Link>
        </nav>

        {/* Mobile Navigation Trigger */}
        <div className="flex items-center lg:hidden space-x-4">
          <Link to="/login">
            <Button variant="outline" size="icon" className="rounded-full">
              <User size={18} />
            </Button>
          </Link>
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

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="container-custom lg:hidden pb-6 animate-fade-in">
          <nav className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  'py-2 text-sm font-medium transition-colors',
                  isActive(link.path) ? 'text-[#C8C8C9]' : 'text-black'
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
