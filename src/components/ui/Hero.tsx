
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
    'light': 'bg-[#F1F1F1]',
    'dark': 'bg-black text-white',
    'transparent': 'bg-transparent',
  };

  return (
    <section className={cn(
      'pt-40 pb-24 md:pt-48 md:pb-28 overflow-hidden relative',
      bgClasses[background],
      className
    )}>
      <div className="container-custom relative z-10">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold leading-tight mb-8 tracking-tight animate-fade-in-up">
            {title}
          </h1>
          
          {subtitle && (
            <p className="text-lg md:text-xl text-[#000006] mb-12 animate-fade-in-up max-w-2xl mx-auto" style={{animationDelay: '0.2s'}}>
              {subtitle}
            </p>
          )}
          
          {collaboration && (
            <p className="text-sm text-[#9F9EA1] italic mb-10 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
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
      <div className="absolute left-0 bottom-0 w-full h-32 bg-gradient-to-t from-[#F1F1F1]/30 to-transparent"></div>
    </section>
  );
};

export default Hero;
