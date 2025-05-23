
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useNetworkStatus } from './useNetworkStatus';

export function useOptimizedQuery<TData = unknown, TError = Error>(
  options: UseQueryOptions<TData, TError>
) {
  const { isOnline, isSlowConnection } = useNetworkStatus();

  return useQuery({
    ...options,
    enabled: options.enabled !== false && isOnline,
    staleTime: isSlowConnection ? 5 * 60 * 1000 : 1 * 60 * 1000, // 5min for slow, 1min for normal
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
      if (!isOnline) return false;
      if (failureCount >= 3) return false;
      return true;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}
