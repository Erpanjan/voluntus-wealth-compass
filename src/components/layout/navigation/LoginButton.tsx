
import React from 'react';

interface LoginButtonProps {
  onClick: (e: React.MouseEvent) => void;
  isMobile?: boolean;
}

export const LoginButton: React.FC<LoginButtonProps> = ({ onClick, isMobile = false }) => {
  return (
    <button 
      onClick={onClick} 
      className={`text-[#9F9EA1] hover:text-black text-xs tracking-wide border border-[#9F9EA1] hover:border-black rounded-full px-4 py-1 transition-all duration-300 ease-in-out hover:bg-black/5 ${
        isMobile ? '' : 'hidden lg:block'
      }`}
      aria-label="Login to client portal"
    >
      LOGIN
    </button>
  );
};

export default LoginButton;
