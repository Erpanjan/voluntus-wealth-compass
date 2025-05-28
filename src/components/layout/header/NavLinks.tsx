
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface NavLinksProps {
  navLinks: Array<{
    path: string;
    label: string;
    translationKey: string;
  }>;
  isActive: (path: string) => boolean;
  handleNavLinkClick: (e: React.MouseEvent, isActivePath: boolean) => void;
  handleLoginClick?: (e: React.MouseEvent) => void;
  isMobile?: boolean;
}

const NavLinks: React.FC<NavLinksProps> = ({ 
  navLinks, 
  isActive, 
  handleNavLinkClick, 
  handleLoginClick,
  isMobile = false 
}) => {
  const { t } = useLanguage();

  if (isMobile) {
    return (
      <div className="flex flex-col space-y-4 pt-4">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={cn(
              'text-lg font-medium py-2 transition-colors duration-200',
              isActive(link.path) 
                ? 'text-black border-b-2 border-black' 
                : 'text-gray-600 hover:text-black'
            )}
            onClick={(e) => handleNavLinkClick(e, isActive(link.path))}
          >
            {t(link.translationKey)}
          </Link>
        ))}
        
        {handleLoginClick && (
          <Link
            to="/login"
            className={cn(
              'text-lg font-medium py-2 transition-colors duration-200',
              isActive('/login') 
                ? 'text-black border-b-2 border-black' 
                : 'text-gray-600 hover:text-black'
            )}
            onClick={handleLoginClick}
          >
            {t('nav.login')}
          </Link>
        )}
      </div>
    );
  }

  return (
    <nav className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 space-x-8">
      {navLinks.map((link) => (
        <Link
          key={link.path}
          to={link.path}
          className={cn(
            'text-sm font-medium py-2 transition-colors duration-200 relative',
            isActive(link.path) 
              ? 'text-black' 
              : 'text-gray-600 hover:text-black'
          )}
          onClick={(e) => handleNavLinkClick(e, isActive(link.path))}
        >
          {t(link.translationKey)}
          {isActive(link.path) && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-black"></span>
          )}
        </Link>
      ))}
    </nav>
  );
};

export default NavLinks;
