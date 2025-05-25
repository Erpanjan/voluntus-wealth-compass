
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import OptimizedImage from '@/components/optimized/OptimizedImage';

interface ArticleCardProps {
  id: string;
  title: string;
  date: string;
  description: string;
  category: string;
  authors: string[];
  image?: string;
  priority?: boolean;
}

const ArticleCard: React.FC<ArticleCardProps> = ({
  id,
  title,
  date,
  description,
  category,
  authors,
  image,
  priority = false
}) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <Link to={`/insight/${id}`} className="block">
        {image && (
          <div className="aspect-video overflow-hidden">
            <OptimizedImage
              src={image}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              priority={priority}
            />
          </div>
        )}
        
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="secondary" className="text-xs">
              {category}
            </Badge>
            <span className="text-xs text-gray-500">{date}</span>
          </div>
          
          <h3 className="text-xl font-semibold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          
          <p className="text-gray-600 text-sm line-clamp-3 mb-4">
            {description}
          </p>
          
          {authors.length > 0 && (
            <div className="text-xs text-gray-500">
              By {authors.join(', ')}
            </div>
          )}
        </CardContent>
      </Link>
    </Card>
  );
};

export default React.memo(ArticleCard);
