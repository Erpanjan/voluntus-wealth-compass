
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
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');
  const [lastScrollTop, setLastScrollTop] = useState(0);

  useEffect(() => {
    const container = scrollOptions?.container?.current || containerRef.current;
    if (!container) return;

    let rafId: number;
    let lastCallTime = 0;

    const handleScroll = () => {
      const now = Date.now();
      
      // Throttle to 60fps
      if (now - lastCallTime < 16) {
        rafId = requestAnimationFrame(handleScroll);
        return;
      }
      lastCallTime = now;

      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight - container.clientHeight;
      const progress = Math.min(Math.max(scrollTop / scrollHeight, 0), 1);
      
      // Determine scroll direction
      setScrollDirection(scrollTop > lastScrollTop ? 'down' : 'up');
      setLastScrollTop(scrollTop);
      setScrollProgress(progress);
    };

    const throttledScroll = () => {
      rafId = requestAnimationFrame(handleScroll);
    };

    container.addEventListener('scroll', throttledScroll, { passive: true });
    
    return () => {
      container.removeEventListener('scroll', throttledScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [scrollOptions, lastScrollTop]);

  return (
    <div
      ref={containerRef}
      className={cn("relative", className)}
      style={{
        '--scroll-progress': scrollProgress,
        '--total-cards': totalCards,
        '--scroll-direction': scrollDirection === 'down' ? 1 : -1,
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
};

export default StackingCards;
