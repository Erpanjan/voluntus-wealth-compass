
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface ServiceItem {
  id: string;
  title: string;
  content: string;
}

interface ServiceTabsProps {
  services: ServiceItem[];
}

const ServiceTabs: React.FC<ServiceTabsProps> = ({ services }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
        {/* Tab Headers */}
        <div className="flex bg-gray-50 p-2 gap-1">
          {services.map((service, index) => (
            <button
              key={service.id}
              onClick={() => setActiveTab(index)}
              className={`
                flex-1 h-10 sm:h-12 relative transition-all duration-300 rounded-xl font-medium text-sm sm:text-base
                ${activeTab === index 
                  ? 'bg-white text-black shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }
              `}
            >
              <span className="relative z-10">
                {service.title}
              </span>
            </button>
          ))}
        </div>

        {/* Content Panel */}
        <div className="w-full h-[280px] sm:h-[320px] md:h-[360px] bg-white relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{
                opacity: 0,
                y: 20,
                filter: "blur(4px)",
              }}
              animate={{
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
              }}
              exit={{
                opacity: 0,
                y: -20,
                filter: "blur(4px)",
              }}
              transition={{
                duration: 0.3,
                ease: "easeOut",
              }}
              className="absolute inset-0 p-6 sm:p-8 md:p-10"
            >
              <div className="h-full flex flex-col justify-center">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-black mb-4 sm:mb-6">
                  {services[activeTab].title}
                </h3>
                <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                  {services[activeTab].content}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ServiceTabs;
