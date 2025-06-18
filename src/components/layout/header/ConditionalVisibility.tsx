
import React from 'react';
import { cn } from '@/lib/utils';
import { HEADER_CLASSES } from './constants';
import { ConditionalVisibilityProps } from './types';

const ConditionalVisibility: React.FC<ConditionalVisibilityProps> = ({
  children,
  condition,
  className = ''
}) => {
  return (
    <div className={cn(
      HEADER_CLASSES.TRANSITION_OPACITY,
      condition ? HEADER_CLASSES.HIDDEN_ON_LOGIN : HEADER_CLASSES.VISIBLE,
      className
    )}>
      {children}
    </div>
  );
};

export default ConditionalVisibility;
