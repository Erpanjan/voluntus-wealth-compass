
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useScrollState } from '@/hooks/useScrollState';
import { useLanguage } from '@/contexts/LanguageContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const scrolled = useScrollState();
  const location = useLocation();
  const { t } = useLanguage();

  const navLinks = [
    { path: '/', label: 'HOME' },
    { path: '/services', label: 'SERVICES' },
    { path: '/insight', label: 'STORIES' },
    { path: '/about', label: 'ABOUT' },
    { path: '/contact', label: 'CONTACT' },
  ];

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      scrolled ? "bg-white/95 backdrop-blur-sm" : "bg-white"
    )}>
      <div className="container-custom">
        <div className="flex items-center justify-between py-8">
          {/* Logo/Brand */}
          <Link to="/" className="text-black font-normal text-sm tracking-widest uppercase">
            VOLUNTAS
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-12">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "nav-item",
                  location.pathname === link.path && "opacity-100 font-normal"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Get Updates CTA */}
          <Link 
            to="/contact" 
            className="hidden md:block nav-item border-b border-transparent hover:border-black pb-px"
          >
            GET UPDATES
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-black"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="sr-only">Menu</span>
            <div className="w-5 h-4 flex flex-col justify-between">
              <span className={cn(
                "w-full h-px bg-black transition-all duration-300",
                isMenuOpen && "rotate-45 translate-y-1.5"
              )} />
              <span className={cn(
                "w-full h-px bg-black transition-all duration-300",
                isMenuOpen && "opacity-0"
              )} />
              <span className={cn(
                "w-full h-px bg-black transition-all duration-300",
                isMenuOpen && "-rotate-45 -translate-y-1.5"
              )} />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={cn(
          "md:hidden transition-all duration-300 overflow-hidden",
          isMenuOpen ? "max-h-96 pb-8" : "max-h-0"
        )}>
          <nav className="flex flex-col space-y-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="nav-item"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link 
              to="/contact" 
              className="nav-item border-b border-black pb-px w-fit"
              onClick={() => setIsMenuOpen(false)}
            >
              GET UPDATES
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
