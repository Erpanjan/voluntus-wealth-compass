
import React from 'react';
import { cn } from '@/lib/utils';

interface SectionProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  background?: 'white' | 'light' | 'dark';
  className?: string;
  id?: string;
  titleCentered?: boolean;
}

const Section: React.FC<SectionProps> = ({
  children,
  title,
  subtitle,
  background = 'white',
  className,
  id,
  titleCentered = false
}) => {
  const backgroundClasses = {
    white: 'bg-white',
    light: 'bg-white',
    dark: 'bg-black text-white'
  };

  return (
    <section 
      id={id}
      className={cn(
        'section',
        backgroundClasses[background],
        className
      )}
    >
      <div className="container-custom">
        {/* Editorial title section */}
        {title && (
          <div className={cn(
            "editorial-spacing-large",
            titleCentered ? "text-center" : "text-left"
          )}>
            <h2 className="font-light tracking-wide leading-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="text-lg font-light text-gray-600 mt-8 max-w-2xl leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
        )}
        
        {/* Content */}
        <div>
          {children}
        </div>
      </div>
    </section>
  );
};

export default Section;
