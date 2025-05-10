
import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLanguage } from '@/contexts/LanguageContext';

interface SectionProps {
  id?: string;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  titleCentered?: boolean;
  background?: 'white' | 'light' | 'dark';
  carouselItem?: boolean;
  titleClassName?: string;
  subtitleClassName?: string;
  contentClassName?: string;
  titleKey?: string;
  subtitleKey?: string;
  section?: string;
}

const Section: React.FC<SectionProps> = ({ 
  id, 
  title, 
  subtitle, 
  children, 
  className,
  titleCentered = false,
  background = 'white',
  carouselItem = false,
  titleClassName = '',
  subtitleClassName = '',
  contentClassName = '',
  titleKey,
  subtitleKey,
  section
}) => {
  const isMobile = useIsMobile();
  const { t } = useLanguage();
  
  const bgClasses = {
    'white': 'bg-white',
    'light': 'bg-[#F1F1F1]',
    'dark': 'bg-black text-white',
  };

  // Get translated content if keys are provided
  const translatedTitle = titleKey && section ? t(titleKey, section) : title;
  const translatedSubtitle = subtitleKey && section ? t(subtitleKey, section) : subtitle;

  return (
    <section id={id} className={cn(
      carouselItem ? 'py-3 md:py-6' : 'min-h-[70vh] md:min-h-screen py-8 sm:py-10 md:py-16',
      'flex flex-col justify-center overflow-hidden relative',
      bgClasses[background],
      className
    )}>
      <div className={cn("container-custom flex flex-col justify-center h-full px-3 md:px-6", carouselItem && "h-full")}>
        {(translatedTitle || translatedSubtitle) && (
          <div 
            className={cn(
              'mb-5 sm:mb-6 md:mb-12', 
              titleCentered ? 'text-center max-w-3xl mx-auto' : 'max-w-3xl'
            )}
            data-section-header="true"
          >
            {translatedTitle && (
              <h2 
                className={cn(
                  "text-xl sm:text-2xl md:text-4xl lg:text-5xl font-semibold mb-3 md:mb-6 tracking-tight animate-fade-in",
                  titleClassName,
                  background === 'dark' ? 'text-white' : 'text-[#333333]'
                )}
                data-section-title="true"
              >
                {translatedTitle}
              </h2>
            )}
            {translatedSubtitle && (
              <p 
                className={cn(
                  "text-base sm:text-lg md:text-xl max-w-2xl animate-fade-in mobile-text-base",
                  subtitleClassName,
                  background === 'dark' ? 'text-white/70' : 'text-[#666666]'
                )}
                data-section-subtitle="true"
              > 
                {translatedSubtitle}
              </p>
            )}
          </div>
        )}
        <div className={cn("flex-grow flex flex-col items-center justify-start w-full", contentClassName)} data-section-content="true">
          {children}
        </div>
      </div>
    </section>
  );
};

export default Section;
