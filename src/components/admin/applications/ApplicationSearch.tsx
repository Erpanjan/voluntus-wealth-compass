
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface ApplicationSearchProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

const ApplicationSearch: React.FC<ApplicationSearchProps> = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="relative w-64">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search applications..."
        className="pl-8"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default ApplicationSearch;
