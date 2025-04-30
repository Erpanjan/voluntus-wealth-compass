
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Tab {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
}

interface TabContentProps {
  tabs: Tab[];
  className?: string;
}

const TabContent: React.FC<TabContentProps> = ({ tabs, className }) => {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || '');

  return (
    <div className={cn("w-full", className)}>
      <Tabs 
        defaultValue={activeTab} 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        {/* Custom Tab Navigation */}
        <div className="relative border-b border-gray-200 mb-8">
          <TabsList className="flex justify-between w-full bg-transparent p-0 h-auto">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                type="button"
                className={cn(
                  "text-base px-1 py-4 bg-transparent relative text-gray-500 hover:text-black transition-colors font-poppins",
                  "data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:bg-transparent",
                  "min-h-[56px] flex-1 text-center" // Fixed height and even distribution
                )}
              >
                {tab.title}
                {activeTab === tab.id && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"
                    layoutId="tabContentIndicator"
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Tab Content */}
        <div className="py-6">
          {tabs.map((tab) => (
            <TabsContent 
              key={tab.id} 
              value={tab.id}
              className="focus-visible:outline-none focus-visible:ring-0"
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h3 className="text-2xl font-semibold font-poppins">{tab.title}</h3>
                {tab.subtitle && (
                  <p className="text-lg font-poppins">{tab.subtitle}</p>
                )}
                <p className="text-gray-700 leading-relaxed font-inter text-base">{tab.description}</p>
              </motion.div>
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
};

export default TabContent;
