
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
    return <IconComponent className="w-5 h-5 stroke-[1.5] text-[#333333]" />;
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
          
          {/* Enhanced card-based grid layout */}
          <div className="max-w-5xl mx-auto">
            <div className="grid gap-6 md:gap-8">
              {services.map((service, index) => (
                <div
                  key={service.id}
                  className="group relative bg-white rounded-2xl border border-[#F2F2F2] hover:border-[#E5E5E5] transition-all duration-300 overflow-hidden hover:shadow-sm"
                >
                  {/* Dotted border decoration - top */}
                  <div className="absolute top-0 left-8 right-8 h-px border-t border-dotted border-[#E5E5E5] opacity-50"></div>
                  
                  <div className="p-8 md:p-10">
                    <div className="flex gap-6 md:gap-8 items-start">
                      {/* Enhanced icon container */}
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-12 h-12 rounded-full bg-[#F8F8F8] border border-[#F2F2F2] flex items-center justify-center group-hover:bg-[#F5F5F5] group-hover:border-[#E5E5E5] transition-all duration-300">
                          {getServiceIcon(index)}
                        </div>
                      </div>
                      
                      {/* Enhanced content */}
                      <div className="flex-grow min-w-0">
                        <h3 className="text-xl md:text-2xl font-semibold tracking-tight text-[#333333] mb-4 group-hover:text-black transition-colors duration-300 leading-tight">
                          {service.title}
                        </h3>
                        <p className="text-[#666666] text-base md:text-lg leading-relaxed max-w-4xl group-hover:text-[#555555] transition-colors duration-300">
                          {service.content}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Dotted border decoration - bottom */}
                  <div className="absolute bottom-0 left-8 right-8 h-px border-b border-dotted border-[#E5E5E5] opacity-50"></div>
                  
                  {/* Subtle gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#FAFAFA] opacity-0 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none"></div>
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
