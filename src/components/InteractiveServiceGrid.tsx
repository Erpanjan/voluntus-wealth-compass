
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ServiceItem {
  id: string;
  title: string;
  content: string;
}

interface InteractiveServiceGridProps {
  services: ServiceItem[];
}

const InteractiveServiceGrid: React.FC<InteractiveServiceGridProps> = ({ services }) => {
  const [activeService, setActiveService] = useState<string>(services[0]?.id || '');
  
  return (
    <div className="w-full relative space-y-8 max-w-4xl mx-auto" data-testid="service-grid-component">
      {/* Tab-like navigation */}
      <div className="flex overflow-x-auto flex-wrap md:flex-nowrap gap-2 md:gap-8 border-b border-gray-200">
        {services.map((service) => (
          <button
            key={service.id}
            onClick={() => setActiveService(service.id)}
            className={cn(
              "text-md md:text-lg font-normal py-3 px-4 transition-all relative",
              "whitespace-nowrap flex-grow md:flex-grow-0",
              activeService === service.id 
                ? "text-black font-medium" 
                : "text-gray-400 hover:text-black/70"
            )}
            aria-selected={activeService === service.id}
            role="tab"
            type="button"
          >
            {service.title}
            {activeService === service.id && (
              <motion.div 
                className="absolute bottom-0 left-0 w-full h-0.5 bg-black"
                layoutId="serviceTabUnderline"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Content area */}
      <div className="min-h-[300px] px-2">
        {services.map((service) => (
          <div
            key={service.id}
            className={activeService === service.id ? "block" : "hidden"}
            role="tabpanel"
          >
            {activeService === service.id && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1,
                  y: 0
                }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-black/80 leading-relaxed text-lg">
                  {service.content}
                </p>
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InteractiveServiceGrid;
