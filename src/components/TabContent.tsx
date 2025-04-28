
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Tab {
  id: string;
  label: string;
  content: string;
}

interface TabContentProps {
  tabs: Tab[];
  className?: string;
}

const TabContent: React.FC<TabContentProps> = ({ tabs, className }) => {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || '');

  return (
    <div className={cn("w-full", className)}>
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-8">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? 'default' : 'outline'}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "rounded-full",
              activeTab === tab.id ? 'bg-voluntus-blue text-white' : 'bg-white'
            )}
          >
            {tab.label}
          </Button>
        ))}
      </div>
      
      {/* Tab Content */}
      <div className="bg-white rounded-xl p-8 shadow-sm min-h-[200px]">
        {tabs.map((tab) => (
          <div 
            key={tab.id} 
            className={cn(
              'transition-opacity duration-300',
              activeTab === tab.id ? 'block opacity-100' : 'hidden opacity-0'
            )}
          >
            <p className="text-voluntus-text-secondary leading-relaxed">{tab.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabContent;
