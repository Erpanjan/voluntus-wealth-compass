
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface NavLinksProps {
  navLinks: { name: string; path: string }[];
  isActive: (path: string) => boolean;
  handleNavLinkClick: (event: React.MouseEvent, isActivePath: boolean) => void;
  isMobile?: boolean;
}

const NavLinks = ({ navLinks, isActive, handleNavLinkClick, isMobile = false }: NavLinksProps) => {
  const { t } = useLanguage();
  
  // Translate nav link names
  const getTranslatedLinkName = (name: string) => {
    const key = name.toLowerCase();
    return t(key, 'nav');
  };

  if (isMobile) {
    return (
      <nav className="flex flex-col space-y-4 py-3">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            onClick={(e) => handleNavLinkClick(e, isActive(link.path))}
            className={cn(
              'py-4 text-base transition-all duration-300 flex items-center',
              isActive(link.path) 
                ? 'font-semibold text-[#333333] pl-4' 
                : 'font-normal text-[#666666] hover:text-[#333333] pl-4'
            )}
          >
            {getTranslatedLinkName(link.name)}
          </Link>
        ))}
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
          {getTranslatedLinkName(link.name)}
        </Link>
      ))}
    </nav>
  );
};

export default NavLinks;
