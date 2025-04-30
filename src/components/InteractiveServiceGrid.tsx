
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
    <div className="w-full relative space-y-12">
      {/* Tab-like navigation */}
      <div className="flex flex-wrap md:flex-nowrap border-b border-black/10">
        {services.map((service, index) => (
          <button
            key={service.id}
            onClick={() => setActiveService(service.id)}
            className={cn(
              "text-lg md:text-xl font-normal py-3 px-6 transition-all relative",
              "whitespace-nowrap flex-grow md:flex-grow-0 text-center md:text-left",
              activeService === service.id 
                ? "text-black font-medium" 
                : "text-gray-400 hover:text-black/70"
            )}
          >
            {service.title}
            {activeService === service.id && (
              <motion.div 
                className="absolute bottom-0 left-0 w-full h-0.5 bg-black"
                layoutId="underline"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Content area */}
      <div className="min-h-[300px]">
        {services.map((service) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: activeService === service.id ? 1 : 0,
              y: activeService === service.id ? 0 : 20,
              pointerEvents: activeService === service.id ? 'auto' : 'none',
              position: activeService === service.id ? 'relative' : 'absolute',
              display: activeService === service.id ? 'block' : 'none'
            }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <p className="text-black/90 leading-relaxed text-lg">
              {service.content}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default InteractiveServiceGrid;
