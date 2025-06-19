
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
    return <IconComponent className="w-8 h-8 stroke-1 text-brand-black-olive" />;
  };

  return (
    <div className="w-full py-6 md:py-8">
      <div className="container-custom mx-auto px-6 md:px-8 lg:px-0">
        <div className="flex flex-col gap-8">
          <div className="flex gap-4 flex-col items-start max-w-3xl">
            <div className="flex gap-2 flex-col">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-brand-black-olive tracking-tight max-w-xl text-left leading-tight">
                {t('services.whatsIncluded')}
              </h2>
            </div>
          </div>
          
          {/* Balanced 2x2 grid layout with brand colors */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {/* Investment Service */}
            <div className="bg-brand-white-smoke rounded-3xl p-6 sm:p-8 min-h-[280px] flex flex-col shadow-soft hover:shadow-hover transition-all duration-300 border border-brand-silver/30">
              <div className="mb-6">
                {getServiceIcon(0)}
              </div>
              <div className="flex flex-col flex-grow">
                <h3 className="text-xl font-semibold tracking-tight text-brand-black-olive mb-3 min-h-[28px]">
                  {services[0]?.title}
                </h3>
                <p className="text-brand-gray text-base leading-relaxed">
                  {services[0]?.content}
                </p>
              </div>
            </div>

            {/* Advisor Service */}
            <div className="bg-brand-white-smoke rounded-3xl p-6 sm:p-8 min-h-[280px] flex flex-col shadow-soft hover:shadow-hover transition-all duration-300 border border-brand-silver/30">
              <div className="mb-6">
                {getServiceIcon(1)}
              </div>
              <div className="flex flex-col flex-grow">
                <h3 className="text-xl font-semibold tracking-tight text-brand-black-olive mb-3 min-h-[28px]">
                  {services[1]?.title}
                </h3>
                <p className="text-brand-gray text-base leading-relaxed">
                  {services[1]?.content}
                </p>
              </div>
            </div>

            {/* Risk Service */}
            <div className="bg-brand-white-smoke rounded-3xl p-6 sm:p-8 min-h-[280px] flex flex-col shadow-soft hover:shadow-hover transition-all duration-300 border border-brand-silver/30">
              <div className="mb-6">
                {getServiceIcon(2)}
              </div>
              <div className="flex flex-col flex-grow">
                <h3 className="text-xl font-semibold tracking-tight text-brand-black-olive mb-3 min-h-[28px]">
                  {services[2]?.title}
                </h3>
                <p className="text-brand-gray text-base leading-relaxed">
                  {services[2]?.content}
                </p>
              </div>
            </div>

            {/* Policy Service */}
            <div className="bg-brand-white-smoke rounded-3xl p-6 sm:p-8 min-h-[280px] flex flex-col shadow-soft hover:shadow-hover transition-all duration-300 border border-brand-silver/30">
              <div className="mb-6">
                {getServiceIcon(3)}
              </div>
              <div className="flex flex-col flex-grow">
                <h3 className="text-xl font-semibold tracking-tight text-brand-black-olive mb-3 min-h-[28px]">
                  {services[3]?.title}
                </h3>
                <p className="text-brand-gray text-base leading-relaxed">
                  {services[3]?.content}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceFeatureGrid;
