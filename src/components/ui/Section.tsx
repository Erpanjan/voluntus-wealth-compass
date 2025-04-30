
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
      'py-16 md:py-20 overflow-hidden relative',
      carouselItem ? 'h-full w-full flex-shrink-0' : '',
      bgClasses[background],
      className
    )}>
      <div className={cn("container-custom flex flex-col h-full", carouselItem && "h-full")}>
        {(title || subtitle) && (
          <div className={cn(
            'mb-12', 
            titleCentered ? 'text-center mx-auto' : '',
            titleCentered ? 'max-w-4xl' : 'max-w-3xl'
          )}>
            {title && (
              <h2 className="text-[2.75rem] md:text-[3.5rem] font-normal text-[#333333] tracking-tight leading-[1.2] mb-8">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg md:text-xl text-[#999999] max-w-2xl" style={{fontWeight: 300}}> 
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
