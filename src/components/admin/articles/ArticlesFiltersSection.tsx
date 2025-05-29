
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ArticlesFiltersSectionProps {
  selectedLanguage: 'all' | 'en' | 'zh';
  onLanguageChange: (value: 'all' | 'en' | 'zh') => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const ArticlesFiltersSection: React.FC<ArticlesFiltersSectionProps> = ({
  selectedLanguage,
  onLanguageChange,
  searchTerm,
  onSearchChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <Tabs value={selectedLanguage} onValueChange={onLanguageChange}>
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="all">All Languages</TabsTrigger>
          <TabsTrigger value="en">English</TabsTrigger>
          <TabsTrigger value="zh">中文</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="relative w-full sm:w-auto">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search articles..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 w-full sm:w-80"
        />
      </div>
    </div>
  );
};

export default ArticlesFiltersSection;
