
import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface HeroProps {
  title: string;
  subtitle?: string;
  className?: string;
  children?: ReactNode;
  collaboration?: string;
  background?: 'light' | 'dark' | 'transparent' | 'white-smoke' | 'almond';
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
    'white-smoke': 'bg-brand-white-smoke',
    'almond': 'bg-brand-almond',
  };

  const textColorClasses = {
    'light': 'text-brand-black-olive',
    'dark': 'text-white',
    'transparent': 'text-brand-black-olive',
    'white-smoke': 'text-brand-black-olive',
    'almond': 'text-brand-black-olive',
  };

  const subtitleColorClasses = {
    'light': 'text-brand-medium-gray',
    'dark': 'text-white/70',
    'transparent': 'text-brand-medium-gray',
    'white-smoke': 'text-brand-medium-gray',
    'almond': 'text-brand-medium-gray',
  };

  return (
    <section className={cn(
      'min-h-[80vh] md:min-h-screen flex flex-col justify-center items-center overflow-hidden relative',
      bgClasses[background],
      className
    )}>
      <div className="container-custom relative z-10 flex flex-col justify-center py-12 sm:py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-4 md:px-0">
          <h1 className={cn(
            "text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 md:mb-6 tracking-tight animate-fade-in text-center",
            textColorClasses[background]
          )}>
            {title}
          </h1>
          
          {subtitle && (
            <p className={cn(
              "text-base sm:text-lg md:text-xl font-light mb-6 md:mb-10 animate-fade-in max-w-2xl mx-auto text-center mobile-text-base",
              subtitleColorClasses[background]
            )}>
              {subtitle}
            </p>
          )}
          
          {collaboration && (
            <p className={cn(
              "text-sm italic mb-5 md:mb-8 animate-fade-in mobile-text-sm",
              subtitleColorClasses[background]
            )}>
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
      {background !== 'dark' && (
        <div className="absolute left-0 bottom-0 w-full h-32 bg-gradient-to-t from-brand-white-smoke/30 to-transparent"></div>
      )}
    </section>
  );
};

export default Hero;
