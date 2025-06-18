
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
    'light': 'bg-brand-white-smoke',
    'dark': 'bg-brand-black-olive text-white',
  };

  // Enhanced spacing for comfort and breathability
  const sectionHeightClasses = matchFAQHeight 
    ? 'py-20 md:py-28' 
    : carouselItem 
      ? 'py-6 md:py-10' 
      : 'min-h-[75vh] md:min-h-screen py-12 sm:py-16 md:py-24';

  return (
    <section 
      id={id} 
      className={cn(
        sectionHeightClasses,
        'flex flex-col justify-center overflow-hidden relative transition-all duration-500',
        bgClasses[background],
        // Add subtle gradient overlay for depth
        background === 'light' && 'bg-gradient-to-br from-brand-white-smoke via-brand-white-smoke to-brand-almond/30',
        background === 'white' && 'bg-gradient-to-br from-white via-white to-brand-white-smoke/20',
        className
      )}
      style={{
        // Add subtle inner shadow for elevated comfort feel
        boxShadow: background !== 'dark' ? 'inset 0 1px 3px rgba(59, 59, 61, 0.02)' : undefined
      }}
    >
      <div className={cn(
        "container-custom flex flex-col justify-center h-full px-6 md:px-10", 
        carouselItem && "h-full",
        // Enhanced comfortable spacing
        "max-w-7xl mx-auto"
      )}>
        {(title || subtitle) && (
          <div 
            className={cn(
              'mb-8 sm:mb-12 md:mb-16', 
              titleCentered ? 'text-center max-w-4xl mx-auto' : 'max-w-4xl',
              // Add subtle backdrop for better text readability
              'relative'
            )}
            data-section-header="true"
          >
            {title && (
              <h2 
                className={cn(
                  "text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-heading font-semibold mb-4 md:mb-8 tracking-tight animate-fade-in",
                  // Brand typography with enhanced spacing
                  "leading-tight text-brand-black-olive font-inter",
                  // Subtle text shadow for depth
                  "drop-shadow-sm",
                  titleClassName,
                  background === 'dark' ? 'text-white drop-shadow-md' : ''
                )}
                data-section-title="true"
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p 
                className={cn(
                  "text-lg sm:text-xl md:text-2xl max-w-3xl animate-fade-in font-body leading-relaxed",
                  // Brand colors for comfortable reading
                  "text-brand-muted-gray",
                  // Enhanced line height for readability
                  "leading-loose tracking-wide",
                  subtitleClassName,
                  background === 'dark' ? 'text-white/80' : ''
                )}
                data-section-subtitle="true"
              > 
                {subtitle}
              </p>
            )}
          </div>
        )}
        
        <div 
          className={cn(
            "flex-grow flex flex-col items-center justify-start w-full",
            // Enhanced content spacing
            "space-y-6 md:space-y-10",
            contentClassName
          )} 
          data-section-content="true"
        >
          {children}
        </div>
      </div>
      
      {/* Subtle decorative elements for modern aesthetic */}
      {background !== 'dark' && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-light-gray/20 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-light-gray/20 to-transparent" />
        </div>
      )}
    </section>
  );
};

export default Section;
