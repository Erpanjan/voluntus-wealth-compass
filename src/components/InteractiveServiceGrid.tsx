
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Separator } from './ui/separator';

interface ServiceItem {
  id: string;
  title: string;
  content: string;
}

interface InteractiveServiceGridProps {
  services: ServiceItem[];
}

const InteractiveServiceGrid: React.FC<InteractiveServiceGridProps> = ({ services }) => {
  const [activeService, setActiveService] = useState<string | null>(null);
  
  const handleServiceClick = (serviceId: string) => {
    if (activeService === serviceId) {
      setActiveService(null); // Close if already active
    } else {
      setActiveService(serviceId); // Open the clicked service
    }
  };

  return (
    <div className="w-full relative">
      {/* Fixed position container with absolute positioning for active service */}
      {activeService && (
        <motion.div 
          className="absolute w-full z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          onClick={() => setActiveService(null)}
        >
          <div className="space-y-6 p-12 md:p-16 lg:p-20 border border-black/10 rounded-lg bg-white shadow-sm">
            <h3 className="text-2xl md:text-3xl font-normal text-[#333333] tracking-tight font-inter">
              {services.find(s => s.id === activeService)?.title}
            </h3>
            <Separator className="bg-black/10" />
            <p className="text-lg leading-relaxed font-inter font-light text-[#666666]">
              {services.find(s => s.id === activeService)?.content}
            </p>
            <p className="text-sm text-[#999999] italic mt-8 font-inter">Click anywhere to go back</p>
          </div>
        </motion.div>
      )}

      {/* Grid always remains in the DOM with visibility controlled */}
      <motion.div 
        className={cn(
          "grid grid-cols-1 md:grid-cols-2 gap-px rounded-lg overflow-hidden border border-[#EEEEEE]",
          activeService ? "opacity-0 pointer-events-none" : "opacity-100"
        )}
        initial={{ opacity: 0 }}
        animate={{ opacity: activeService ? 0 : 1 }}
        transition={{ duration: 0.4 }}
      >
        {services.map((service, index) => (
          <React.Fragment key={service.id}>
            <motion.div
              className={cn(
                "bg-transparent p-8 md:p-10 lg:p-12 flex items-center justify-center cursor-pointer hover:bg-[#F9F9F9] transition-all duration-300",
                "relative", // Position for borders
                {
                  "border-r border-[#EEEEEE]": index % 2 === 0 && index !== services.length - 1 && services.length > 1,
                  "border-b border-[#EEEEEE]": index < services.length - 2 || (services.length % 2 === 1 && index === services.length - 2)
                }
              )}
              onClick={() => handleServiceClick(service.id)}
              whileHover={{ scale: 0.99 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-xl md:text-2xl font-light text-[#333333] text-center tracking-tight font-inter">
                {service.title}
              </h3>
            </motion.div>
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
};

export default InteractiveServiceGrid;
