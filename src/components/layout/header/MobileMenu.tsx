
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

      {/* Mobile navigation menu with login button at bottom */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white shadow-lg border-t">
          <div className="container-custom py-4">
            {/* Navigation Links */}
            <nav className="flex flex-col space-y-4 mb-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={(e) => handleNavLinkClick(e, isActive(link.path))}
                  className={`py-3 text-base transition-all duration-300 flex items-center ${
                    isActive(link.path) 
                      ? 'font-semibold text-[#333333] pl-4' 
                      : 'font-normal text-[#666666] hover:text-[#333333] pl-4'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
            
            {/* Login Button at Bottom */}
            <div className="pl-4 pt-4 border-t border-gray-100">
              <LoginButton 
                handleLoginClick={handleLoginClick} 
                isMobile={true}
                isActive={isLoginActive}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileMenu;
