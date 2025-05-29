
import React, { memo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const TableLoadingSkeleton = memo(() => (
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

TableLoadingSkeleton.displayName = 'TableLoadingSkeleton';

export default TableLoadingSkeleton;
