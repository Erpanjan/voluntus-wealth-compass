
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useNetworkStatus } from './useNetworkStatus';

interface OptimizedQueryOptions<TData = unknown, TError = Error> extends UseQueryOptions<TData, TError> {
  priority?: 'high' | 'normal' | 'low';
  cacheStrategy?: 'aggressive' | 'normal' | 'minimal';
}

export function useOptimizedQuery<TData = unknown, TError = Error>(
  options: OptimizedQueryOptions<TData, TError>
) {
  const { isOnline, isSlowConnection } = useNetworkStatus();
  const { priority = 'normal', cacheStrategy = 'normal', ...queryOptions } = options;

  // Dynamic cache times based on priority and connection
  const getCacheTimes = () => {
    const baseStale = isSlowConnection ? 10 * 60 * 1000 : 5 * 60 * 1000; // 10min slow, 5min normal
    const baseGc = 30 * 60 * 1000; // 30 minutes

    switch (cacheStrategy) {
      case 'aggressive':
        return {
          staleTime: baseStale * 2,
          gcTime: baseGc * 2,
        };
      case 'minimal':
        return {
          staleTime: 30 * 1000, // 30 seconds
          gcTime: 5 * 60 * 1000, // 5 minutes
        };
      default:
        return {
          staleTime: baseStale,
          gcTime: baseGc,
        };
    }
  };

  const { staleTime, gcTime } = getCacheTimes();

  return useQuery({
    ...queryOptions,
    enabled: queryOptions.enabled !== false && isOnline,
    staleTime,
    gcTime,
    retry: (failureCount, error) => {
      if (!isOnline) return false;
      
      // More aggressive retry for high priority queries
      const maxRetries = priority === 'high' ? 5 : priority === 'normal' ? 3 : 1;
      if (failureCount >= maxRetries) return false;
      
      return true;
    },
    retryDelay: (attemptIndex) => {
      const baseDelay = priority === 'high' ? 500 : 1000;
      return Math.min(baseDelay * 2 ** attemptIndex, 30000);
    },
    refetchOnWindowFocus: priority === 'high',
    refetchOnMount: cacheStrategy === 'minimal' ? 'always' : true,
  });
}
