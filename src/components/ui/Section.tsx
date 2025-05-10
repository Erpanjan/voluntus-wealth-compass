
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
        carouselItem ? '' : 'py-8 sm:py-10 md:py-16 lg:py-20',
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
        {/* Render title and subtitle if provided */}
        {(title || subtitle) && (
          <div className={cn("mb-8 sm:mb-10 md:mb-12", titleCentered ? "text-center" : "")}>
            {title && (
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-3">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-base sm:text-lg text-gray-600 max-w-3xl">
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
