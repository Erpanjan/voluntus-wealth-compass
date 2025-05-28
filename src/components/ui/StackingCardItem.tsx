
import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StackingCardItemProps {
  index: number;
  children: ReactNode;
  className?: string;
}

const StackingCardItem: React.FC<StackingCardItemProps> = ({
  index,
  children,
  className
}) => {
  return (
    <div
      className={cn(
        "sticky top-0 stacking-card-item will-change-transform",
        className
      )}
      style={{
        '--card-index': index,
        zIndex: 100 + index,
        transform: `
          translateY(calc(var(--scroll-progress, 0) * ${index * -80}px + ${index * 15}px))
          scale(calc(1 - var(--scroll-progress, 0) * ${index * 0.02} - ${index * 0.01}))
          rotateX(calc(var(--scroll-progress, 0) * ${index * 2}deg))
        `,
        transformOrigin: 'center bottom',
        opacity: `calc(1 - var(--scroll-progress, 0) * ${index * 0.15})`,
        filter: `blur(calc(var(--scroll-progress, 0) * ${index * 1}px))`,
      } as React.CSSProperties}
    >
      <div className="stacking-card-content">
        {children}
      </div>
    </div>
  );
};

export default StackingCardItem;
