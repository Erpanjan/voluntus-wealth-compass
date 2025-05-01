
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
        {/* Use Sheet component for a slide-in panel instead of Collapsible */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="h-10 px-4 flex items-center">
              <Filter size={16} className="mr-2" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge className="ml-2 bg-black text-white">{activeFiltersCount}</Badge>
              )}
            </Button>
          </SheetTrigger>
          
          <SheetContent side="right" className="w-full sm:w-[540px] p-0 overflow-y-auto">
            <SheetHeader className="px-6 py-4 border-b sticky top-0 bg-white z-10">
              <div className="flex justify-between items-center">
                <SheetTitle className="text-xl">Filter Articles</SheetTitle>
                <Button
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 p-0"
                >
                  <X size={16} />
                </Button>
              </div>
            </SheetHeader>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Category filter - Enhanced UI */}
                <div>
                  <h4 className="text-sm font-medium mb-3 text-gray-700">Category</h4>
                  <div className="space-y-2">
                    <div
                      className={`px-4 py-2.5 rounded-md text-sm cursor-pointer flex items-center justify-between transition-colors ${!filters.category ? 'bg-gray-100 font-medium' : 'hover:bg-gray-50'}`}
                      onClick={() => handleCategorySelect('')}
                    >
                      <span>All Categories</span>
                      {!filters.category && <Badge className="bg-black">Selected</Badge>}
                    </div>
                    {categories.map((category) => (
                      <div
                        key={category}
                        className={`px-4 py-2.5 rounded-md text-sm cursor-pointer flex items-center justify-between transition-colors ${filters.category === category ? 'bg-gray-100 font-medium' : 'hover:bg-gray-50'}`}
                        onClick={() => handleCategorySelect(category)}
                      >
                        <span>{category}</span>
                        {filters.category === category && <Badge className="bg-black">Selected</Badge>}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Status filter - Enhanced UI */}
                <div>
                  <h4 className="text-sm font-medium mb-3 text-gray-700">Status</h4>
                  <div className="space-y-2">
                    <div
                      className={`px-4 py-2.5 rounded-md text-sm cursor-pointer flex items-center justify-between transition-colors ${!filters.status ? 'bg-gray-100 font-medium' : 'hover:bg-gray-50'}`}
                      onClick={() => handleStatusSelect('')}
                    >
                      <span>All Statuses</span>
                      {!filters.status && <Badge className="bg-black">Selected</Badge>}
                    </div>
                    <div
                      className={`px-4 py-2.5 rounded-md text-sm cursor-pointer flex items-center justify-between transition-colors ${filters.status === 'published' ? 'bg-gray-100 font-medium' : 'hover:bg-gray-50'}`}
                      onClick={() => handleStatusSelect('published')}
                    >
                      <span>Published</span>
                      {filters.status === 'published' && <Badge className="bg-black">Selected</Badge>}
                    </div>
                    <div
                      className={`px-4 py-2.5 rounded-md text-sm cursor-pointer flex items-center justify-between transition-colors ${filters.status === 'draft' ? 'bg-gray-100 font-medium' : 'hover:bg-gray-50'}`}
                      onClick={() => handleStatusSelect('draft')}
                    >
                      <span>Draft</span>
                      {filters.status === 'draft' && <Badge className="bg-black">Selected</Badge>}
                    </div>
                  </div>
                </div>
                
                {/* Author filter - Enhanced UI with proper scrolling */}
                <div>
                  <h4 className="text-sm font-medium mb-3 text-gray-700">Author</h4>
                  <ScrollArea className="h-[240px] pr-4 -mr-4">
                    <div className="space-y-2">
                      <div
                        className={`px-4 py-2.5 rounded-md text-sm cursor-pointer flex items-center justify-between transition-colors ${!filters.author ? 'bg-gray-100 font-medium' : 'hover:bg-gray-50'}`}
                        onClick={() => handleAuthorSelect('')}
                      >
                        <span>All Authors</span>
                        {!filters.author && <Badge className="bg-black">Selected</Badge>}
                      </div>
                      {authors.map((author) => (
                        <div
                          key={author.id}
                          className={`px-4 py-2.5 rounded-md text-sm cursor-pointer flex items-center justify-between transition-colors ${filters.author === author.id ? 'bg-gray-100 font-medium' : 'hover:bg-gray-50'}`}
                          onClick={() => handleAuthorSelect(author.id)}
                        >
                          <span>{author.name}</span>
                          {filters.author === author.id && <Badge className="bg-black">Selected</Badge>}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
                
                {/* Date Range section - Improved UI */}
                <div>
                  <h4 className="text-sm font-medium mb-3 text-gray-700">Date Range</h4>
                  <div className="space-y-4">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className={`w-full text-left justify-start h-11 px-4 ${filters.dateRange?.from ? 'text-black' : 'text-gray-500'}`}
                        >
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
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="range"
                          selected={filters.dateRange}
                          onSelect={(range) => handleDateRangeSelect(range)}
                          initialFocus
                          className="p-3"
                        />
                        <div className="p-3 border-t border-border flex justify-between">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDateRangeSelect(undefined)}
                          >
                            Clear Dates
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => document.body.click()} // Close the popover
                          >
                            Apply
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                    
                    {filters.dateRange?.from && (
                      <div className="flex items-center">
                        <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-1.5">
                          <span>
                            {filters.dateRange.to 
                              ? `${format(filters.dateRange.from, "MMM d")} - ${format(filters.dateRange.to, "MMM d")}` 
                              : `From ${format(filters.dateRange.from, "MMM d")}`}
                          </span>
                          <button 
                            onClick={() => handleDateRangeSelect(undefined)}
                            className="ml-2 hover:text-gray-900"
                          >
                            <X size={14} />
                          </button>
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <SheetFooter className="p-6 border-t bg-white sticky bottom-0">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full h-11"
                onClick={handleClearFilters}
                disabled={activeFiltersCount === 0}
              >
                Clear All Filters
              </Button>
              <Button 
                size="sm" 
                className="w-full h-11 mt-2"
                onClick={() => setIsOpen(false)}
              >
                Apply Filters
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
      
      {/* Active filters display */}
      {activeFiltersCount > 0 && (
        <div className="text-sm text-gray-600 mt-1 sm:mt-0 flex flex-wrap items-center">
          <span className="mr-2 font-medium">Active filters:</span>
          <div className="flex flex-wrap gap-1">
            {getActiveFiltersText()}
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleFilters;
