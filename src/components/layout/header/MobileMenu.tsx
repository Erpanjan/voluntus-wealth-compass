
import { Menu, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import NavLinks from './NavLinks';
import LoginButton from './LoginButton';

interface MobileMenuProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  navLinks: { name: string; path: string }[];
  isActive: (path: string) => boolean;
  handleNavLinkClick: (event: React.MouseEvent, isActivePath: boolean) => void;
  handleLoginClick: (e: React.MouseEvent) => void;
}

const MobileMenu = ({ 
  isMenuOpen, 
  setIsMenuOpen, 
  navLinks, 
  isActive, 
  handleNavLinkClick,
  handleLoginClick
}: MobileMenuProps) => {
  return (
    <div className="flex lg:hidden space-x-4 items-center">
      <LoginButton handleLoginClick={handleLoginClick} isMobile={true} />
      <Button 
        variant="ghost" 
        size="icon"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle Menu"
      >
        {isMenuOpen ? <X size={24} className="text-[#333333]" /> : <Menu size={24} className="text-[#333333]" />}
      </Button>

      {isMenuOpen && (
        <div className="container-custom lg:hidden pb-6 animate-fade-in absolute top-full left-0 right-0 bg-white z-50 shadow-sm">
          <NavLinks 
            navLinks={navLinks} 
            isActive={isActive} 
            handleNavLinkClick={handleNavLinkClick}
            isMobile={true}
          />
        </div>
      )}
    </div>
  );
};

export default MobileMenu;
