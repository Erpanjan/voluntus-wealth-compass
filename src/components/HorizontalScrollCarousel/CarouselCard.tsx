
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { CarouselCardProps } from './types';
import { CAROUSEL_CONFIG, CAROUSEL_CLASSES } from './carouselConfig';

const CarouselCard: React.FC<CarouselCardProps> = ({ section, cardWidth, isMobile }) => {
  const { t } = useLanguage();

  return (
    <div
      className={CAROUSEL_CLASSES.card}
      style={{ 
        width: `${cardWidth}px`,
        minHeight: isMobile ? `${CAROUSEL_CONFIG.MOBILE_MIN_HEIGHT}px` : `${CAROUSEL_CONFIG.WEB_MIN_HEIGHT}px`,
        scrollSnapAlign: 'center',
        scrollSnapStop: 'always'
      }}
    >
      {/* Enhanced Progress Numbering Badge */}
      <div className={`${CAROUSEL_CLASSES.badge} ${
        isMobile ? 'top-4 right-4 px-3 py-2 text-sm' : 'top-6 right-6 px-4 py-2 text-base'
      }`}>
        {section.originalIndex + 1}
      </div>
      
      <div className={`h-full flex flex-col ${isMobile ? 'p-6 pt-5' : 'p-8 md:p-10 lg:p-12'}`}>
        <h3 className={`font-bold text-black mb-6 sm:mb-8 leading-tight ${
          isMobile ? 'text-xl pr-12' : 'text-2xl md:text-3xl lg:text-4xl pr-16'
        }`}>
          {section.title}
        </h3>
        <div className={`flex-1 ${isMobile ? 'mb-6' : 'mb-8'}`}>
          {section.content}
        </div>
        <Button 
          asChild 
          size={isMobile ? "default" : "lg"}
          className={CAROUSEL_CLASSES.button}
        >
          <Link to="/services" className="inline-flex items-center font-medium">
            {t('home.howWeCanHelp')} <ArrowRight size={isMobile ? 16 : 20} className="ml-3" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default CarouselCard;
