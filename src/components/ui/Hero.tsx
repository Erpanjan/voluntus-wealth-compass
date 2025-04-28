
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
    'light': 'bg-[#F1F1F1]', // Light Gray
    'dark': 'bg-black text-white', // Black with white text
    'transparent': 'bg-transparent',
  };

  return (
    <section className={cn(
      'pt-32 pb-16 md:pt-40 md:pb-24',
      bgClasses[background],
      className
    )}>
      <div className="container-custom">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-semibold leading-tight mb-8 animate-fade-in-up text-black">
            {title}
          </h1>
          
          {subtitle && (
            <p className="text-lg md:text-xl text-[#000006] mb-10 animate-fade-in-up max-w-2xl mx-auto" style={{animationDelay: '0.2s'}}>
              {subtitle}
            </p>
          )}
          
          {collaboration && (
            <p className="text-sm text-[#9F9EA1] italic mb-8 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
              {collaboration}
            </p>
          )}
          
          {children && (
            <div className="mt-12 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
              {children}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
