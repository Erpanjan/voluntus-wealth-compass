
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabContentProps {
  tabs: Tab[];
  className?: string;
}

const TabContent: React.FC<TabContentProps> = ({ tabs, className }) => {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || '');

  return (
    <div className={cn("w-full max-w-4xl mx-auto", className)} data-testid="tab-content-component">
      {/* Tab Navigation */}
      <div className="flex overflow-x-auto flex-wrap md:flex-nowrap gap-2 md:gap-8 border-b border-gray-200 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "text-md md:text-lg font-normal py-3 px-4 transition-all relative whitespace-nowrap",
              activeTab === tab.id 
                ? "text-black font-medium" 
                : "text-gray-400 hover:text-black/70"
            )}
            aria-selected={activeTab === tab.id}
            role="tab"
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div 
                className="absolute bottom-0 left-0 w-full h-0.5 bg-black"
                layoutId="valueTabUnderline"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>
      
      {/* Tab Content */}
      <div className="min-h-[300px] px-2">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={activeTab === tab.id ? "block" : "hidden"}
            role="tabpanel"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1,
                y: 0
              }}
              transition={{ duration: 0.3 }}
            >
              {tab.content}
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabContent;
