
export interface Toast {
  (props: {
    title?: string;
    description?: string;
    variant?: 'default' | 'destructive';
    duration?: number;
  }): void;
}
