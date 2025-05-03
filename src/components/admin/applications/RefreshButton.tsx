
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface RefreshButtonProps {
  isRefreshing: boolean;
  handleRefresh: () => void;
}

const RefreshButton: React.FC<RefreshButtonProps> = ({ isRefreshing, handleRefresh }) => {
  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleRefresh}
      disabled={isRefreshing}
      className="transition-all border-gray-300 hover:border-gray-400 hover:bg-gray-50"
    >
      <RefreshCw className={`mr-2 h-4 w-4 transition-all ${isRefreshing ? 'animate-spin text-gray-600' : 'text-gray-500'}`} />
      {isRefreshing ? 'Refreshing...' : 'Refresh'}
    </Button>
  );
};

export default RefreshButton;
