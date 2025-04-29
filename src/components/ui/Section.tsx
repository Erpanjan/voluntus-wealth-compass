
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
}

const Section: React.FC<SectionProps> = ({ 
  id, 
  title, 
  subtitle, 
  children, 
  className,
  titleCentered = false,
  background = 'white',
  carouselItem = false
}) => {
  const isMobile = useIsMobile();
  
  const bgClasses = {
    'white': 'bg-white',
    'light': 'bg-[#F1F1F1]',
    'dark': 'bg-black text-white',
  };

  return (
    <section id={id} className={cn(
      'min-h-screen flex flex-col justify-center py-24 md:py-32 overflow-hidden relative',
      carouselItem ? 'h-full w-full flex-shrink-0' : '',
      bgClasses[background],
      className
    )}>
      <div className={cn("container-custom", carouselItem && "h-full")}>
        {(title || subtitle) && (
          <div className={cn(
            'mb-20', 
            titleCentered ? 'text-center max-w-3xl mx-auto' : 'max-w-3xl'
          )}>
            {title && (
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-8 tracking-tight animate-fade-in-up">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg md:text-xl text-[#000006] max-w-2xl animate-fade-in-up" style={{animationDelay: '0.2s'}}> 
                {subtitle}
              </p>
            )}
          </div>
        )}
        <div className="flex-grow flex flex-col items-center justify-center w-full">
          {children}
        </div>
      </div>
    </section>
  );
};

export default Section;
