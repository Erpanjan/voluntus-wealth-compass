
import React, { memo, useMemo } from 'react';
import { format } from 'date-fns';
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye
} from 'lucide-react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MultilingualArticle } from '@/types/multilingual-article.types';

interface MultilingualArticleTableRowProps {
  article: MultilingualArticle;
  onEdit: (id: string) => void;
  onView: (slug: string) => void;
  onDelete: (id: string) => void;
  onTogglePublish: (id: string, isPublished: boolean) => void;
}

const MultilingualArticleTableRow = memo(({ 
  article, 
  onEdit, 
  onView, 
  onDelete, 
  onTogglePublish 
}: MultilingualArticleTableRowProps) => {
  // Debug logging for each article row
  console.log(`🔍 [ROW DEBUG] Rendering article row:`, {
    id: article.id,
    title_en: article.title_en,
    title_zh: article.title_zh,
    slug: article.slug
  });

  const isPublished = useMemo(() => 
    new Date(article.published_at) <= new Date(), 
    [article.published_at]
  );

  const formattedDate = useMemo(() => 
    format(new Date(article.published_at), 'MMM dd, yyyy'),
    [article.published_at]
  );

  // Enhanced title display with better fallback handling and debugging
  const displayTitle = useMemo(() => {
    console.log(`🏷️ [TITLE DEBUG] Processing title for article ${article.id}:`, {
      title_en: article.title_en,
      title_zh: article.title_zh,
      has_en: !!(article.title_en && article.title_en.trim()),
      has_zh: !!(article.title_zh && article.title_zh.trim())
    });

    // Prioritize English, fallback to Chinese, then default
    if (article.title_en && article.title_en.trim()) {
      console.log(`✅ [TITLE] Using English title: ${article.title_en}`);
      return article.title_en;
    } else if (article.title_zh && article.title_zh.trim()) {
      console.log(`✅ [TITLE] Using Chinese title: ${article.title_zh}`);
      return article.title_zh;
    } else {
      console.log(`⚠️ [TITLE] No title found, using default`);
      return 'Untitled Article';
    }
  }, [article.title_en, article.title_zh, article.id]);

  // Enhanced category display with debugging
  const displayCategory = useMemo(() => {
    if (article.category_en && article.category_en.trim()) {
      return article.category_en;
    } else if (article.category_zh && article.category_zh.trim()) {
      return article.category_zh;
    } else {
      return 'Uncategorized';
    }
  }, [article.category_en, article.category_zh]);

  // Enhanced author display with debugging
  const displayAuthor = useMemo(() => {
    if (article.author_name_en && article.author_name_en.trim()) {
      return article.author_name_en;
    } else if (article.author_name_zh && article.author_name_zh.trim()) {
      return article.author_name_zh;
    } else {
      return 'Unknown Author';
    }
  }, [article.author_name_en, article.author_name_zh]);

  // Enhanced language availability indicators with debugging
  const hasEnglishContent = useMemo(() => {
    const hasTitle = article.title_en && article.title_en.trim();
    const hasContent = article.content_en && typeof article.content_en === 'object' && Object.keys(article.content_en).length > 0;
    const result = Boolean(hasTitle && hasContent);
    
    console.log(`🔍 [EN CONTENT] Article ${article.id} English content check:`, {
      hasTitle: !!hasTitle,
      hasContent: !!hasContent,
      result
    });
    
    return result;
  }, [article.title_en, article.content_en, article.id]);

  const hasChineseContent = useMemo(() => {
    const hasTitle = article.title_zh && article.title_zh.trim();
    const hasContent = article.content_zh && typeof article.content_zh === 'object' && Object.keys(article.content_zh).length > 0;
    const result = Boolean(hasTitle && hasContent);
    
    console.log(`🔍 [ZH CONTENT] Article ${article.id} Chinese content check:`, {
      hasTitle: !!hasTitle,
      hasContent: !!hasContent,
      result
    });
    
    return result;
  }, [article.title_zh, article.content_zh, article.id]);

  return (
    <TableRow className="hover:bg-gray-50">
      <TableCell className="font-medium max-w-[300px]">
        <div className="flex flex-col gap-1">
          <div className="truncate" title={displayTitle}>{displayTitle}</div>
          <div className="flex gap-1">
            {hasEnglishContent && (
              <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700">
                EN
              </Badge>
            )}
            {hasChineseContent && (
              <Badge variant="secondary" className="text-xs bg-green-50 text-green-700">
                中文
              </Badge>
            )}
            {!hasEnglishContent && !hasChineseContent && (
              <Badge variant="secondary" className="text-xs bg-yellow-50 text-yellow-700">
                No Content
              </Badge>
            )}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="outline" className="bg-gray-50">
          {displayCategory}
        </Badge>
      </TableCell>
      <TableCell>
        {displayAuthor}
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          <Switch 
            checked={isPublished}
            onCheckedChange={() => onTogglePublish(article.id, isPublished)}
          />
          <span className="text-sm text-gray-700">
            {isPublished ? 'Published' : 'Draft'}
          </span>
        </div>
      </TableCell>
      <TableCell>
        {formattedDate}
      </TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="hover:bg-gray-100">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            <DropdownMenuItem onClick={() => onEdit(article.id)} className="cursor-pointer">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onView(article.slug)} className="cursor-pointer">
              <Eye className="mr-2 h-4 w-4" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(article.id)} 
              className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
});

MultilingualArticleTableRow.displayName = 'MultilingualArticleTableRow';

export default MultilingualArticleTableRow;
