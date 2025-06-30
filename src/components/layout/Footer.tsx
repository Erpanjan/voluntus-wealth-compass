
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white pt-16 pb-8">
      <div className="container-custom">
        <div className="editorial-divider"></div>
        <div className="flex justify-between items-center">
          <p className="text-xs text-gray-400 font-light tracking-wide">
            {t('footer.copyright').replace('{year}', currentYear.toString())}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
