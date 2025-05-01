
import React, { useMemo, useState } from 'react';
import { Filter, ChevronDown, ChevronUp, CalendarIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { DateRange } from 'react-day-picker';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

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
          
          <SheetContent side="right" className="w-full sm:max-w-md p-0 overflow-auto">
            <div className="flex flex-col h-full">
              <SheetHeader className="px-6 py-4 border-b sticky top-0 bg-white z-10">
                <div className="flex justify-between items-center">
                  <SheetTitle className="text-xl font-bold">Filter Articles</SheetTitle>
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
              
              <div className="flex-1 overflow-auto">
                <div className="p-6 space-y-8">
                  {/* Category filter */}
                  <div>
                    <h4 className="text-base font-medium mb-3 text-gray-800">Category</h4>
                    <div className="grid grid-cols-1 gap-2">
                      <div
                        className={`px-4 py-3 rounded-md cursor-pointer flex items-center justify-between ${!filters.category ? 'bg-gray-100' : 'bg-gray-50 hover:bg-gray-100'}`}
                        onClick={() => handleCategorySelect('')}
                      >
                        <span className="font-medium">All Categories</span>
                        {!filters.category && (
                          <Badge className="bg-black text-white ml-2 px-3 py-1">Selected</Badge>
                        )}
                      </div>
                      {categories.map((category) => (
                        <div
                          key={category}
                          className={`px-4 py-3 rounded-md cursor-pointer flex items-center justify-between ${filters.category === category ? 'bg-gray-100' : 'bg-gray-50 hover:bg-gray-100'}`}
                          onClick={() => handleCategorySelect(category)}
                        >
                          <span className="font-medium">{category}</span>
                          {filters.category === category && (
                            <Badge className="bg-black text-white ml-2 px-3 py-1">Selected</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Status filter */}
                  <div>
                    <h4 className="text-base font-medium mb-3 text-gray-800">Status</h4>
                    <div className="grid grid-cols-1 gap-2">
                      <div
                        className={`px-4 py-3 rounded-md cursor-pointer flex items-center justify-between ${!filters.status ? 'bg-gray-100' : 'bg-gray-50 hover:bg-gray-100'}`}
                        onClick={() => handleStatusSelect('')}
                      >
                        <span className="font-medium">All Statuses</span>
                        {!filters.status && (
                          <Badge className="bg-black text-white ml-2 px-3 py-1">Selected</Badge>
                        )}
                      </div>
                      <div
                        className={`px-4 py-3 rounded-md cursor-pointer flex items-center justify-between ${filters.status === 'published' ? 'bg-gray-100' : 'bg-gray-50 hover:bg-gray-100'}`}
                        onClick={() => handleStatusSelect('published')}
                      >
                        <span className="font-medium">Published</span>
                        {filters.status === 'published' && (
                          <Badge className="bg-black text-white ml-2 px-3 py-1">Selected</Badge>
                        )}
                      </div>
                      <div
                        className={`px-4 py-3 rounded-md cursor-pointer flex items-center justify-between ${filters.status === 'draft' ? 'bg-gray-100' : 'bg-gray-50 hover:bg-gray-100'}`}
                        onClick={() => handleStatusSelect('draft')}
                      >
                        <span className="font-medium">Draft</span>
                        {filters.status === 'draft' && (
                          <Badge className="bg-black text-white ml-2 px-3 py-1">Selected</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Author filter */}
                  <div>
                    <h4 className="text-base font-medium mb-3 text-gray-800">Author</h4>
                    <ScrollArea className="h-[200px]">
                      <div className="grid grid-cols-1 gap-2 pr-4">
                        <div
                          className={`px-4 py-3 rounded-md cursor-pointer flex items-center justify-between ${!filters.author ? 'bg-gray-100' : 'bg-gray-50 hover:bg-gray-100'}`}
                          onClick={() => handleAuthorSelect('')}
                        >
                          <span className="font-medium">All Authors</span>
                          {!filters.author && (
                            <Badge className="bg-black text-white ml-2 px-3 py-1">Selected</Badge>
                          )}
                        </div>
                        {authors.map((author) => (
                          <div
                            key={author.id}
                            className={`px-4 py-3 rounded-md cursor-pointer flex items-center justify-between ${filters.author === author.id ? 'bg-gray-100' : 'bg-gray-50 hover:bg-gray-100'}`}
                            onClick={() => handleAuthorSelect(author.id)}
                          >
                            <span className="font-medium">{author.name}</span>
                            {filters.author === author.id && (
                              <Badge className="bg-black text-white ml-2 px-3 py-1">Selected</Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                  
                  {/* Date Range section */}
                  <div>
                    <h4 className="text-base font-medium mb-3 text-gray-800">Date Range</h4>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className={`w-full text-left justify-start h-12 px-4 bg-gray-50 border border-gray-200 ${filters.dateRange?.from ? 'text-black' : 'text-gray-500'}`}
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
                  </div>
                </div>
              </div>
              
              <div className="mt-auto border-t p-6 bg-white sticky bottom-0">
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleClearFilters}
                    disabled={activeFiltersCount === 0}
                  >
                    Clear All Filters
                  </Button>
                  <Button 
                    className="w-full"
                    onClick={() => setIsOpen(false)}
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </div>
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
