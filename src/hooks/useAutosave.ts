
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

interface AutosaveOptions {
  data: any;
  onSave: (data: any) => Promise<void> | void;
  delay?: number;
  enabled?: boolean;
}

export const useAutosave = ({ data, onSave, delay = 2000, enabled = true }: AutosaveOptions) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedData = useRef<string>('');

  useEffect(() => {
    if (!enabled) return;

    const currentDataString = JSON.stringify(data);
    
    // Don't save if data hasn't changed
    if (currentDataString === lastSavedData.current) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(async () => {
      try {
        await onSave(data);
        lastSavedData.current = currentDataString;
        toast.success('Content auto-saved', { duration: 2000 });
      } catch (error) {
        console.error('Autosave failed:', error);
        toast.error('Auto-save failed');
      }
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, onSave, delay, enabled]);

  return {
    // Can expose manual save trigger if needed
    triggerSave: () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        onSave(data);
      }
    }
  };
};
