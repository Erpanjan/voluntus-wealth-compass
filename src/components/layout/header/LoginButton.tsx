
import { useNavigate } from 'react-router-dom';

interface LoginButtonProps {
  handleLoginClick: (e: React.MouseEvent) => void;
  isMobile?: boolean;
}

const LoginButton = ({ handleLoginClick, isMobile = false }: LoginButtonProps) => {
  if (isMobile) {
    return (
      <button 
        onClick={handleLoginClick}
        className="text-[#666666] hover:text-[#333333] text-xs border border-[#666666] hover:border-[#333333] rounded-full px-4 py-1 transition-all duration-300 ease-in-out hover:bg-black/5"
        aria-label="Login to client portal"
      >
        LOGIN
      </button>
    );
  }

  return (
    <button 
      onClick={handleLoginClick} 
      className="hidden lg:block text-[#666666] hover:text-[#333333] text-xs tracking-wide border border-[#666666] hover:border-[#333333] rounded-full px-4 py-1 transition-all duration-300 ease-in-out hover:bg-black/5"
      aria-label="Login to client portal"
    >
      LOGIN
    </button>
  );
};

export default LoginButton;
