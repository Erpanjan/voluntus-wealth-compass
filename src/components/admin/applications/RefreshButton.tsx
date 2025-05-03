
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
    >
      <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
      Refresh
    </Button>
  );
};

export default RefreshButton;
