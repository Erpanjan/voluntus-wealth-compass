
import React from 'react';
import { cn } from '@/lib/utils';

interface HeroProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  background?: 'white' | 'light' | 'dark' | 'transparent';
  className?: string;
  collaboration?: string;
}

const Hero: React.FC<HeroProps> = ({
  title,
  subtitle,
  children,
  background = 'white',
  className,
  collaboration
}) => {
  const backgroundClasses = {
    white: 'bg-white',
    light: 'bg-white',
    dark: 'bg-black text-white',
    transparent: 'bg-transparent'
  };

  return (
    <section className={cn(
      'min-h-screen flex items-center justify-center',
      backgroundClasses[background],
      className
    )}>
      <div className="container-custom text-center">
        <div className="max-w-4xl mx-auto editorial-spacing-large">
          {/* Ultra-minimal title */}
          <h1 className="mb-16 font-light leading-none tracking-wide">
            {title}
          </h1>
          
          {/* Subtitle if provided */}
          {subtitle && (
            <div className="editorial-spacing">
              <p className="text-lg md:text-xl font-light text-gray-600 max-w-2xl mx-auto leading-relaxed">
                {subtitle}
              </p>
            </div>
          )}

          {/* Collaboration text if provided */}
          {collaboration && (
            <div className="editorial-spacing">
              <p className="text-sm font-light text-gray-500 uppercase tracking-widest">
                {collaboration}
              </p>
            </div>
          )}

          {/* Children (typically CTA buttons) */}
          {children && (
            <div className="editorial-spacing">
              {children}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
