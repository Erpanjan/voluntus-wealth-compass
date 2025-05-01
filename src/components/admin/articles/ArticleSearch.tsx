
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface ArticleSearchProps {
  value: string;
  onChange: (value: string) => void;
}

const ArticleSearch: React.FC<ArticleSearchProps> = ({ value, onChange }) => {
  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
      <Input
        placeholder="Search by title, content, or author..."
        className="pl-9 w-full bg-gray-50 border-gray-200 h-11"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="mt-1 text-xs text-gray-500">
        Search across titles, content, and author names
      </div>
    </div>
  );
};

export default ArticleSearch;
