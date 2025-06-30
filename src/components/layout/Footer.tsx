
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white py-8 border-t border-gray-100">
      <div className="container-custom">
        <div className="flex justify-between items-start">
          <p className="text-xs text-gray-400 font-light uppercase tracking-wider">
            {t('footer.copyright').replace('{year}', currentYear.toString())}
          </p>

          <div className="max-w-2xl text-right">
            <p className="text-xs text-gray-300 font-light leading-loose">
              {t('footer.disclaimer')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
