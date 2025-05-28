
import React, { useRef, useEffect, useState, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StackingCardsProps {
  totalCards: number;
  scrollOptions?: {
    container?: { current: HTMLElement | null };
  };
  children: ReactNode;
  className?: string;
}

const StackingCards: React.FC<StackingCardsProps> = ({
  totalCards,
  scrollOptions,
  children,
  className
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const container = scrollOptions?.container?.current || containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight - container.clientHeight;
      const progress = Math.min(scrollTop / scrollHeight, 1);
      setScrollProgress(progress);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [scrollOptions]);

  return (
    <div
      ref={containerRef}
      className={cn("relative", className)}
      style={{
        '--scroll-progress': scrollProgress,
        '--total-cards': totalCards,
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
};

export default StackingCards;
