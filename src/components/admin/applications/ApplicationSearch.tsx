
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface ApplicationSearchProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  placeholder?: string;
}

const ApplicationSearch: React.FC<ApplicationSearchProps> = ({ 
  searchTerm, 
  setSearchTerm,
  placeholder = "Search applications..." 
}) => {
  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        className="pl-10 h-10 bg-white"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default ApplicationSearch;
