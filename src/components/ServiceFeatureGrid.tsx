
import React from 'react';
import { User, TrendingUp, Shield, FileText, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';

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
    return <IconComponent className="w-6 h-6 stroke-1 text-brand-accent" />;
  };

  return (
    <div className="w-full py-8 md:py-12">
      <div className="container-custom mx-auto px-6 md:px-8 lg:px-0">
        <div className="flex flex-col gap-8 md:gap-12">
          {/* Header Section */}
          <div className="flex gap-4 flex-col items-start max-w-4xl">
            <div className="flex gap-2 flex-col">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-brand-accent tracking-tight max-w-3xl text-left leading-tight">
                {t('services.whatsIncluded')}
              </h2>
              <p className="text-base sm:text-lg text-brand-gray mt-4 max-w-2xl">
                Our comprehensive approach to financial planning combines personalized advisory with innovative technology to support your financial journey.
              </p>
            </div>
          </div>
          
          {/* Services Accordion */}
          <div className="max-w-4xl w-full">
            <Accordion type="single" collapsible className="w-full space-y-3">
              {services.map((service, index) => (
                <AccordionItem 
                  key={service.id} 
                  value={service.id}
                  className="border border-brand-secondary/30 bg-brand-primary rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <AccordionTrigger className="px-6 sm:px-8 py-6 hover:no-underline group">
                    <div className="flex items-center gap-4 text-left w-full">
                      <div className="flex-shrink-0 p-3 bg-brand-secondary rounded-xl group-hover:bg-brand-secondary/80 transition-colors duration-300">
                        {getServiceIcon(index)}
                      </div>
                      <div className="flex flex-col items-start flex-grow">
                        <span className="text-lg sm:text-xl font-semibold text-brand-accent group-hover:text-brand-accent/80 transition-colors duration-300">
                          {service.title}
                        </span>
                        <span className="text-sm text-brand-gray mt-1">
                          Click to learn more
                        </span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 sm:px-8 pb-6 pt-0">
                    <div className="pl-16 pr-4">
                      <p className="text-base leading-relaxed text-brand-gray">
                        {service.content}
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Bottom CTA */}
          <div className="flex justify-center pt-6">
            <div className="text-center max-w-lg">
              <p className="text-brand-gray text-base">
                Ready to get started? Join our waitlist to be among the first to experience our comprehensive financial planning platform.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceFeatureGrid;
