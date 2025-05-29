
import React from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, User, Tag } from 'lucide-react';
import { Article } from '@/types/multilingual-article.types';

interface ArticleDetailHeaderProps {
  article: Article;
}

const ArticleDetailHeader: React.FC<ArticleDetailHeaderProps> = ({ article }) => {
  return (
    <header className="mb-8">
      {/* Back Navigation */}
      <Button 
        onClick={() => window.history.back()} 
        variant="ghost" 
        className="mb-6 p-0 h-auto text-gray-600 hover:text-gray-900 font-normal"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Articles
      </Button>
      
      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight font-poppins">
        {article.title}
      </h1>
      
      {/* Metadata with Category, Date, and Author */}
      <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-4">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>{format(new Date(article.published_at), 'MMMM dd, yyyy')}</span>
        </div>
        {article.author_name && (
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>By {article.author_name}</span>
          </div>
        )}
        {article.category && (
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
              {article.category}
            </span>
          </div>
        )}
      </div>
      
      {/* Description */}
      {article.description && (
        <p className="text-lg text-gray-700 leading-relaxed max-w-3xl">
          {article.description}
        </p>
      )}
    </header>
  );
};

export default ArticleDetailHeader;
