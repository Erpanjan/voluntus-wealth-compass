
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const ArticleDetailLoading: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Loading Header */}
        <div className="mb-8">
          <Skeleton className="h-6 w-24 mb-6" />
          <Skeleton className="h-12 w-3/4 mb-6" />
          <div className="flex items-center gap-6 mb-6">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
        
        {/* Loading Image */}
        <Skeleton className="h-80 w-full mb-8 rounded-lg" />
        
        {/* Loading Content */}
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </div>
  );
};

export default ArticleDetailLoading;
