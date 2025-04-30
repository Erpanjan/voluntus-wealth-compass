
import React from 'react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface ArticleCardProps {
  id: string;
  title: string;
  date: string;
  description: string;
  category?: string;
  authors?: string[];
  image?: string;
  className?: string;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ 
  id,
  title, 
  date, 
  description, 
  category,
  authors,
  image,
  className 
}) => {
  return (
    <Link 
      to={`/insight/${id}`}
      className={cn(
        "block bg-white rounded-xl overflow-hidden transition-all duration-300 group hover:shadow-md",
        className
      )}
    >
      <article className="flex flex-col h-full">
        {image && (
          <div className="relative w-full h-48 overflow-hidden">
            <img 
              src={image} 
              alt={title} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        )}
        <div className="p-6 flex-1 flex flex-col">
          {category && (
            <span className="text-xs font-semibold uppercase tracking-wider text-voluntus-text-tertiary mb-2">
              {category}
            </span>
          )}
          <h3 className="text-lg font-semibold mb-2 group-hover:text-voluntus-blue transition-colors">{title}</h3>
          <p className="text-sm text-voluntus-text-secondary mb-4">{date}</p>
          <p className="text-voluntus-text-secondary text-sm line-clamp-3 mb-4">{description}</p>
          {authors && authors.length > 0 && (
            <p className="mt-auto text-xs text-voluntus-text-tertiary">
              By {authors.join(', ')}
            </p>
          )}
        </div>
      </article>
    </Link>
  );
};

export default ArticleCard;
