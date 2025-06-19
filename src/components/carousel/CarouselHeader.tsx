
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const CarouselHeader: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="mb-8 sm:mb-12 md:mb-16 px-4 sm:px-6">
      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold leading-tight">
        {t('home.whatWeCanHelp')}
      </h2>
    </div>
  );
};

export default CarouselHeader;
