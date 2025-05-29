
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface ArticlesFiltersSectionProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const ArticlesFiltersSection: React.FC<ArticlesFiltersSectionProps> = ({
  searchTerm,
  onSearchChange,
}) => {
  return (
    <div className="flex justify-end">
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
