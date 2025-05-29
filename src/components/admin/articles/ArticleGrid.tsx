
import React from 'react';
import { Edit, Trash2, Eye, EyeOff } from 'lucide-react';
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
    <div className="grid gap-3">
      {articles.map((article) => (
        <Card key={article.id} className="p-4 border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-sm bg-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <h3 className="text-base font-medium text-gray-900 truncate">
                {getDisplayTitle(article)}
              </h3>
              <Badge 
                variant={isPublished(article) ? "default" : "secondary"}
                className={`text-xs px-2 py-1 ${
                  isPublished(article) 
                    ? "bg-green-50 text-green-700 border-green-200" 
                    : "bg-gray-50 text-gray-600 border-gray-200"
                }`}
              >
                {isPublished(article) ? "Published" : "Draft"}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2 ml-4 flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(article.id)}
                className="h-8 px-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onTogglePublish(article.id)}
                className={`h-8 px-3 ${
                  isPublished(article)
                    ? "text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                    : "text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                }`}
              >
                {isPublished(article) ? (
                  <>
                    <EyeOff className="h-4 w-4 mr-1" />
                    Unpublish
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-1" />
                    Publish
                  </>
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(article.id)}
                className="h-8 px-3 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-1" />
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
