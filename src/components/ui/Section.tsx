
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
  noMinHeight?: boolean; // New prop to disable minimum height constraints
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
  matchFAQHeight = false,
  noMinHeight = false
}) => {
  const isMobile = useIsMobile();
  
  const bgClasses = {
    'white': 'bg-white',
    'light': 'bg-[#F1F1F1]',
    'dark': 'bg-black text-white',
  };

  // Apply specific height classes when matching FAQ height or for ServiceFeatureGrid
  const sectionHeightClasses = noMinHeight 
    ? 'py-12 md:py-16' // Only padding when noMinHeight is true
    : matchFAQHeight 
      ? 'py-16 md:py-24' 
      : carouselItem 
        ? 'py-3 md:py-6' 
        : id === 'whats-included'
          ? 'py-6 md:py-8'
          : 'min-h-[70vh] md:min-h-screen py-8 sm:py-10 md:py-16';

  // Use different justify alignment for services section to reduce bottom spacing
  const justifyAlignment = id === 'whats-included' ? 'justify-start' : 'justify-center';

  return (
    <section id={id} className={cn(
      sectionHeightClasses,
      'flex flex-col overflow-hidden relative',
      justifyAlignment,
      bgClasses[background],
      className
    )}>
      <div className={cn("container-custom flex flex-col h-full px-3 md:px-6", carouselItem && "h-full", id === 'whats-included' && "justify-start")}>
        {(title || subtitle) && (
          <div 
            className={cn(
              'mb-5 sm:mb-6 md:mb-12', 
              titleCentered ? 'text-center max-w-3xl mx-auto' : 'max-w-3xl'
            )}
            data-section-header="true"
          >
            {title && (
              <h2 
                className={cn(
                  "text-xl sm:text-2xl md:text-4xl lg:text-5xl font-semibold mb-3 md:mb-6 tracking-tight animate-fade-in",
                  titleClassName,
                  background === 'dark' ? 'text-white' : 'text-[#333333]'
                )}
                data-section-title="true"
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p 
                className={cn(
                  "text-base sm:text-lg md:text-xl max-w-2xl animate-fade-in mobile-text-base",
                  subtitleClassName,
                  background === 'dark' ? 'text-white/70' : 'text-[#666666]'
                )}
                data-section-subtitle="true"
              > 
                {subtitle}
              </p>
            )}
          </div>
        )}
        <div className={cn("flex flex-col items-center w-full", id === 'whats-included' ? "justify-start" : "flex-grow justify-start", contentClassName)} data-section-content="true">
          {children}
        </div>
      </div>
    </section>
  );
};

export default Section;
