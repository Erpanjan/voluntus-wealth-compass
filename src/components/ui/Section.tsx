
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
  carouselItem?: boolean; // New prop for carousel context
  titleClassName?: string; // New prop for custom title styling
  subtitleClassName?: string; // New prop for custom subtitle styling
  contentClassName?: string; // New prop for custom content styling
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
  contentClassName = ''
}) => {
  const isMobile = useIsMobile();
  
  const bgClasses = {
    'white': 'bg-white',
    'light': 'bg-[#F1F1F1]',
    'dark': 'bg-black text-white',
  };

  return (
    <section id={id} className={cn(
      'min-h-screen flex flex-col justify-center py-20 md:py-28 overflow-hidden relative',
      carouselItem ? 'h-full w-full flex-shrink-0' : '',
      bgClasses[background],
      className
    )}>
      <div className={cn("container-custom flex flex-col justify-center h-full", carouselItem && "h-full")}>
        {(title || subtitle) && (
          <div 
            className={cn(
              'mb-16', 
              titleCentered ? 'text-center max-w-3xl mx-auto' : 'max-w-3xl'
            )}
            data-section-header="true" // Add a data attribute to make it easier to target
          >
            {title && (
              <h2 
                className={cn(
                  "text-3xl md:text-4xl lg:text-5xl font-semibold mb-8 tracking-tight animate-fade-in",
                  titleClassName
                )}
                data-section-title="true"
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p 
                className={cn(
                  "text-lg md:text-xl text-[#000006] max-w-2xl animate-fade-in",
                  subtitleClassName
                )}
                data-section-subtitle="true"
              > 
                {subtitle}
              </p>
            )}
          </div>
        )}
        <div className={cn("flex-grow flex flex-col items-center justify-start w-full", contentClassName)} data-section-content="true">
          {children}
        </div>
      </div>
    </section>
  );
};

export default Section;
