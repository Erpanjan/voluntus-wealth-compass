
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const WaitlistFormHeader: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="text-center mb-8 sm:mb-10 md:mb-12">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-4 sm:mb-6 text-[#333333] font-poppins leading-tight">
        {t('contact.title')}
      </h2>
      <p className="text-[#666666] text-base sm:text-lg font-poppins leading-relaxed max-w-xl mx-auto">
        {t('contact.subtitle')}
      </p>
    </div>
  );
};

export default WaitlistFormHeader;
