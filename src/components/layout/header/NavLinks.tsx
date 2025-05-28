
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
              'text-lg py-2 transition-colors duration-200',
              isActive(link.path) 
                ? 'text-black font-bold' 
                : 'text-gray-600 hover:text-black font-light'
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
              'text-lg py-2 transition-colors duration-200',
              isActive('/login') 
                ? 'text-black font-bold' 
                : 'text-gray-600 hover:text-black font-light'
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
    <nav className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 items-center space-x-8 -mt-1">
      {navLinks.map((link) => (
        <Link
          key={link.path}
          to={link.path}
          className={cn(
            'text-sm transition-colors duration-200',
            isActive(link.path) 
              ? 'text-black font-bold' 
              : 'text-gray-600 hover:text-black font-light'
          )}
          onClick={(e) => handleNavLinkClick(e, isActive(link.path))}
        >
          {t(link.translationKey)}
        </Link>
      ))}
    </nav>
  );
};

export default NavLinks;
