
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface RefreshButtonProps {
  onRefresh: () => void;
  isRefreshing: boolean;
}

const RefreshButton: React.FC<RefreshButtonProps> = ({ onRefresh, isRefreshing }) => {
  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={onRefresh}
      disabled={isRefreshing}
    >
      <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
      Refresh
    </Button>
  );
};

export default RefreshButton;
