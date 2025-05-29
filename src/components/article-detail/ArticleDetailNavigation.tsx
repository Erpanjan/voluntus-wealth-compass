
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const ArticleDetailNavigation: React.FC = () => {
  return (
    <Button 
      onClick={() => window.history.back()} 
      variant="ghost" 
      className="p-0 h-auto text-gray-600 hover:text-gray-900 font-normal"
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      Back to Articles
    </Button>
  );
};

export default ArticleDetailNavigation;
