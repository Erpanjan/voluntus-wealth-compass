
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  const handleLanguageToggle = () => {
    setLanguage(language === 'en' ? 'zh' : 'en');
  };

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className="text-xs text-gray-600 hover:text-black transition-colors duration-200"
      onClick={handleLanguageToggle}
    >
      中文
    </Button>
  );
};

export default LanguageSelector;
