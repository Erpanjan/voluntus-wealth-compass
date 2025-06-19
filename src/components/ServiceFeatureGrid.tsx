
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
    return <IconComponent className="w-6 h-6 stroke-1.5 text-[#333333]" />;
  };

  return (
    <div className="w-full py-6 md:py-8">
      <div className="container-custom mx-auto px-6 md:px-8 lg:px-0">
        <div className="flex flex-col gap-8">
          <div className="flex gap-4 flex-col items-start max-w-3xl">
            <div className="flex gap-2 flex-col">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-[#333333] tracking-tight max-w-xl text-left leading-tight">
                {t('services.whatsIncluded')}
              </h2>
            </div>
          </div>
          
          {/* Clean vertical list layout */}
          <div className="max-w-4xl">
            <div className="space-y-0">
              {services.map((service, index) => (
                <div
                  key={service.id}
                  className="group border-b border-[#F2F2F2] last:border-b-0 py-8 first:pt-4 last:pb-4 hover:bg-[#FAFAFA] transition-all duration-300 cursor-default"
                >
                  <div className="flex gap-6 items-start">
                    {/* Icon */}
                    <div className="flex-shrink-0 mt-1">
                      {getServiceIcon(index)}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-grow min-w-0">
                      <h3 className="text-xl md:text-2xl font-semibold tracking-tight text-[#333333] mb-3 group-hover:text-black transition-colors duration-300">
                        {service.title}
                      </h3>
                      <p className="text-[#666666] text-base md:text-lg leading-relaxed max-w-3xl">
                        {service.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceFeatureGrid;
