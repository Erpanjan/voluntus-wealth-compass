
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
        "sticky top-0 will-change-transform transition-transform duration-300 ease-out",
        className
      )}
      style={{
        '--card-index': index,
        zIndex: 100 + index, // Fixed: new cards appear on top
        transform: `translateY(${index * 20}px) scale(${1 - index * 0.02})`, // Reduced scale difference
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
};

export default StackingCardItem;
