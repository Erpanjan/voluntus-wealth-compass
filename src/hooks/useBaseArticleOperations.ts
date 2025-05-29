
import { useMemo, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useOptimizedQuery } from './useOptimizedQuery';
import { Language } from '@/types/multilingual-article.types';

interface BaseArticleOperationsConfig {
  cacheStrategy?: 'normal' | 'aggressive';
  priority?: 'high' | 'normal' | 'low';
  staleTime?: number;
  retry?: number;
}

export const useBaseArticleOperations = (config: BaseArticleOperationsConfig = {}) => {
  const { toast } = useToast();
  
  const defaultConfig = useMemo(() => ({
    cacheStrategy: 'aggressive' as const,
    priority: 'normal' as const,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    ...config
  }), [config]);

  const showErrorToast = useCallback((title: string, description: string) => {
    toast({
      title,
      description,
      variant: "destructive",
    });
  }, [toast]);

  const showSuccessToast = useCallback((title: string, description: string) => {
    toast({
      title,
      description,
    });
  }, [toast]);

  const createQuery = useCallback(<T>(
    queryKey: (string | number | boolean)[],
    queryFn: () => Promise<T>,
    options: Partial<BaseArticleOperationsConfig & { enabled?: boolean }> = {}
  ) => {
    return useOptimizedQuery({
      queryKey,
      queryFn,
      enabled: options.enabled !== false,
      priority: options.priority || defaultConfig.priority,
      cacheStrategy: options.cacheStrategy || defaultConfig.cacheStrategy,
      staleTime: options.staleTime || defaultConfig.staleTime,
      retry: options.retry || defaultConfig.retry,
    });
  }, [defaultConfig]);

  return {
    createQuery,
    showErrorToast,
    showSuccessToast,
    defaultConfig
  };
};
