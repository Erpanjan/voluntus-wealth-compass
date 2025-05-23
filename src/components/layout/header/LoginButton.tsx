
import { useNavigate } from 'react-router-dom';

interface LoginButtonProps {
  handleLoginClick: (e: React.MouseEvent) => void;
  isMobile?: boolean;
  isActive?: boolean;
}

const LoginButton = ({ handleLoginClick, isMobile = false, isActive = false }: LoginButtonProps) => {
  if (isMobile) {
    return (
      <button 
        onClick={handleLoginClick}
        className={`text-sm border rounded-full px-5 py-2 transition-all duration-300 ease-in-out touch-manipulation ${
          isActive 
            ? 'text-[#333333] border-[#333333] bg-[#333333] text-white' 
            : 'text-[#666666] hover:text-[#333333] border-[#666666] hover:border-[#333333] hover:bg-black/5'
        }`}
        aria-label="Login to client portal"
      >
        LOGIN
      </button>
    );
  }

  return (
    <button 
      onClick={handleLoginClick} 
      className={`hidden lg:block text-xs tracking-wide border rounded-full px-4 py-1 transition-all duration-300 ease-in-out ${
        isActive 
          ? 'text-white border-[#333333] bg-[#333333]' 
          : 'text-[#666666] hover:text-[#333333] border-[#666666] hover:border-[#333333] hover:bg-black/5'
      }`}
      aria-label="Login to client portal"
    >
      LOGIN
    </button>
  );
};

export default LoginButton;
