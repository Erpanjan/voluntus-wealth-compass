
import React, { memo } from 'react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { Article } from '@/services/article';

interface ArticleCardProps {
  article: Article;
  className?: string;
  priority?: boolean; // For above-the-fold images
}

const ArticleCard: React.FC<ArticleCardProps> = memo(({ 
  article,
  className,
  priority = false
}) => {
  // Format the date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Properly encode the slug for URL navigation
  const encodedSlug = encodeURIComponent(article.slug);

  return (
    <Link 
      to={`/insight/${encodedSlug}`}
      className={cn(
        "block bg-white rounded-xl overflow-hidden transition-all duration-300 group",
        "border border-gray-200 shadow-sm hover:shadow-md",
        className
      )}
    >
      <article className="flex flex-col h-full">
        {article.image_url && (
          <div className="relative w-full h-48 overflow-hidden bg-gray-100">
            <img 
              src={article.image_url} 
              alt={article.title}
              loading={priority ? "eager" : "lazy"}
              decoding="async"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                // Hide broken images gracefully
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          </div>
        )}
        <div className="p-6 flex-1 flex flex-col">
          {article.category && (
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
              {article.category}
            </span>
          )}
          <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
            {article.title}
          </h3>
          <p className="text-sm text-gray-600 mb-4">{formatDate(article.published_at)}</p>
          {article.description && (
            <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-1">
              {article.description}
            </p>
          )}
          {article.author_name && (
            <p className="mt-auto text-xs text-gray-500">
              By {article.author_name}
            </p>
          )}
        </div>
      </article>
    </Link>
  );
});

ArticleCard.displayName = 'ArticleCard';

export default ArticleCard;
