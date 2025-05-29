
import React, { memo } from 'react';
import { FileText } from 'lucide-react';

const TableEmptyState = memo(() => (
  <div className="text-center py-16">
    <FileText className="mx-auto h-12 w-12 text-gray-300" />
    <h3 className="mt-2 text-lg font-medium">No articles found</h3>
    <p className="mt-1 text-gray-500">Create a new article to get started or adjust your search</p>
  </div>
));

TableEmptyState.displayName = 'TableEmptyState';

export default TableEmptyState;
