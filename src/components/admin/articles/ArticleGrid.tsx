
import React from 'react';
import { Filter } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ArticleGridProps {
  articles: any[];
  onEdit: (id: string) => void;
  onTogglePublish: (id: string) => void;
  onDelete: (id: string) => void;
  isPublished: (article: any) => boolean;
  getLanguageBadges: (article: any) => string[];
}

const ArticleGrid: React.FC<ArticleGridProps> = ({
  articles,
  onEdit,
  onTogglePublish,
  onDelete,
  isPublished,
  getLanguageBadges,
}) => {
  return (
    <div className="grid gap-4">
      {articles.map((article) => (
        <Card key={article.id} className="p-6 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                  {article.title || 'Untitled'}
                </h3>
                <div className="flex gap-1">
                  {getLanguageBadges(article).map((lang) => (
                    <Badge key={lang} variant="secondary" className="text-xs">
                      {lang}
                    </Badge>
                  ))}
                </div>
                <Badge variant={isPublished(article) ? "default" : "secondary"}>
                  {isPublished(article) ? "Published" : "Draft"}
                </Badge>
              </div>
              
              {article.description && (
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {article.description}
                </p>
              )}
              
              <div className="flex items-center text-xs text-gray-500 space-x-4">
                {article.category && (
                  <span className="flex items-center">
                    <Filter className="mr-1 h-3 w-3" />
                    {article.category}
                  </span>
                )}
                {article.author_name && <span>By {article.author_name}</span>}
                <span>
                  {isPublished(article) 
                    ? `Published ${new Date(article.published_at).toLocaleDateString()}`
                    : `Updated ${new Date(article.updated_at).toLocaleDateString()}`
                  }
                </span>
              </div>
            </div>
            
            <div className="flex space-x-2 ml-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(article.id)}
              >
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onTogglePublish(article.id)}
              >
                {isPublished(article) ? 'Unpublish' : 'Publish'}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(article.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ArticleGrid;
