
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import LoginButton from './LoginButton';

interface MobileMenuProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  navLinks: Array<{ name: string; path: string }>;
  isActive: (path: string) => boolean;
  handleNavLinkClick: (e: React.MouseEvent, isActivePath: boolean) => void;
  handleLoginClick: (e: React.MouseEvent) => void;
  isLoginActive?: boolean;
}

const MobileMenu = ({ 
  isMenuOpen, 
  setIsMenuOpen, 
  navLinks, 
  isActive, 
  handleNavLinkClick, 
  handleLoginClick,
  isLoginActive = false
}: MobileMenuProps) => {
  return (
    <>
      {/* Mobile menu toggle */}
      <button
        className="lg:hidden ml-4 p-2"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle menu"
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile login button in menu */}
      {isMenuOpen && (
        <div className="absolute top-16 right-6">
          <LoginButton 
            handleLoginClick={handleLoginClick} 
            isMobile={true}
            isActive={isLoginActive}
          />
        </div>
      )}
    </>
  );
};

export default MobileMenu;
