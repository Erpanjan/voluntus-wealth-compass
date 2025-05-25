
import { useQuery, UseQueryOptions, QueryKey } from '@tanstack/react-query';
import { useNetworkStatus } from './useNetworkStatus';

interface OptimizedQueryOptions<TData = unknown, TError = Error> extends Omit<UseQueryOptions<TData, TError>, 'enabled' | 'staleTime' | 'gcTime' | 'refetchOnWindowFocus' | 'refetchOnReconnect' | 'retry' | 'retryDelay'> {
  priority?: 'high' | 'normal' | 'low';
  background?: boolean;
}

export function useOptimizedQuery<TData = unknown, TError = Error>(
  options: OptimizedQueryOptions<TData, TError>
) {
  const { isOnline, isSlowConnection } = useNetworkStatus();
  const { priority = 'normal', background = false, ...queryOptions } = options;

  // Dynamic stale time based on priority and connection
  const getStaleTime = () => {
    if (priority === 'high') return isSlowConnection ? 30000 : 10000;
    if (priority === 'low') return isSlowConnection ? 600000 : 300000;
    return isSlowConnection ? 300000 : 60000;
  };

  // Dynamic garbage collection time
  const getGcTime = () => {
    if (priority === 'high') return 300000; // 5 minutes
    if (priority === 'low') return 1800000; // 30 minutes
    return 600000; // 10 minutes
  };

  return useQuery({
    ...queryOptions,
    enabled: queryOptions.enabled !== false && isOnline,
    staleTime: getStaleTime(),
    gcTime: getGcTime(),
    refetchOnWindowFocus: !background && priority !== 'low',
    refetchOnReconnect: isOnline,
    retry: (failureCount, error) => {
      if (!isOnline) return false;
      if (failureCount >= (priority === 'high' ? 2 : 3)) return false;
      return true;
    },
    retryDelay: (attemptIndex) => {
      const baseDelay = priority === 'high' ? 500 : 1000;
      return Math.min(baseDelay * 2 ** attemptIndex, 30000);
    },
  });
}

// Hook for prefetching data
export function usePrefetchQuery() {
  const { isOnline, isSlowConnection } = useNetworkStatus();

  return (queryKey: QueryKey, queryFn: () => Promise<any>, delay = 0) => {
    if (!isOnline || isSlowConnection) return;

    setTimeout(() => {
      // This would typically use queryClient.prefetchQuery
      // but we'll implement it based on the query client context
      queryFn().catch(() => {
        // Silently fail prefetch
      });
    }, delay);
  };
}
