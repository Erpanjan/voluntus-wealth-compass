
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

  // If a service is active, show only that service with its content
  if (activeService) {
    const service = services.find(s => s.id === activeService);
    if (!service) return null;

    return (
      <motion.div 
        className="w-full cursor-pointer"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        onClick={() => setActiveService(null)}
      >
        <div className="space-y-6 p-12 md:p-16 lg:p-20 border border-black/80 rounded-lg bg-white">
          <h3 className="text-3xl md:text-4xl font-medium text-black">
            {service.title}
          </h3>
          <Separator className="bg-black/80" />
          <p className="text-lg text-black leading-relaxed">
            {service.content}
          </p>
          <p className="text-sm text-black/60 italic mt-8">Click anywhere to go back</p>
        </div>
      </motion.div>
    );
  }

  // Otherwise, show the grid of services
  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 gap-px rounded-lg overflow-hidden border border-black/90"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {services.map((service, index) => (
        <React.Fragment key={service.id}>
          <motion.div
            className={cn(
              "bg-transparent p-12 md:p-16 lg:p-20 flex items-center justify-center cursor-pointer hover:bg-black/5 transition-all duration-300",
              "relative", // Position for borders
              {
                "border-r border-black": index % 2 === 0 && index !== services.length - 1 && services.length > 1,
                "border-b border-black": index < services.length - 2 || (services.length % 2 === 1 && index === services.length - 2)
              }
            )}
            onClick={() => handleServiceClick(service.id)}
            whileHover={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-2xl md:text-3xl font-medium text-black text-center">
              {service.title}
            </h3>
          </motion.div>
        </React.Fragment>
      ))}
    </motion.div>
  );
};

export default InteractiveServiceGrid;
