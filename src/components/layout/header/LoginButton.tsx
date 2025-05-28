
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface LoginButtonProps {
  handleLoginClick: (e: React.MouseEvent) => void;
  isActive: boolean;
}

const LoginButton: React.FC<LoginButtonProps> = ({ handleLoginClick, isActive }) => {
  const { t } = useLanguage();

  return (
    <div className="hidden lg:flex items-center">
      <Button 
        asChild 
        variant="ghost" 
        size="sm"
        className={cn(
          'transition-colors duration-200 text-xs border border-gray-300 rounded-full',
          isActive ? 'text-black border-black' : 'text-gray-600 hover:text-black hover:border-black'
        )}
      >
        <Link to="/login" onClick={handleLoginClick}>
          {t('nav.login')}
        </Link>
      </Button>
    </div>
  );
};

export default LoginButton;
