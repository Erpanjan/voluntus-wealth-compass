
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
}

const Section: React.FC<SectionProps> = ({
  id,
  children,
  background = 'light',
  className,
  innerClassName,
  carouselItem = false
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
        {children}
      </div>
    </section>
  );
};

export default Section;
