
import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

interface LogoProps {
  handleNavLinkClick: () => void;
}

const Logo = ({ handleNavLinkClick }: LogoProps) => {
  const isMobile = useIsMobile();

  return (
    <Link to="/" className="flex items-center ml-[-20px]" onClick={handleNavLinkClick}>
      {isMobile ? (
        // Stacked logo for mobile
        <div className="flex flex-col items-center">
          <img 
            src="/lovable-uploads/e4b4f8b7-8d82-468f-b861-b6a593038f7c.png" 
            alt="Voluntus Logo" 
            className="h-16" 
          />
        </div>
      ) : (
        // Horizontal logo for desktop
        <div className="flex items-center">
          <img 
            src="/lovable-uploads/e4b4f8b7-8d82-468f-b861-b6a593038f7c.png" 
            alt="Voluntus Logo" 
            className="h-16" 
          />
        </div>
      )}
    </Link>
  );
};

export default Logo;
