
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
      className="shrink-0 rounded-2xl sm:rounded-3xl bg-white shadow-soft hover:shadow-hover transition-all duration-300 relative mobile-card-transition group"
      style={{ 
        width: `${cardWidth}px`,
        minHeight: isMobile ? '320px' : '440px'
      }}
    >
      {/* Enhanced Progress Badge */}
      <Badge 
        variant="secondary"
        className={`absolute bg-gray-900 text-white rounded-full font-semibold shadow-sm ${
          isMobile ? 'top-4 right-4 px-3 py-1.5 text-xs' : 'top-6 right-6 px-4 py-2 text-sm'
        }`}
      >
        {String(section.originalIndex + 1).padStart(2, '0')} / {String(5).padStart(2, '0')}
      </Badge>
      
      <div className={`h-full flex flex-col ${isMobile ? 'p-5 pt-4' : 'p-8 md:p-10 lg:p-12 pt-6'}`}>
        {/* Enhanced Title */}
        <h3 className={`font-semibold text-black mb-4 leading-tight tracking-tight ${
          isMobile 
            ? 'text-xl pr-16 mb-6' 
            : 'text-2xl md:text-3xl lg:text-4xl pr-20 sm:pr-0 mb-8'
        }`}>
          {section.title}
        </h3>
        
        {/* Content Divider */}
        <div className={`w-12 h-0.5 bg-gray-200 ${isMobile ? 'mb-5' : 'mb-6'}`} />
        
        {/* Enhanced Content */}
        <div className={`text-gray-600 flex-1 space-y-4 ${
          isMobile ? 'mb-6 text-sm leading-6' : 'mb-8 text-base leading-7'
        }`}>
          {section.content}
        </div>
        
        {/* Enhanced CTA Button */}
        <Button 
          asChild 
          size={isMobile ? "default" : "lg"}
          className="bg-black hover:bg-gray-800 text-white transition-all duration-300 self-start group-hover:shadow-lg transform group-hover:-translate-y-0.5 mobile-touch-target"
        >
          <Link to="/services" className="inline-flex items-center font-medium">
            {t('home.howWeCanHelp')} 
            <ArrowRight 
              size={isMobile ? 16 : 18} 
              className="ml-2 transition-transform group-hover:translate-x-1" 
            />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default CarouselCard;
