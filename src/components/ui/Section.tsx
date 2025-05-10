
import React from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface SectionProps {
  id?: string;
  children: React.ReactNode;
  background?: 'white' | 'light' | 'dark' | 'transparent';
  className?: string;
  innerClassName?: string;
  carouselItem?: boolean;
  title?: string;
  subtitle?: string;
  titleCentered?: boolean;
}

const Section: React.FC<SectionProps> = ({
  id,
  children,
  background = 'light',
  className,
  innerClassName,
  carouselItem = false,
  title,
  subtitle,
  titleCentered = false
}) => {
  const isMobile = useIsMobile();
  
  const getBgColor = () => {
    switch (background) {
      case 'white':
        return 'bg-white';
      case 'light':
        return 'bg-[#F1F1F1]';
      case 'dark':
        return 'bg-gray-900';
      case 'transparent':
        return 'bg-transparent';
      default:
        return 'bg-[#F1F1F1]';
    }
  };
  
  return (
    <section
      id={id}
      className={cn(
        getBgColor(),
        carouselItem ? '' : 'py-6 sm:py-8 md:py-12 lg:py-16',
        className
      )}
    >
      <div
        className={cn(
          'container mx-auto px-4 sm:px-6',
          carouselItem ? '' : 'max-w-7xl',
          isMobile && carouselItem ? 'mobile-content' : '',
          innerClassName
        )}
      >
        {/* Render title and subtitle if provided - with improved mobile scaling */}
        {(title || subtitle) && (
          <div className={cn("mb-6 sm:mb-8 md:mb-10", titleCentered ? "text-center" : "")}>
            {title && (
              <h2 className={cn(
                "font-semibold mb-2.5 sm:mb-3", 
                isMobile ? "mobile-heading-lg text-balance" : "text-2xl sm:text-3xl md:text-4xl"
              )}>
                {title}
              </h2>
            )}
            {subtitle && (
              <p className={cn(
                "max-w-3xl text-gray-600", 
                isMobile ? "mobile-body-text text-balance" : "text-base sm:text-lg"
              )}>
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
};

export default Section;
