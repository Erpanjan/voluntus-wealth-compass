
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useScrollState } from '@/hooks/useScrollState';
import { useNavigationState } from '@/hooks/useNavigationState';
import { useTransitionState } from '@/hooks/useTransitionState';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useLanguage();
  
  const scrolled = useScrollState();
  const { isActive, handleNavLinkClick } = useNavigationState();
  const { isOnLoginPage, isTransitioning, handleLoginClick } = useTransitionState();
  
  const shouldHide = isOnLoginPage || isTransitioning;
  
  const navLinks = [
    { href: '/services', label: 'SERVICES' },
    { href: '/insight', label: 'INSIGHTS' },
    { href: '/about', label: 'ABOUT' },
    { href: '/contact', label: 'CONTACT' },
  ];
  
  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      scrolled ? 'bg-white/95 backdrop-blur-sm border-b border-gray-100' : 'bg-transparent',
      shouldHide && 'opacity-0 pointer-events-none'
    )}>
      <div className="container-custom">
        <div className="flex items-center justify-between py-6 md:py-8">
          {/* Logo */}
          <Link 
            to="/" 
            className="text-xl md:text-2xl font-light tracking-wider text-black hover:text-gray-600 transition-colors duration-200"
            onClick={() => setIsMenuOpen(false)}
          >
            VOLUNTAS
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-12">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="minimal-nav hover:text-gray-600 transition-colors duration-200"
                onClick={(e) => handleNavLinkClick(e, isActive(link.href))}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Get Updates CTA */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link
              to="/contact"
              className="text-xs uppercase tracking-widest font-light text-black hover:text-gray-600 border-b border-transparent hover:border-black transition-all duration-200 pb-1"
            >
              GET UPDATES
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu */}
        <div className={cn(
          'lg:hidden overflow-hidden transition-all duration-300',
          isMenuOpen ? 'max-h-96 pb-8' : 'max-h-0'
        )}>
          <nav className="flex flex-col space-y-6 pt-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="minimal-nav hover:text-gray-600 transition-colors duration-200"
                onClick={() => {
                  setIsMenuOpen(false);
                  handleNavLinkClick(null, isActive(link.href));
                }}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/contact"
              className="text-xs uppercase tracking-widest font-light text-black hover:text-gray-600 border-b border-transparent hover:border-black transition-all duration-200 pb-1 self-start"
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
