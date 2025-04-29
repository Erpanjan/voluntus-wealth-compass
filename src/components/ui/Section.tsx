
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
  background?: 'white' | 'light' | 'dark' | 'darkGray';
  carouselItem?: boolean;
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
    'darkGray': 'bg-[#222222] text-white',
  };

  return (
    <section id={id} className={cn(
      'min-h-screen flex flex-col justify-center py-16 md:py-24 overflow-hidden relative',
      carouselItem ? 'h-full w-full flex-shrink-0' : '',
      bgClasses[background],
      className
    )}>
      <div className={cn("container-custom flex flex-col justify-center h-full", carouselItem && "h-full")}>
        {(title || subtitle) && (
          <div className={cn(
            'mb-16', 
            titleCentered ? 'text-center max-w-3xl mx-auto' : 'max-w-3xl'
          )}>
            {title && (
              <h2 className={cn(
                "text-3xl md:text-4xl lg:text-5xl font-semibold mb-8 tracking-tight animate-fade-in-up",
                (background === 'dark' || background === 'darkGray') && "text-white"
              )}>
                {title}
              </h2>
            )}
            {subtitle && (
              <p className={cn(
                "text-lg md:text-xl max-w-2xl animate-fade-in-up",
                (background === 'dark' || background === 'darkGray') ? "text-gray-300" : "text-[#000006]"
              )} style={{animationDelay: '0.2s'}}> 
                {subtitle}
              </p>
            )}
          </div>
        )}
        <div className="flex-grow flex flex-col items-center justify-start w-full">
          {children}
        </div>
      </div>
    </section>
  );
};

export default Section;
