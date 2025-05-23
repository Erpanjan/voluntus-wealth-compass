
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface NavLinksProps {
  navLinks: { name: string; path: string }[];
  isActive: (path: string) => boolean;
  handleNavLinkClick: (event: React.MouseEvent, isActivePath: boolean) => void;
  handleLoginClick?: (event: React.MouseEvent) => void;
  isMobile?: boolean;
}

const NavLinks = ({ 
  navLinks, 
  isActive, 
  handleNavLinkClick, 
  handleLoginClick,
  isMobile = false 
}: NavLinksProps) => {
  if (isMobile) {
    return (
      <nav className="flex flex-col space-y-2 py-4">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            onClick={(e) => handleNavLinkClick(e, isActive(link.path))}
            className={cn(
              'py-3 px-4 text-base transition-all duration-300 flex items-center touch-manipulation rounded-lg',
              isActive(link.path) 
                ? 'font-semibold text-[#333333] bg-black/5' 
                : 'font-normal text-[#666666] hover:text-[#333333] hover:bg-black/5'
            )}
          >
            {link.name}
          </Link>
        ))}
        
        {/* Mobile Login Button - integrated into nav list below CONTACT US */}
        {handleLoginClick && (
          <button
            onClick={handleLoginClick}
            className={cn(
              'py-3 px-4 text-base transition-all duration-300 flex items-center touch-manipulation text-left rounded-lg border border-[#666666] mt-4',
              isActive('/login') 
                ? 'font-semibold text-white bg-[#333333] border-[#333333]' 
                : 'font-normal text-[#666666] hover:text-[#333333] hover:bg-black/5 hover:border-[#333333]'
            )}
            aria-label="Login to client portal"
          >
            LOGIN
          </button>
        )}
      </nav>
    );
  }

  return (
    <nav className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 items-center">
      {navLinks.map((link) => (
        <Link
          key={link.name}
          to={link.path}
          onClick={(e) => handleNavLinkClick(e, isActive(link.path))}
          className={cn(
            "px-5 py-2 text-xs tracking-wide transition-all duration-300",
            isActive(link.path) 
              ? 'font-semibold text-[#333333]' 
              : 'font-normal text-[#666666] hover:text-[#333333]'
          )}
        >
          {link.name}
        </Link>
      ))}
    </nav>
  );
};

export default NavLinks;
