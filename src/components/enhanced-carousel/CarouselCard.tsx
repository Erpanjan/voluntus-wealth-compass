
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface ContentSection {
  id: string;
  title: string;
  content: React.ReactNode;
  originalIndex: number;
}

interface CarouselCardProps {
  section: ContentSection;
  isMobile: boolean;
}

const CarouselCard: React.FC<CarouselCardProps> = ({ section, isMobile }) => {
  const { t } = useLanguage();

  return (
    <div className="w-full h-full flex justify-center">
      <div 
        className={`bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 relative ${
          isMobile 
            ? 'w-[90vw] min-h-[400px] mx-4' 
            : 'w-full max-w-[800px] min-h-[500px] mx-6'
        }`}
      >
        <div className={`h-full flex flex-col ${
          isMobile ? 'p-6' : 'p-8 lg:p-12'
        }`}>
          <h3 className={`font-semibold text-gray-900 mb-6 leading-tight ${
            isMobile ? 'text-xl' : 'text-2xl lg:text-3xl xl:text-4xl'
          }`}>
            {section.title}
          </h3>
          
          <div className={`text-gray-600 flex-1 mb-8 ${
            isMobile ? 'text-base leading-7' : 'text-lg lg:text-xl leading-8'
          }`}>
            {section.content}
          </div>
          
          <Button 
            asChild 
            size={isMobile ? "default" : "lg"}
            className="bg-gray-900 hover:bg-black text-white transition-all duration-200 self-start"
          >
            <Link to="/services" className="inline-flex items-center">
              {t('home.howWeCanHelp')} 
              <ArrowRight size={isMobile ? 16 : 20} className="ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CarouselCard;
