
import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface SectionProps {
  id?: string;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  titleCentered?: boolean;
  background?: 'white' | 'light' | 'dark';
  carouselItem?: boolean;
  titleClassName?: string;
  subtitleClassName?: string;
  contentClassName?: string;
  matchFAQHeight?: boolean;
}

const Section: React.FC<SectionProps> = ({ 
  id, 
  title, 
  subtitle, 
  children, 
  className,
  titleCentered = false,
  background = 'white',
  carouselItem = false,
  titleClassName = '',
  subtitleClassName = '',
  contentClassName = '',
  matchFAQHeight = false
}) => {
  const isMobile = useIsMobile();
  
  const bgClasses = {
    'white': 'bg-white',
    'light': 'bg-white',
    'dark': 'bg-black text-white',
  };

  const sectionHeightClasses = matchFAQHeight 
    ? 'py-24 md:py-32' 
    : carouselItem 
      ? 'py-16 md:py-20' 
      : id === 'whats-included'
        ? 'py-24 md:py-32'
        : 'py-32 md:py-48';

  return (
    <section id={id} className={cn(
      sectionHeightClasses,
      'flex flex-col overflow-hidden relative',
      bgClasses[background],
      className
    )}>
      <div className={cn("container-custom flex flex-col h-full px-8 md:px-16")}>
        {(title || subtitle) && (
          <div 
            className={cn(
              'mb-16 md:mb-24', 
              titleCentered ? 'text-center max-w-4xl mx-auto' : 'max-w-4xl'
            )}
          >
            {title && (
              <h2 
                className={cn(
                  "text-3xl md:text-5xl lg:text-6xl font-medium mb-8 md:mb-12 tracking-tight",
                  titleClassName,
                  background === 'dark' ? 'text-white' : 'text-black'
                )}
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p 
                className={cn(
                  "text-lg md:text-xl max-w-3xl font-light leading-loose",
                  subtitleClassName,
                  background === 'dark' ? 'text-white/70' : 'text-gray-600'
                )}
              > 
                {subtitle}
              </p>
            )}
          </div>
        )}
        <div className={cn("flex flex-col items-center w-full", contentClassName)}>
          {children}
        </div>
      </div>
    </section>
  );
};

export default Section;
