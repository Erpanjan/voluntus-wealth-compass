
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface FilterTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  counts: {
    all: number;
    new: number;
    responded: number;
    closed: number;
  };
}

const FilterTabs: React.FC<FilterTabsProps> = ({ activeTab, setActiveTab, counts }) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-4 w-full">
        <TabsTrigger value="all" className="relative">
          All
          <span className="ml-1 text-xs bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded-full">
            {counts.all}
          </span>
        </TabsTrigger>
        <TabsTrigger value="new" className="relative">
          New
          <span className="ml-1 text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">
            {counts.new}
          </span>
        </TabsTrigger>
        <TabsTrigger value="responded" className="relative">
          Responded
          <span className="ml-1 text-xs bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded-full">
            {counts.responded}
          </span>
        </TabsTrigger>
        <TabsTrigger value="closed" className="relative">
          Closed
          <span className="ml-1 text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">
            {counts.closed}
          </span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default FilterTabs;
