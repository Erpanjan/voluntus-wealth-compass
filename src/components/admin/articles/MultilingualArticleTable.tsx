
import React, { memo } from 'react';
import { 
  Table, 
  TableBody, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { MultilingualArticle } from '@/types/article.types';
import SimpleArticleTableRow from './SimpleArticleTableRow';
import TableLoadingSkeleton from './table/TableLoadingSkeleton';
import TableEmptyState from './table/TableEmptyState';

interface MultilingualArticleTableProps {
  articles: MultilingualArticle[];
  loading: boolean;
  onEdit: (id: string) => void;
  onView: (slug: string) => void;
  onDelete: (id: string) => void;
  onTogglePublish: (id: string, isPublished: boolean) => void;
}

const MultilingualArticleTable: React.FC<MultilingualArticleTableProps> = memo(({ 
  articles, 
  loading,
  onEdit,
  onView, 
  onDelete,
  onTogglePublish
}) => {
  if (loading) {
    return <TableLoadingSkeleton />;
  }

  if (articles.length === 0) {
    return <TableEmptyState />;
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
            <SimpleArticleTableRow
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
