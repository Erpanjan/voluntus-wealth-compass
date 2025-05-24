
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
            src="/lovable-uploads/f649620c-7104-40f6-b1f7-5035f2f614b8.png" 
            alt="VOLUNTAS LONG-TERM CAPITAL Logo" 
            className="h-14 w-auto" 
            width="200"
            height="56"
            loading="eager"
            fetchPriority="high"
          />
        </div>
      ) : (
        // Horizontal logo for desktop
        <div className="flex items-center">
          <img 
            src="/lovable-uploads/f649620c-7104-40f6-b1f7-5035f2f614b8.png" 
            alt="VOLUNTAS LONG-TERM CAPITAL Logo" 
            className="h-14 w-auto" 
            width="200"
            height="56"
            loading="eager"
            fetchPriority="high"
          />
        </div>
      )}
    </Link>
  );
};

export default Logo;
