
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
        {/* Background layer with moving indicator */}
        <div className="absolute inset-0">
          <div className="flex w-full">
            {services.map((_, index) => (
              <div key={index} className="relative flex-1 h-12 sm:h-14">
                {activeTab === index && (
                  <motion.div
                    layoutId="active-tab"
                    className="absolute inset-0 bg-[#efefef] rounded-t-2xl"
                    transition={{
                      type: "spring",
                      bounce: 0.0,
                      duration: 0.4,
                    }}
                  />
                )}
              </div>
            ))}
          </div>
          
          {/* Content panel */}
          <div className="w-full h-[280px] sm:h-[320px] md:h-[360px] bg-[#efefef] overflow-hidden">
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
                className="p-6 sm:p-8 md:p-10 h-full"
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

        {/* Interactive text overlay (foreground) */}
        <div className="relative flex w-full">
          {services.map((service, index) => (
            <button
              key={service.id}
              onClick={() => setActiveTab(index)}
              className="flex-1 h-12 sm:h-14"
            >
              <span
                className={`
                  w-full h-full flex items-center justify-center font-medium text-sm sm:text-base transition-colors duration-200
                  ${activeTab === index ? 'text-black' : 'text-gray-600'}
                `}
              >
                {service.title}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceTabs;
