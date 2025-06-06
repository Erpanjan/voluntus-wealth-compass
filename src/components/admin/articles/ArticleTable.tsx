
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

interface ArticleTableProps {
  articles: any[];
  loading: boolean;
  onEdit: (id: string) => void;
  onView: (slug: string) => void;
  onDelete: (id: string) => void;
  onTogglePublish: (id: string, isPublished: boolean) => void;
}

const ArticleTableRow = memo(({ 
  article, 
  onEdit, 
  onView, 
  onDelete, 
  onTogglePublish 
}: {
  article: any;
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

  return (
    <TableRow className="hover:bg-gray-50">
      <TableCell className="font-medium max-w-[300px] truncate">
        {article.title}
      </TableCell>
      <TableCell>
        <Badge variant="outline" className="bg-gray-50">
          {article.category || 'Uncategorized'}
        </Badge>
      </TableCell>
      <TableCell>
        {article.author_name || '-'}
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

ArticleTableRow.displayName = 'ArticleTableRow';

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

const ArticleTable: React.FC<ArticleTableProps> = memo(({ 
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
            <ArticleTableRow
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

ArticleTable.displayName = 'ArticleTable';

export default ArticleTable;
