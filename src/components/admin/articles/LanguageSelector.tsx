
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

type Language = 'en' | 'zh';

interface LanguageSelectorProps {
  selectedLanguage: Language;
  onLanguageChange: (language: Language) => void;
  hasContent?: {
    en: boolean;
    zh: boolean;
  };
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  onLanguageChange,
  hasContent = { en: false, zh: false }
}) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Language</h3>
        <div className="flex gap-2">
          {hasContent.en && (
            <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
              EN Content ✓
            </Badge>
          )}
          {hasContent.zh && (
            <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
              中文 Content ✓
            </Badge>
          )}
        </div>
      </div>
      
      <Tabs value={selectedLanguage} onValueChange={(value) => onLanguageChange(value as Language)}>
        <TabsList className="grid w-full grid-cols-2 max-w-md bg-gray-100 p-1 rounded-lg">
          <TabsTrigger 
            value="en"
            className="data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:font-bold data-[state=active]:shadow-sm text-gray-400 font-light transition-all duration-200 rounded-md px-4 py-2 relative"
          >
            English
            {hasContent.en && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></span>
            )}
          </TabsTrigger>
          <TabsTrigger 
            value="zh"
            className="data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:font-bold data-[state=active]:shadow-sm text-gray-400 font-light transition-all duration-200 rounded-md px-4 py-2 relative"
          >
            中文
            {hasContent.zh && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></span>
            )}
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default LanguageSelector;
