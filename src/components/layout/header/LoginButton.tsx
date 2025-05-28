
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSelector from '@/components/LanguageSelector';

interface LoginButtonProps {
  handleLoginClick: (e: React.MouseEvent) => void;
  isActive: boolean;
}

const LoginButton: React.FC<LoginButtonProps> = ({ handleLoginClick, isActive }) => {
  const { t } = useLanguage();

  return (
    <div className="hidden lg:flex items-center space-x-2">
      <LanguageSelector />
      <Button 
        asChild 
        variant="ghost" 
        size="sm"
        className={cn(
          'transition-colors duration-200',
          isActive ? 'text-black' : 'text-gray-600 hover:text-black'
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
