
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RefreshCw, Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ApplicationsFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  onRefresh: () => void;
  isLoading: boolean;
}

const ApplicationsFilter: React.FC<ApplicationsFilterProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onRefresh,
  isLoading
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      {/* Search input */}
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input 
          type="text" 
          placeholder="Search by name or email" 
          className="pl-8" 
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Status filter */}
      <Select 
        value={statusFilter} 
        onValueChange={onStatusFilterChange}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Applications</SelectItem>
          <SelectItem value="submitted">Pending Approval</SelectItem>
          <SelectItem value="approved">Approved</SelectItem>
        </SelectContent>
      </Select>
      
      {/* Refresh button */}
      <Button 
        variant="outline" 
        size="icon" 
        onClick={onRefresh} 
        disabled={isLoading}
      >
        <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        <span className="sr-only">Refresh</span>
      </Button>
    </div>
  );
};

export default ApplicationsFilter;
