
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface ArticleSearchProps {
  value: string;
  onChange: (value: string) => void;
}

const ArticleSearch: React.FC<ArticleSearchProps> = ({ value, onChange }) => {
  return (
    <div className="relative w-full md:w-64">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
      <Input
        placeholder="Search articles..."
        className="pl-8 w-full bg-gray-50 border-gray-200"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default ArticleSearch;
