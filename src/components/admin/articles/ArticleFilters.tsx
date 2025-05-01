
import React, { useMemo, useState } from 'react';
import { Filter, ChevronDown, ChevronUp, CalendarIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { DateRange } from 'react-day-picker';
import { Card } from '@/components/ui/card';

interface ArticleFiltersProps {
  filters: {
    category: string;
    status: string;
    dateRange: DateRange | undefined;
    author: string;
  };
  setFilters: (filters: any) => void;
  articles: any[];
}

const ArticleFilters: React.FC<ArticleFiltersProps> = ({ 
  filters, 
  setFilters,
  articles
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Extract unique categories from articles
  const categories = useMemo(() => {
    const categorySet = new Set(articles.map(article => article.category));
    return Array.from(categorySet);
  }, [articles]);
  
  // Extract unique authors from articles
  const authors = useMemo(() => {
    const authorSet = new Set();
    const authorsList: any[] = [];
    
    articles.forEach(article => {
      if (article.authors) {
        article.authors.forEach((author: any) => {
          if (!authorSet.has(author.id)) {
            authorSet.add(author.id);
            authorsList.push(author);
          }
        });
      }
    });
    
    return authorsList;
  }, [articles]);
  
  const handleCategorySelect = (category: string) => {
    setFilters({ ...filters, category });
  };
  
  const handleStatusSelect = (status: string) => {
    setFilters({ ...filters, status });
  };
  
  const handleDateRangeSelect = (dateRange: DateRange | undefined) => {
    setFilters({ ...filters, dateRange });
  };
  
  const handleAuthorSelect = (authorId: string) => {
    setFilters({ ...filters, author: authorId });
  };
  
  const handleClearFilters = () => {
    setFilters({
      category: '',
      status: '',
      dateRange: undefined,
      author: ''
    });
    // Close the filter panel after clearing
    setIsOpen(false);
  };
  
  // Count active filters
  const activeFiltersCount = [
    filters.category, 
    filters.status, 
    (filters.dateRange && (filters.dateRange.from || filters.dateRange.to)),
    filters.author
  ].filter(Boolean).length;

  // Format the active filters for display
  const getActiveFiltersText = () => {
    const parts = [];
    if (filters.category) parts.push(filters.category);
    if (filters.status) parts.push(filters.status === 'published' ? 'Published' : 'Draft');
    if (filters.author) {
      const author = authors.find(a => a.id === filters.author);
      if (author) parts.push(author.name);
    }
    if (filters.dateRange?.from) {
      const dateText = filters.dateRange.to 
        ? `${format(filters.dateRange.from, "MMM d")} - ${format(filters.dateRange.to, "MMM d")}`
        : `From ${format(filters.dateRange.from, "MMM d")}`;
      parts.push(dateText);
    }
    return parts.join(' · ');
  };
  
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
      <div className="flex flex-wrap gap-2">
        {/* Collapsible filters section */}
        <Collapsible
          open={isOpen}
          onOpenChange={setIsOpen}
          className="w-full"
        >
          <div className="flex items-center">
            <CollapsibleTrigger asChild>
              <Button variant="outline" size="sm" className="h-10 px-4 flex items-center">
                <Filter size={16} className="mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge className="ml-2 bg-black text-white">{activeFiltersCount}</Badge>
                )}
                {isOpen ? (
                  <ChevronUp size={14} className="ml-2" />
                ) : (
                  <ChevronDown size={14} className="ml-2" />
                )}
              </Button>
            </CollapsibleTrigger>
          </div>
          
          <CollapsibleContent className="mt-2">
            <Card className="p-4 shadow-md border-none">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Filter Articles</h3>
                <Button
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 p-0"
                >
                  <X size={16} />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Category filter */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Category</h4>
                  <div className="space-y-1">
                    <div
                      className={`px-3 py-1.5 rounded-md text-sm cursor-pointer ${!filters.category ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                      onClick={() => handleCategorySelect('')}
                    >
                      All Categories
                    </div>
                    {categories.map((category) => (
                      <div
                        key={category}
                        className={`px-3 py-1.5 rounded-md text-sm cursor-pointer ${filters.category === category ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                        onClick={() => handleCategorySelect(category)}
                      >
                        {category}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Status filter */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Status</h4>
                  <div className="space-y-1">
                    <div
                      className={`px-3 py-1.5 rounded-md text-sm cursor-pointer ${!filters.status ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                      onClick={() => handleStatusSelect('')}
                    >
                      All Statuses
                    </div>
                    <div
                      className={`px-3 py-1.5 rounded-md text-sm cursor-pointer ${filters.status === 'published' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                      onClick={() => handleStatusSelect('published')}
                    >
                      Published
                    </div>
                    <div
                      className={`px-3 py-1.5 rounded-md text-sm cursor-pointer ${filters.status === 'draft' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                      onClick={() => handleStatusSelect('draft')}
                    >
                      Draft
                    </div>
                  </div>
                </div>
                
                {/* Date Range section */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Date Range</h4>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className={`w-full text-left justify-between h-10 ${filters.dateRange?.from ? 'text-black' : 'text-gray-500'}`}
                      >
                        <div className="flex items-center">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {filters.dateRange?.from ? (
                            filters.dateRange.to ? (
                              <>
                                {format(filters.dateRange.from, "MMM dd, yyyy")} - {format(filters.dateRange.to, "MMM dd, yyyy")}
                              </>
                            ) : (
                              format(filters.dateRange.from, "MMM dd, yyyy")
                            )
                          ) : (
                            "Select date range"
                          )}
                        </div>
                        <ChevronDown size={14} />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="range"
                        selected={filters.dateRange}
                        onSelect={(range) => handleDateRangeSelect(range)}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                      <div className="p-3 border-t border-border flex justify-between">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDateRangeSelect(undefined)}
                          className="text-xs"
                        >
                          Clear Dates
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => document.body.click()} // Close the popover
                          className="text-xs"
                        >
                          Apply
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                
                {/* Author filter */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Author</h4>
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    <div
                      className={`px-3 py-1.5 rounded-md text-sm cursor-pointer ${!filters.author ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                      onClick={() => handleAuthorSelect('')}
                    >
                      All Authors
                    </div>
                    {authors.map((author) => (
                      <div
                        key={author.id}
                        className={`px-3 py-1.5 rounded-md text-sm cursor-pointer ${filters.author === author.id ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                        onClick={() => handleAuthorSelect(author.id)}
                      >
                        {author.name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={handleClearFilters}
                  disabled={activeFiltersCount === 0}
                >
                  Clear All Filters
                </Button>
              </div>
            </Card>
          </CollapsibleContent>
        </Collapsible>
      </div>
      
      {/* Active filters display */}
      {activeFiltersCount > 0 && (
        <div className="text-sm text-gray-500 mt-1 sm:mt-0 flex flex-wrap items-center">
          <span className="mr-2">Active filters:</span>
          <div className="flex flex-wrap gap-1">
            {getActiveFiltersText()}
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleFilters;
