
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface NavLink {
  name: string;
  path: string;
}

interface NavLinksProps {
  links: NavLink[];
  onLinkClick: (e: React.MouseEvent<HTMLAnchorElement>, isActive: boolean) => void;
}

export const NavLinks: React.FC<NavLinksProps> = ({ links, onLinkClick }) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      {links.map((link) => (
        <Link
          key={link.name}
          to={link.path}
          onClick={(e) => onLinkClick(e, isActive(link.path))}
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
    </>
  );
};

export default NavLinks;
