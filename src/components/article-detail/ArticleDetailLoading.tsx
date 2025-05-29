
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const ArticleDetailLoading: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Navigation Loading - positioned below fixed header */}
        <div className="pt-28 pb-8">
          <Skeleton className="h-6 w-32" />
        </div>
        
        {/* Image Loading */}
        <div className="mb-12">
          <Skeleton className="h-96 md:h-[32rem] w-full rounded-2xl" />
        </div>
        
        {/* Header Loading */}
        <div className="mb-12 space-y-6">
          <Skeleton className="h-16 w-4/5" />
          <div className="flex items-center gap-6">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="pt-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-3/4 mt-2" />
          </div>
        </div>
        
        {/* Content Loading */}
        <div className="space-y-6">
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
