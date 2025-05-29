import React, { memo, useMemo } from 'react';
import { format } from 'date-fns';
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye, 
  FileText
} from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MultilingualArticle } from '@/types/multilingual-article.types';

interface MultilingualArticleTableProps {
  articles: MultilingualArticle[];
  loading: boolean;
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
}: {
  article: MultilingualArticle;
  onEdit: (id: string) => void;
  onView: (slug: string) => void;
  onDelete: (id: string) => void;
  onTogglePublish: (id: string, isPublished: boolean) => void;
}) => {
  const isPublished = useMemo(() => 
    new Date(article.published_at) <= new Date(), 
    [article.published_at]
  );

  const formattedDate = useMemo(() => 
    format(new Date(article.published_at), 'MMM dd, yyyy'),
    [article.published_at]
  );

  // Smart title display with fallback
  const displayTitle = useMemo(() => {
    if (article.title_en && article.title_en.trim()) {
      return article.title_en;
    } else if (article.title_zh && article.title_zh.trim()) {
      return article.title_zh;
    } else {
      return 'Untitled Article';
    }
  }, [article.title_en, article.title_zh]);

  // Smart category display with fallback
  const displayCategory = useMemo(() => {
    if (article.category_en && article.category_en.trim()) {
      return article.category_en;
    } else if (article.category_zh && article.category_zh.trim()) {
      return article.category_zh;
    } else {
      return 'Uncategorized';
    }
  }, [article.category_en, article.category_zh]);

  // Smart author display with fallback
  const displayAuthor = useMemo(() => {
    if (article.author_name_en && article.author_name_en.trim()) {
      return article.author_name_en;
    } else if (article.author_name_zh && article.author_name_zh.trim()) {
      return article.author_name_zh;
    } else {
      return '-';
    }
  }, [article.author_name_en, article.author_name_zh]);

  // Language availability indicators
  const hasEnglishContent = useMemo(() => 
    article.title_en && article.title_en.trim() && article.content_en,
    [article.title_en, article.content_en]
  );

  const hasChineseContent = useMemo(() => 
    article.title_zh && article.title_zh.trim() && article.content_zh,
    [article.title_zh, article.content_zh]
  );

  return (
    <TableRow className="hover:bg-gray-50">
      <TableCell className="font-medium max-w-[300px]">
        <div className="flex flex-col gap-1">
          <div className="truncate">{displayTitle}</div>
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

const LoadingSkeleton = memo(() => (
  <div className="p-6 space-y-4">
    <div className="flex items-center space-x-4 mb-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
    {[...Array(4)].map((_, i) => (
      <div key={i} className="space-y-2">
        <Skeleton className="h-10 w-full" />
      </div>
    ))}
  </div>
));

LoadingSkeleton.displayName = 'LoadingSkeleton';

const EmptyState = memo(() => (
  <div className="text-center py-16">
    <FileText className="mx-auto h-12 w-12 text-gray-300" />
    <h3 className="mt-2 text-lg font-medium">No articles found</h3>
    <p className="mt-1 text-gray-500">Create a new article to get started or adjust your search</p>
  </div>
));

EmptyState.displayName = 'EmptyState';

const MultilingualArticleTable: React.FC<MultilingualArticleTableProps> = memo(({ 
  articles, 
  loading,
  onEdit,
  onView, 
  onDelete,
  onTogglePublish
}) => {
  if (loading) {
    return <LoadingSkeleton />;
  }

  if (articles.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Published Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {articles.map((article) => (
            <MultilingualArticleTableRow
              key={article.id}
              article={article}
              onEdit={onEdit}
              onView={onView}
              onDelete={onDelete}
              onTogglePublish={onTogglePublish}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
});

MultilingualArticleTable.displayName = 'MultilingualArticleTable';

export default MultilingualArticleTable;
