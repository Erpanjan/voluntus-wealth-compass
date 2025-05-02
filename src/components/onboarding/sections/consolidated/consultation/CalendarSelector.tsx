
import React from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CalendarSelectorProps {
  selectedDate: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
}

const CalendarSelector: React.FC<CalendarSelectorProps> = ({
  selectedDate,
  onDateChange
}) => {
  const getReadableDateFormat = () => {
    if (!selectedDate) return '';
    return format(selectedDate, 'EEEE, MMMM d, yyyy');
  };

  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !selectedDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate ? getReadableDateFormat() : <span>Select a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onDateChange}
            disabled={(date) => date < new Date()}
            initialFocus
            className="p-3 pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default CalendarSelector;
