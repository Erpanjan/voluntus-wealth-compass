
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ArticleGridProps {
  articles: any[];
  onEdit: (id: string) => void;
  onTogglePublish: (id: string) => void;
  onDelete: (id: string) => void;
  isPublished: (article: any) => boolean;
  getDisplayTitle: (article: any) => string;
}

const ArticleGrid: React.FC<ArticleGridProps> = ({
  articles,
  onEdit,
  onTogglePublish,
  onDelete,
  isPublished,
  getDisplayTitle,
}) => {
  return (
    <div className="grid gap-4">
      {articles.map((article) => (
        <Card key={article.id} className="p-6 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {getDisplayTitle(article)}
              </h3>
              <Badge variant={isPublished(article) ? "default" : "secondary"}>
                {isPublished(article) ? "Published" : "Draft"}
              </Badge>
            </div>
            
            <div className="flex space-x-2 ml-4 flex-shrink-0">
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
