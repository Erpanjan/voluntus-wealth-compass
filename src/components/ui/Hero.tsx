
import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface HeroProps {
  title: string;
  subtitle?: string;
  className?: string;
  children?: ReactNode;
  collaboration?: string;
  background?: 'light' | 'dark' | 'transparent';
}

const Hero: React.FC<HeroProps> = ({ 
  title, 
  subtitle, 
  className, 
  children,
  collaboration,
  background = 'transparent'
}) => {
  const bgClasses = {
    'light': 'bg-brand-white-smoke',
    'dark': 'bg-brand-black-olive text-white',
    'transparent': 'bg-transparent',
  };

  return (
    <section className={cn(
      'min-h-[80vh] md:min-h-screen flex flex-col justify-center items-center overflow-hidden relative',
      bgClasses[background],
      className
    )}>
      <div className="container-custom relative z-10 flex flex-col justify-center py-12 sm:py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-4 md:px-0">
          <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-inter font-semibold leading-tight mb-4 md:mb-6 tracking-tight animate-fade-in text-center text-brand-black-olive">
            {title}
          </h1>
          
          {subtitle && (
            <p className="text-base sm:text-lg md:text-xl text-brand-muted-gray font-body font-light mb-6 md:mb-10 animate-fade-in max-w-2xl mx-auto text-center leading-relaxed">
              {subtitle}
            </p>
          )}
          
          {collaboration && (
            <p className="text-sm text-brand-muted-gray italic mb-5 md:mb-8 animate-fade-in font-body">
              {collaboration}
            </p>
          )}
          
          {children && (
            <div className="mt-6 md:mt-10 animate-fade-in">
              {children}
            </div>
          )}
        </div>
      </div>
      
      {/* Subtle brand gradient overlay */}
      <div className="absolute left-0 bottom-0 w-full h-32 bg-gradient-to-t from-brand-white-smoke/30 to-transparent"></div>
    </section>
  );
};

export default Hero;
