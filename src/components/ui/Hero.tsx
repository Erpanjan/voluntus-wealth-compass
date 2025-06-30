
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
  return (
    <section className={cn(
      'min-h-screen flex flex-col justify-center items-center overflow-hidden relative bg-white',
      className
    )}>
      <div className="container-custom relative z-10 flex flex-col justify-center py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-0">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-medium leading-tight mb-12 md:mb-16 tracking-tight text-center text-black">
            {title}
          </h1>
          
          {subtitle && (
            <p className="text-lg md:text-xl text-gray-600 font-light mb-16 md:mb-20 max-w-2xl mx-auto text-center leading-loose">
              {subtitle}
            </p>
          )}
          
          {collaboration && (
            <p className="text-sm text-gray-500 font-light mb-12 md:mb-16 text-center uppercase tracking-wider">
              {collaboration}
            </p>
          )}
          
          {children && (
            <div className="mt-16 md:mt-20 text-center">
              {children}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
