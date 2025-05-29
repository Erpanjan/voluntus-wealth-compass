
import React, { memo } from 'react';
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
  priority?: boolean; // For above-the-fold images
}

const ArticleCard: React.FC<ArticleCardProps> = memo(({ 
  id,
  title, 
  date, 
  description, 
  category,
  authors,
  image,
  className,
  priority = false
}) => {
  // Properly encode the slug for URL navigation
  const encodedSlug = encodeURIComponent(id);
  const articleUrl = `/insight/${encodedSlug}`;

  console.log('🔗 [ArticleCard] Creating link:', { 
    originalId: id, 
    encodedSlug, 
    articleUrl,
    title: title.substring(0, 50) + '...'
  });

  return (
    <Link 
      to={articleUrl}
      className={cn(
        "block bg-white rounded-xl overflow-hidden transition-all duration-300 group",
        "border border-gray-200 shadow-sm hover:shadow-md",
        className
      )}
      onClick={() => {
        console.log('👆 [ArticleCard] Clicked article:', { id, title, articleUrl });
      }}
    >
      <article className="flex flex-col h-full">
        {image && (
          <div className="relative w-full h-48 overflow-hidden bg-gray-100">
            <img 
              src={image} 
              alt={title}
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
          {category && (
            <span className="text-xs font-semibold uppercase tracking-wider text-voluntus-text-tertiary mb-2">
              {category}
            </span>
          )}
          <h3 className="text-lg font-semibold mb-2 group-hover:text-voluntus-blue transition-colors line-clamp-2">
            {title}
          </h3>
          <p className="text-sm text-voluntus-text-secondary mb-4">{date}</p>
          <p className="text-voluntus-text-secondary text-sm line-clamp-3 mb-4 flex-1">
            {description}
          </p>
          {authors && authors.length > 0 && (
            <p className="mt-auto text-xs text-voluntus-text-tertiary">
              By {authors.join(', ')}
            </p>
          )}
        </div>
      </article>
    </Link>
  );
});

ArticleCard.displayName = 'ArticleCard';

export default ArticleCard;
