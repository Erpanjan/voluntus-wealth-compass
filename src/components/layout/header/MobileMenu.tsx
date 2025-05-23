
import { Menu, X } from 'lucide-react';

interface MobileMenuProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
}

const MobileMenu = ({ 
  isMenuOpen, 
  setIsMenuOpen
}: MobileMenuProps) => {
  return (
    <>
      {/* Mobile menu toggle */}
      <button
        className="lg:hidden ml-4 p-2 touch-manipulation"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle menu"
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
    </>
  );
};

export default MobileMenu;
