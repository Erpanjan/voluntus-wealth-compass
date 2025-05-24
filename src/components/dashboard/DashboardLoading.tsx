
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const DashboardLoading: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-8 max-w-md w-full animate-fade-in">
        <Skeleton className="h-8 w-40 mb-4" />
        <Skeleton className="h-4 w-64 mb-8" />
        <Skeleton className="h-64 w-full mb-6 rounded-lg" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  );
};

export default DashboardLoading;
