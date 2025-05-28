
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
      <div className="relative">
        {/* Tab Headers */}
        <div className="flex w-full border-b border-gray-200">
          {services.map((service, index) => (
            <button
              key={service.id}
              onClick={() => setActiveTab(index)}
              className={`
                flex-1 h-12 sm:h-14 relative transition-colors duration-200
                ${activeTab === index 
                  ? 'text-black font-semibold' 
                  : 'text-gray-500 hover:text-gray-700'
                }
              `}
            >
              <span className="text-sm sm:text-base">
                {service.title}
              </span>
              {activeTab === index && (
                <motion.div
                  layoutId="active-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"
                  transition={{
                    type: "spring",
                    bounce: 0.0,
                    duration: 0.4,
                  }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Content Panel */}
        <div className="w-full h-[300px] sm:h-[350px] md:h-[400px] bg-gray-50 overflow-hidden relative">
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
