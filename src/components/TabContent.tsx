
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
        <div className="relative border-b border-gray-200 mb-6">
          <TabsList className="flex justify-between w-full bg-transparent p-0 h-auto">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                type="button"
                className={cn(
                  "text-base px-1 py-4 bg-transparent relative text-gray-500 hover:text-black transition-colors font-inter",
                  "data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:bg-transparent",
                  "min-h-[56px] flex-1 text-center" // Fixed height and even distribution
                )}
              >
                {tab.title}
                {activeTab === tab.id && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"
                    layoutId="tabContentIndicator"
                    transition={{ duration: 0.2 }}
                  />
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Tab Content with fixed height to prevent jumping */}
        <div className="py-4 min-h-[300px]">
          {tabs.map((tab) => (
            <TabsContent 
              key={tab.id} 
              value={tab.id}
              className="focus-visible:outline-none focus-visible:ring-0"
            >
              <div className="space-y-4">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 font-inter">
                  {tab.title} <span className="font-bold">{tab.subtitle}</span>
                </h3>
                <p className="text-gray-700 leading-relaxed font-inter text-lg md:text-xl">{tab.description}</p>
              </div>
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
};

export default TabContent;
