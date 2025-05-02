
import React from 'react';
import { SearchBar } from '@/components/admin/users/SearchBar';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface UserFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export const UserFilter: React.FC<UserFilterProps> = ({
  searchQuery,
  onSearchChange,
  onRefresh,
  isLoading
}) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <h1 className="text-2xl font-bold">User Account Management</h1>
      <div className="flex gap-2">
        <SearchBar 
          searchQuery={searchQuery} 
          onSearchChange={onSearchChange}
          onRefresh={onRefresh}
        />
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRefresh} 
          className="flex items-center gap-1"
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
    </div>
  );
};
