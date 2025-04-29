
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
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
        <Link to="/" className="flex items-center ml-[-20px]">
          {isMobile ? (
            // Stacked logo for mobile
            <div className="flex flex-col items-center">
              <img 
                src="/lovable-uploads/1299dda5-8505-446c-bf31-65ac3f812867.png" 
                alt="Voluntus Logo" 
                className="h-16" 
              />
            </div>
          ) : (
            // Horizontal logo for desktop
            <div className="flex items-center">
              <img 
                src="/lovable-uploads/1299dda5-8505-446c-bf31-65ac3f812867.png" 
                alt="Voluntus Logo" 
                className="h-16" 
              />
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
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-[#9F9EA1] hover:text-black text-xs tracking-wide border border-[#9F9EA1] rounded-full px-4 py-1"
            >
              LOGIN
            </Button>
          </Link>
        </nav>

        <div className="flex items-center lg:hidden space-x-4">
          <Link to="/login">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-[#9F9EA1] hover:text-black text-xs border border-[#9F9EA1] rounded-full px-4 py-1"
            >
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
