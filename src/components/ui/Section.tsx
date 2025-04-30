
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
  shortHeight?: boolean; // Added new prop for shorter sections
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
  shortHeight = false // Default to standard height
}) => {
  const isMobile = useIsMobile();
  
  const bgClasses = {
    'white': 'bg-white',
    'light': 'bg-[#F1F1F1]',
    'dark': 'bg-black text-white',
  };

  return (
    <section id={id} className={cn(
      'flex flex-col justify-center py-20 md:py-28 overflow-hidden relative',
      shortHeight ? 'min-h-[70vh]' : 'min-h-screen', // Reduced height when shortHeight is true
      carouselItem ? 'h-full w-full flex-shrink-0' : '',
      bgClasses[background],
      className
    )}>
      <div className={cn(
        "container-custom flex flex-col justify-center h-full",
        carouselItem && "h-full"
      )}>
        {(title || subtitle) && (
          <div className={cn(
            'mb-12', // Reduced margin from mb-16 to mb-12
            titleCentered ? 'text-center max-w-3xl mx-auto' : 'max-w-3xl'
          )}>
            {title && (
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-6 tracking-tight text-black animate-fade-in-up">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className={cn(
                "text-lg md:text-xl max-w-2xl animate-fade-in-up text-[#9F9EA1] font-light",
                !titleCentered && "text-[#9F9EA1]"
              )} style={{animationDelay: '0.2s'}}> 
                {subtitle}
              </p>
            )}
          </div>
        )}
        <div className="flex-grow flex flex-col items-start justify-start w-full">
          {children}
        </div>
      </div>
    </section>
  );
};

export default Section;
