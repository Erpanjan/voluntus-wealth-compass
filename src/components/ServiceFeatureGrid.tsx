
import React from 'react';
import { User, TrendingUp, Shield, FileText } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ServiceItem {
  id: string;
  title: string;
  content: string;
}

interface ServiceFeatureGridProps {
  services: ServiceItem[];
}

const ServiceFeatureGrid: React.FC<ServiceFeatureGridProps> = ({ services }) => {
  const { t } = useLanguage();

  // Define icons for each service position
  const getServiceIcon = (index: number) => {
    const icons = [
      TrendingUp, // Investment Solution
      User,       // Dedicated Advisor
      Shield,     // Risk Management
      FileText    // Policy Keeping
    ];
    const IconComponent = icons[index] || User;
    return <IconComponent className="w-4 h-4 stroke-1 text-black" />;
  };

  return (
    <div className="w-full">
      <div className="container-custom mx-auto">
        <div className="flex flex-col">
          {/* Editorial title section */}
          <div className="editorial-spacing-large">
            <h2 className="font-light tracking-wide leading-tight max-w-3xl">
              {t('services.whatsIncluded')}
            </h2>
          </div>
          
          {/* Editorial vertical layout */}
          <div className="max-w-4xl">
            <div className="space-y-16 md:space-y-24">
              {services.map((service, index) => (
                <article
                  key={service.id}
                  className="group border-b border-gray-200 pb-16 last:border-b-0 last:pb-0"
                >
                  {/* Editorial layout with minimal icon */}
                  <div className="flex items-start gap-6 md:gap-8">
                    {/* Minimal icon */}
                    <div className="flex-shrink-0 mt-2">
                      <div className="w-8 h-8 flex items-center justify-center">
                        {getServiceIcon(index)}
                      </div>
                    </div>
                    
                    {/* Editorial content */}
                    <div className="flex-grow min-w-0">
                      <h3 className="text-2xl md:text-3xl font-normal tracking-wide text-black mb-6 leading-tight">
                        {service.title}
                      </h3>
                      <p className="text-base md:text-lg font-light text-gray-600 leading-relaxed max-w-3xl">
                        {service.content}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceFeatureGrid;
