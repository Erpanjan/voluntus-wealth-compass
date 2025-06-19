
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { InfiniteSection } from './types';

interface CarouselCardProps {
  section: InfiniteSection;
  cardWidth: number;
  isMobile: boolean;
}

const CarouselCard: React.FC<CarouselCardProps> = ({ section, cardWidth, isMobile }) => {
  const { t } = useLanguage();

  return (
    <div
      key={section.id}
      className="shrink-0 rounded-3xl bg-white shadow-lg hover:shadow-xl transition-all duration-500 relative premium-card"
      style={{ 
        width: `${cardWidth}px`,
        minHeight: isMobile ? '420px' : '500px',
        scrollSnapAlign: 'center',
        scrollSnapStop: 'always'
      }}
    >
      {/* Enhanced Progress Numbering Badge */}
      <div className={`absolute bg-gradient-to-r from-gray-100 to-gray-50 text-gray-800 rounded-full font-semibold shadow-sm ${
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
          className="bg-black hover:bg-gray-900 text-white transition-all duration-300 self-start shadow-md hover:shadow-lg transform hover:scale-[1.02]"
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
