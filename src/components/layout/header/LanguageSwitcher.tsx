
import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface LanguageSwitcherProps {
  isMobile?: boolean;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ isMobile = false }) => {
  const { language, setLanguage, t } = useLanguage();

  const handleLanguageChange = (newLanguage: 'en' | 'zh') => {
    setLanguage(newLanguage);
  };

  if (isMobile) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            aria-label={t('language')}
            className="flex items-center space-x-1 py-2 px-3 rounded-full text-[#666666] hover:text-[#333333] hover:bg-black/5 transition-all duration-300 touch-manipulation"
          >
            <Globe size={18} className="mr-1" />
            <span className="text-sm font-medium">{language === 'en' ? 'EN' : '中'}</span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-36">
          <DropdownMenuItem
            className={language === 'en' ? 'font-medium text-black' : 'text-gray-600'}
            onClick={() => handleLanguageChange('en')}
          >
            {t('english')}
          </DropdownMenuItem>
          <DropdownMenuItem
            className={language === 'zh' ? 'font-medium text-black' : 'text-gray-600'}
            onClick={() => handleLanguageChange('zh')}
          >
            {t('chinese')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label={t('language')}
          className="hidden lg:flex items-center space-x-1 text-xs tracking-wide text-[#666666] hover:text-[#333333] px-3 py-1 rounded-full transition-all duration-300 hover:bg-black/5"
        >
          <Globe size={14} className="mr-1" />
          <span>{language === 'en' ? 'EN' : '中'}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        <DropdownMenuItem
          className={language === 'en' ? 'font-medium text-black' : 'text-gray-600'}
          onClick={() => handleLanguageChange('en')}
        >
          {t('english')}
        </DropdownMenuItem>
        <DropdownMenuItem
          className={language === 'zh' ? 'font-medium text-black' : 'text-gray-600'}
          onClick={() => handleLanguageChange('zh')}
        >
          {t('chinese')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
