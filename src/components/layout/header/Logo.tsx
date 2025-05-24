
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
            src="/lovable-uploads/c80b8a97-ccf7-402a-9a20-a24c58c2c5f4.png" 
            alt="VOLUNTAS LONG-TERM CAPITAL Logo" 
            className="h-16 w-auto" 
            width="200"
            height="64"
            loading="eager"
            fetchPriority="high"
          />
        </div>
      ) : (
        // Horizontal logo for desktop
        <div className="flex items-center">
          <img 
            src="/lovable-uploads/c80b8a97-ccf7-402a-9a20-a24c58c2c5f4.png" 
            alt="VOLUNTAS LONG-TERM CAPITAL Logo" 
            className="h-16 w-auto" 
            width="200"
            height="64"
            loading="eager"
            fetchPriority="high"
          />
        </div>
      )}
    </Link>
  );
};

export default Logo;
