import React from 'react';
import { User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
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

  return (
    <div className="w-full py-16 md:py-24">
      <div className="container-custom mx-auto px-6 md:px-8 lg:px-0">
        <div className="flex flex-col gap-10">
          <div className="flex gap-4 flex-col items-start max-w-3xl">
            <div>
              <Badge className="bg-[#F2F2F2] text-[#333333] hover:bg-[#E5E5E5] border-0">
                {t('services.whatsIncluded')}
              </Badge>
            </div>
            <div className="flex gap-2 flex-col">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-[#333333] tracking-tight max-w-xl text-left leading-tight">
                {t('services.whatsIncluded')}
              </h2>
              <p className="text-base sm:text-lg md:text-lg max-w-xl lg:max-w-lg leading-relaxed text-[#666666] text-left">
                Comprehensive financial planning services designed to help you achieve your goals.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Investment Service - spans 2 columns on desktop */}
            <div className="bg-[#F2F2F2] rounded-3xl h-full lg:col-span-2 p-6 sm:p-8 aspect-square lg:aspect-auto flex justify-between flex-col shadow-soft hover:shadow-hover transition-all duration-300">
              <User className="w-8 h-8 stroke-1 text-[#666666]" />
              <div className="flex flex-col">
                <h3 className="text-xl font-semibold tracking-tight text-[#333333] mb-3">
                  {services[0]?.title}
                </h3>
                <p className="text-[#666666] max-w-xs text-base leading-relaxed">
                  {services[0]?.content}
                </p>
              </div>
            </div>

            {/* Advisor Service */}
            <div className="bg-[#F2F2F2] rounded-3xl aspect-square p-6 sm:p-8 flex justify-between flex-col shadow-soft hover:shadow-hover transition-all duration-300">
              <User className="w-8 h-8 stroke-1 text-[#666666]" />
              <div className="flex flex-col">
                <h3 className="text-xl font-semibold tracking-tight text-[#333333] mb-3">
                  {services[1]?.title}
                </h3>
                <p className="text-[#666666] max-w-xs text-base leading-relaxed">
                  {services[1]?.content}
                </p>
              </div>
            </div>

            {/* Risk Service */}
            <div className="bg-[#F2F2F2] rounded-3xl aspect-square p-6 sm:p-8 flex justify-between flex-col shadow-soft hover:shadow-hover transition-all duration-300">
              <User className="w-8 h-8 stroke-1 text-[#666666]" />
              <div className="flex flex-col">
                <h3 className="text-xl font-semibold tracking-tight text-[#333333] mb-3">
                  {services[2]?.title}
                </h3>
                <p className="text-[#666666] max-w-xs text-base leading-relaxed">
                  {services[2]?.content}
                </p>
              </div>
            </div>

            {/* Policy Service - spans 2 columns on desktop */}
            <div className="bg-[#F2F2F2] rounded-3xl h-full lg:col-span-2 p-6 sm:p-8 aspect-square lg:aspect-auto flex justify-between flex-col shadow-soft hover:shadow-hover transition-all duration-300">
              <User className="w-8 h-8 stroke-1 text-[#666666]" />
              <div className="flex flex-col">
                <h3 className="text-xl font-semibold tracking-tight text-[#333333] mb-3">
                  {services[3]?.title}
                </h3>
                <p className="text-[#666666] max-w-xs text-base leading-relaxed">
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
