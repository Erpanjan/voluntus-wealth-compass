
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ArticlesHeaderProps {
  onCreateArticle: () => void;
}

const ArticlesHeader: React.FC<ArticlesHeaderProps> = ({ onCreateArticle }) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Articles Management</h1>
      </div>
      <Button onClick={onCreateArticle} className="flex items-center">
        <Plus className="mr-2 h-4 w-4" />
        Create Article
      </Button>
    </div>
  );
};

export default ArticlesHeader;
