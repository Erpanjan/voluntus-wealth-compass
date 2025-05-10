
import React from 'react';
import { Link } from 'react-router-dom';
import { Separator } from "@/components/ui/separator";
import { useLanguage } from '@/contexts/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <footer className="bg-white pt-4 pb-3 border-t border-gray-100">
      <div className="container-custom">
        <Separator className="my-3 bg-gray-100" />
        
        {/* Footer Bottom Section */}
        <div className="flex justify-between items-center pt-2">
          <p className="text-xs text-gray-500 font-light">
            {t('copyright')}
          </p>

          {/* Disclaimer Text - Hidden in smaller screens, visible in larger ones */}
          <div className="hidden md:block max-w-3xl">
            <p className="text-[10px] text-gray-400 font-light">
              {t('disclaimer')}
            </p>
          </div>
        </div>
        
        {/* Full disclaimer on mobile - hidden on larger screens */}
        <div className="mt-4 pt-2 md:hidden">
          <p className="text-[10px] leading-relaxed text-gray-400 max-w-5xl font-light">
            {t('disclaimer_extended')}
          </p>
          <p className="text-[10px] leading-relaxed text-gray-400 mt-2 max-w-5xl font-light">
            {t('disclaimer_returns')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
