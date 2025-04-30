import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';

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

  const handleBack = () => {
    setActiveService(null);
  };

  // If a service is active, show only that service with its content
  if (activeService) {
    const service = services.find(s => s.id === activeService);
    if (!service) return null;

    return (
      <motion.div 
        className="w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Button 
          variant="ghost" 
          onClick={handleBack}
          className="mb-6 text-white/70 hover:text-white hover:bg-white/10"
        >
          <ArrowLeft size={20} className="mr-2" /> Back to all services
        </Button>
        
        <div className="space-y-6">
          <h3 className="text-3xl md:text-4xl font-medium text-white">
            {service.title}
          </h3>
          <p className="text-lg text-white/70 leading-relaxed">
            {service.content}
          </p>
        </div>
      </motion.div>
    );
  }

  // Otherwise, show the grid of services
  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10 rounded-lg overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {services.map((service) => (
        <motion.div
          key={service.id}
          className="bg-black p-12 md:p-16 lg:p-20 flex items-center justify-center cursor-pointer hover:bg-white/5 transition-all duration-300"
          onClick={() => handleServiceClick(service.id)}
          whileHover={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          <h3 className="text-2xl md:text-3xl font-medium text-white text-center">
            {service.title}
          </h3>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default InteractiveServiceGrid;
