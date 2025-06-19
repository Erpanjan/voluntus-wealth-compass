
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { InfiniteSection } from './types';

interface CarouselCardProps {
  section: InfiniteSection;
  isMobile: boolean;
}

const CarouselCard: React.FC<CarouselCardProps> = ({ section, isMobile }) => {
  const { t } = useLanguage();

  return (
    <div
      data-carousel-card
      className="shrink-0 rounded-2xl bg-white border border-gray-100 hover:border-gray-200 transition-all duration-300 relative group hover:shadow-sm"
      style={{ 
        width: isMobile ? 'calc(100vw - 3rem)' : 'min(45vw, 580px)',
        minHeight: isMobile ? '380px' : '420px',
        scrollSnapAlign: 'center',
        scrollSnapStop: 'always'
      }}
    >
      {/* Progress Badge - Redesigned as elegant indicator */}
      <div className={cn(
        "absolute bg-gray-900 text-white rounded-full font-medium flex items-center justify-center transition-all duration-300 group-hover:bg-black",
        isMobile ? 'top-5 right-5 w-8 h-8 text-sm' : 'top-6 right-6 w-10 h-10 text-base'
      )}>
        {section.originalIndex + 1}
      </div>
      
      <div className={cn(
        "h-full flex flex-col justify-between",
        isMobile ? 'p-6 pt-5' : 'p-8'
      )}>
        {/* Content Section */}
        <div className="flex-grow">
          <h3 className={cn(
            "font-semibold text-gray-900 mb-6 leading-tight pr-12",
            isMobile ? 'text-lg' : 'text-xl md:text-2xl'
          )}>
            {section.title}
          </h3>
          
          <div className={cn("text-gray-600 leading-relaxed", isMobile ? 'text-sm' : 'text-base')}>
            {section.content}
          </div>
        </div>
        
        {/* CTA Button - Fixed positioning */}
        <div className={cn("pt-6 border-t border-gray-50", isMobile ? 'mt-6' : 'mt-8')}>
          <Button 
            asChild 
            size={isMobile ? "sm" : "default"}
            className="bg-gray-900 hover:bg-black text-white transition-all duration-200 font-medium group/btn"
          >
            <Link to="/services" className="inline-flex items-center">
              {t('home.howWeCanHelp')} 
              <ArrowRight 
                size={isMobile ? 14 : 16} 
                className="ml-2 transition-transform duration-200 group-hover/btn:translate-x-0.5" 
              />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CarouselCard;
