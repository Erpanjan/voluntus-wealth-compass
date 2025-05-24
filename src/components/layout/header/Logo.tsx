
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
            src="/lovable-uploads/54da0e3b-7320-468f-96c6-2a19248598e4.png" 
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
            src="/lovable-uploads/54da0e3b-7320-468f-96c6-2a19248598e4.png" 
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
