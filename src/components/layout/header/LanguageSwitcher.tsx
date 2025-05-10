
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface LanguageSwitcherProps {
  isMobile?: boolean;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ isMobile = false }) => {
  const { language, setLanguage } = useLanguage();

  const handleLanguageChange = (newLanguage: 'en' | 'zh') => {
    setLanguage(newLanguage);
  };

  if (isMobile) {
    return (
      <div className="flex items-center space-x-1 rounded-md overflow-hidden border border-[#E0E0E0]">
        <button
          onClick={() => handleLanguageChange('en')}
          className={cn(
            "px-2 py-1 text-xs transition-all",
            language === 'en' 
              ? "bg-[#333333] text-white font-medium" 
              : "bg-transparent text-[#666666] hover:bg-[#F1F1F1]"
          )}
          aria-label="Switch to English"
        >
          ENG
        </button>
        <button
          onClick={() => handleLanguageChange('zh')}
          className={cn(
            "px-2 py-1 text-xs transition-all",
            language === 'zh' 
              ? "bg-[#333333] text-white font-medium" 
              : "bg-transparent text-[#666666] hover:bg-[#F1F1F1]"
          )}
          aria-label="切换到中文"
        >
          日本語
        </button>
      </div>
    );
  }

  return (
    <div className="hidden lg:flex items-center rounded-md overflow-hidden border border-[#E0E0E0]">
      <button
        onClick={() => handleLanguageChange('en')}
        className={cn(
          "px-3 py-1 text-xs transition-all",
          language === 'en' 
            ? "bg-[#333333] text-white font-medium" 
            : "bg-transparent text-[#666666] hover:bg-[#F1F1F1]"
        )}
        aria-label="Switch to English"
      >
        ENG
      </button>
      <button
        onClick={() => handleLanguageChange('zh')}
        className={cn(
          "px-3 py-1 text-xs transition-all",
          language === 'zh' 
            ? "bg-[#333333] text-white font-medium" 
            : "bg-transparent text-[#666666] hover:bg-[#F1F1F1]"
        )}
        aria-label="切换到中文"
      >
        日本語
      </button>
    </div>
  );
};

export default LanguageSwitcher;
