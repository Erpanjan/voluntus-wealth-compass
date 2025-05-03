
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface NavLink {
  name: string;
  path: string;
}

interface MobileMenuProps {
  isOpen: boolean;
  links: NavLink[];
  onLinkClick: (e: React.MouseEvent<HTMLAnchorElement>, isActive: boolean) => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, links, onLinkClick }) => {
  const location = useLocation();
  
  if (!isOpen) return null;
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="container-custom lg:hidden pb-6 animate-fade-in">
      <nav className="flex flex-col space-y-4">
        {links.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            onClick={(e) => onLinkClick(e, isActive(link.path))}
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
  );
};

export default MobileMenu;
