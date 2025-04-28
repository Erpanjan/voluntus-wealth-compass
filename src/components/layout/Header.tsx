
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, UserRound } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
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
        <Link to="/" className="flex items-center">
          {isMobile ? (
            // Stacked logo for mobile (first logo variant)
            <div className="flex flex-col items-center">
              <svg width="40" height="40" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-1">
                <path d="M120 40C100 70 80 140 60 170" stroke="black" strokeWidth="10" strokeLinecap="round"/>
                <path d="M80 40C100 70 120 140 140 170" stroke="black" strokeWidth="10" strokeLinecap="round"/>
                <circle cx="100" cy="170" r="5" fill="black"/>
              </svg>
              <span className="font-bold text-lg text-black">VOLUNTUS</span>
              <span className="text-xs tracking-wider text-[#9F9EA1]">LONG-TERM CAPITAL</span>
            </div>
          ) : (
            // Horizontal logo for desktop (second logo variant)
            <div className="flex items-center">
              <svg width="40" height="40" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M120 40C100 70 80 140 60 170" stroke="black" strokeWidth="10" strokeLinecap="round"/>
                <path d="M80 40C100 70 120 140 140 170" stroke="black" strokeWidth="10" strokeLinecap="round"/>
                <circle cx="100" cy="170" r="5" fill="black"/>
              </svg>
              <div className="h-10 w-px bg-black mx-4"></div>
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-tight text-black">VOLUNTUS</span>
                <span className="text-xs tracking-wider leading-tight text-black">LONG-TERM CAPITAL</span>
              </div>
            </div>
          )}
        </Link>

        <nav className="hidden lg:flex items-center">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={(e) => {
                if (isActive(link.path)) {
                  e.preventDefault();
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

          <Link to="/login" className="ml-5">
            <Button variant="ghost" size="sm" className="text-[#9F9EA1] hover:text-black flex items-center gap-1 text-xs tracking-wide">
              <UserRound size={18} />
              LOGIN
            </Button>
          </Link>
        </nav>

        <div className="flex items-center lg:hidden space-x-4">
          <Link to="/login">
            <Button variant="ghost" size="sm" className="text-[#9F9EA1] hover:text-black flex items-center gap-1 text-xs">
              <UserRound size={18} />
              LOGIN
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
                  } else {
                    setIsMenuOpen(false);
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
