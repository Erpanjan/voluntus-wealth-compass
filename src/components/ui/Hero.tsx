
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
    'light': 'bg-voluntus-gray-light',
    'dark': 'bg-voluntus-text-primary text-white',
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
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight mb-6 animate-fade-in-up">
            {title}
          </h1>
          
          {subtitle && (
            <p className="text-lg md:text-xl text-voluntus-text-secondary mb-8 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              {subtitle}
            </p>
          )}
          
          {collaboration && (
            <p className="text-sm text-voluntus-text-secondary italic mb-8 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
              {collaboration}
            </p>
          )}
          
          {children && (
            <div className="mt-10 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
              {children}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
