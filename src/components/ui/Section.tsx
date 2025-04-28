
import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionProps {
  id?: string;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  titleCentered?: boolean;
  background?: 'white' | 'light' | 'dark';
}

const Section: React.FC<SectionProps> = ({ 
  id, 
  title, 
  subtitle, 
  children, 
  className,
  titleCentered = false,
  background = 'white'
}) => {
  const bgClasses = {
    'white': 'bg-white',
    'light': 'bg-[#F1F1F1]', // Light Gray
    'dark': 'bg-black text-white', // Black background with white text
  };

  return (
    <section id={id} className={cn(
      'py-20 md:py-28',
      bgClasses[background],
      className
    )}>
      <div className="container-custom">
        {(title || subtitle) && (
          <div className={cn(
            'mb-16', 
            titleCentered ? 'text-center max-w-3xl mx-auto' : ''
          )}>
            {title && (
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-6 animate-fade-in-up">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg text-[#000006] max-w-2xl animate-fade-in-up" style={{animationDelay: '0.2s'}}> 
                {subtitle}
              </p>
            )}
          </div>
        )}
        <div>{children}</div>
      </div>
    </section>
  );
};

export default Section;
