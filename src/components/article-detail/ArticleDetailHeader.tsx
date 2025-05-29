
import React from 'react';
import { format } from 'date-fns';
import { Clock, User, Tag } from 'lucide-react';
import { Article } from '@/types/multilingual-article.types';

interface ArticleDetailHeaderProps {
  article: Article;
}

const ArticleDetailHeader: React.FC<ArticleDetailHeaderProps> = ({ article }) => {
  return (
    <header className="space-y-6">
      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight font-poppins">
        {article.title}
      </h1>
      
      {/* Metadata Row */}
      <div className="flex flex-wrap items-center gap-6 text-gray-600">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span className="text-sm">{format(new Date(article.published_at), 'MMMM dd, yyyy')}</span>
        </div>
        {article.author_name && (
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="text-sm">By {article.author_name}</span>
          </div>
        )}
        {article.category && (
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
              {article.category}
            </span>
          </div>
        )}
      </div>
      
      {/* Description/Summary */}
      {article.description && (
        <div className="pt-4 border-t border-gray-100">
          <p className="text-xl text-gray-700 leading-relaxed font-light">
            {article.description}
          </p>
        </div>
      )}
    </header>
  );
};

export default ArticleDetailHeader;
