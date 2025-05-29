
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
        <h3 className="text-lg font-semibold text-gray-800">Article Language</h3>
        <div className="flex gap-2">
          {hasContent.en && (
            <Badge variant="secondary" className="text-xs">
              EN Content
            </Badge>
          )}
          {hasContent.zh && (
            <Badge variant="secondary" className="text-xs">
              中文 Content
            </Badge>
          )}
        </div>
      </div>
      
      <Tabs value={selectedLanguage} onValueChange={(value) => onLanguageChange(value as Language)}>
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="en">
            English
          </TabsTrigger>
          <TabsTrigger value="zh">
            中文
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default LanguageSelector;
