
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

  // Create mobile-friendly numbered titles
  const getMobileTitle = (index: number) => {
    return (index + 1).toString(); // Returns "1", "2", "3", "4"
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
        {/* Tab Headers with Two-Layer Structure */}
        <div className="relative bg-[#efefef] p-1.5 sm:p-2 rounded-t-2xl">
          {/* Background Layer - Static positioned divs */}
          <div className="absolute inset-1.5 sm:inset-2 flex gap-0.5 sm:gap-1">
            {services.map((_, index) => (
              <div key={index} className="flex-1 h-11 sm:h-12 rounded-xl" />
            ))}
          </div>
          
          {/* Moving Active Tab Indicator */}
          <motion.div
            layoutId="active-tab"
            className="absolute inset-1.5 sm:inset-2 flex gap-0.5 sm:gap-1 pointer-events-none"
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 25
            }}
          >
            <div 
              className="bg-white rounded-xl shadow-sm"
              style={{
                width: `${100 / services.length}%`,
                transform: `translateX(${activeTab * (100 + (2 / services.length))}%)`,
              }}
            />
          </motion.div>
          
          {/* Foreground Layer - Clean Text Buttons */}
          <div className="relative flex gap-0.5 sm:gap-1">
            {services.map((service, index) => (
              <button
                key={service.id}
                onClick={() => setActiveTab(index)}
                className={`
                  flex-1 h-11 sm:h-12 relative transition-all duration-300 rounded-xl font-medium text-sm sm:text-sm md:text-base z-10 px-1 sm:px-2
                  ${activeTab === index 
                    ? 'text-black' 
                    : 'text-gray-600 hover:text-gray-900'
                  }
                  touch-manipulation
                `}
                style={{ minHeight: '44px' }}
              >
                <span className="relative z-10 leading-tight">
                  {/* Show numbers on mobile, full title on larger screens */}
                  <span className="block sm:hidden">{getMobileTitle(index)}</span>
                  <span className="hidden sm:block">{service.title}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Panel - Increased height on mobile */}
        <div className="w-full h-[480px] sm:h-[340px] md:h-[360px] bg-[#efefef] relative">
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
              className="absolute inset-0 p-4 sm:p-6 md:p-8"
            >
              <div className="h-full flex flex-col justify-center">
                <h3 className="text-xl sm:text-xl md:text-2xl lg:text-3xl font-semibold text-black mb-4 sm:mb-4 md:mb-6 leading-tight">
                  {services[activeTab].title}
                </h3>
                <p className="text-gray-700 text-base sm:text-base md:text-lg leading-relaxed">
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
