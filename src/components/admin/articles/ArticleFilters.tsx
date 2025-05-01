
import React, { useMemo } from 'react';
import { Filter, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { DateRange } from 'react-day-picker';

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
  };
  
  // Count active filters
  const activeFiltersCount = [
    filters.category, 
    filters.status, 
    (filters.dateRange && (filters.dateRange.from || filters.dateRange.to)),
    filters.author
  ].filter(Boolean).length;
  
  return (
    <div className="flex items-center space-x-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-10 px-4 flex items-center">
            <Filter size={16} className="mr-2" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge className="ml-2 bg-black text-white">{activeFiltersCount}</Badge>
            )}
            <ChevronDown size={14} className="ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Filter Articles</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {/* Category filter */}
          <DropdownMenuGroup>
            <DropdownMenuLabel className="text-xs font-normal text-gray-500 px-2">Category</DropdownMenuLabel>
            <DropdownMenuItem 
              className={`${!filters.category ? 'bg-gray-100' : ''} cursor-pointer`}
              onClick={() => handleCategorySelect('')}
            >
              All Categories
            </DropdownMenuItem>
            {categories.map((category) => (
              <DropdownMenuItem 
                key={category} 
                className={`${filters.category === category ? 'bg-gray-100' : ''} cursor-pointer`}
                onClick={() => handleCategorySelect(category)}
              >
                {category}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
          
          <DropdownMenuSeparator />
          
          {/* Status filter */}
          <DropdownMenuGroup>
            <DropdownMenuLabel className="text-xs font-normal text-gray-500 px-2">Status</DropdownMenuLabel>
            <DropdownMenuItem 
              className={`${!filters.status ? 'bg-gray-100' : ''} cursor-pointer`}
              onClick={() => handleStatusSelect('')}
            >
              All Statuses
            </DropdownMenuItem>
            <DropdownMenuItem 
              className={`${filters.status === 'published' ? 'bg-gray-100' : ''} cursor-pointer`}
              onClick={() => handleStatusSelect('published')}
            >
              Published
            </DropdownMenuItem>
            <DropdownMenuItem 
              className={`${filters.status === 'draft' ? 'bg-gray-100' : ''} cursor-pointer`}
              onClick={() => handleStatusSelect('draft')}
            >
              Draft
            </DropdownMenuItem>
          </DropdownMenuGroup>
          
          <DropdownMenuSeparator />
          
          {/* Author filter */}
          <DropdownMenuGroup>
            <DropdownMenuLabel className="text-xs font-normal text-gray-500 px-2">Author</DropdownMenuLabel>
            <DropdownMenuItem 
              className={`${!filters.author ? 'bg-gray-100' : ''} cursor-pointer`}
              onClick={() => handleAuthorSelect('')}
            >
              All Authors
            </DropdownMenuItem>
            {authors.map((author) => (
              <DropdownMenuItem 
                key={author.id} 
                className={`${filters.author === author.id ? 'bg-gray-100' : ''} cursor-pointer`}
                onClick={() => handleAuthorSelect(author.id)}
              >
                {author.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
          
          <DropdownMenuSeparator />
          
          {/* Clear filters button */}
          <div className="p-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={handleClearFilters}
              disabled={activeFiltersCount === 0}
            >
              Clear Filters
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Date Range Picker */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={`h-10 px-4 text-left ${filters.dateRange?.from ? 'text-black' : 'text-gray-500'}`}
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
              "Date Range"
            )}
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
  );
};

export default ArticleFilters;
