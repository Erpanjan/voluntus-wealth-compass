
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { CarouselItem } from './types';

interface CarouselCardProps {
  section: CarouselItem;
  cardWidth: number;
  isMobile: boolean;
}

const CarouselCard: React.FC<CarouselCardProps> = ({ section, cardWidth, isMobile }) => {
  const { t } = useLanguage();

  return (
    <div
      className="shrink-0 rounded-2xl sm:rounded-3xl bg-white shadow-soft hover:shadow-hover transition-shadow duration-300 relative mobile-card-transition"
      style={{ 
        width: `${cardWidth}px`,
        minHeight: isMobile ? '280px' : '400px'
      }}
    >
      {/* Progress Numbering Badge */}
      <div className={`absolute bg-gray-100 text-gray-700 rounded-full text-xs sm:text-sm font-medium ${
        isMobile ? 'top-3 right-3 px-2 py-1' : 'top-4 right-4 md:top-6 md:right-6 px-3 py-1.5'
      }`}>
        {section.originalIndex + 1}
      </div>
      
      <div className={`h-full flex flex-col ${isMobile ? 'p-4 pt-3' : 'p-6 md:p-8 lg:p-10 pt-4'}`}>
        <h3 className={`font-semibold text-black mb-4 sm:mb-6 leading-tight ${
          isMobile ? 'text-lg pr-6' : 'text-xl md:text-2xl lg:text-3xl pr-8 sm:pr-0'
        }`}>
          {section.title}
        </h3>
        <div className={`text-gray-600 flex-1 ${isMobile ? 'mb-4' : 'mb-6 sm:mb-8'}`}>
          {section.content}
        </div>
        <Button 
          asChild 
          size={isMobile ? "sm" : "lg"}
          className="bg-black/80 hover:bg-black text-white transition-all duration-200 self-start mobile-touch-target"
        >
          <Link to="/services" className="inline-flex items-center">
            {t('home.howWeCanHelp')} <ArrowRight size={isMobile ? 14 : 18} className="ml-2" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default CarouselCard;
