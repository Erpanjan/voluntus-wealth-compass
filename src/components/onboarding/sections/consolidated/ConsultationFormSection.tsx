
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface ConsultationFormSectionProps {
  consultationData: {
    completed: boolean;
    type: string;
    date: string;
    time: string;
  };
  updateConsultationData: (data: Partial<ConsultationFormSectionProps['consultationData']>) => void;
}

const ConsultationFormSection: React.FC<ConsultationFormSectionProps> = ({
  consultationData,
  updateConsultationData
}) => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    consultationData.date ? new Date(consultationData.date) : undefined
  );

  // Available consultation types
  const consultationTypes = [
    { id: 'virtual', label: 'Virtual Meeting', description: 'Schedule a video call with one of our advisors. Discuss your financial goals from the comfort of your home.' },
    { id: 'in-person', label: 'In-Person Meeting', description: 'Visit our office for a face-to-face consultation with our financial experts.' }
  ];

  // Available times for scheduling, organized by time periods
  const availableTimes = [
    {
      label: 'Morning',
      times: [
        { value: '09:00', label: '9:00 AM' },
        { value: '10:00', label: '10:00 AM' },
        { value: '11:00', label: '11:00 AM' },
      ]
    },
    {
      label: 'Afternoon',
      times: [
        { value: '14:00', label: '2:00 PM' },
        { value: '15:00', label: '3:00 PM' },
        { value: '16:00', label: '4:00 PM' },
      ]
    }
  ];

  // Handle consultation type selection
  const handleTypeSelection = (type: string) => {
    updateConsultationData({ type });
  };

  // Handle date selection from calendar
  const handleDateSelection = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      updateConsultationData({ date: format(date, 'yyyy-MM-dd') });
    }
  };

  // Handle time selection
  const handleTimeSelection = (time: string) => {
    updateConsultationData({ time });
  };

  // Get readable format for selected date
  const getReadableDateFormat = () => {
    if (!selectedDate) return '';
    return format(selectedDate, 'EEEE, MMMM d, yyyy');
  };

  // Get readable format for selected time
  const getReadableTimeFormat = () => {
    if (!consultationData.time) return '';
    for (const group of availableTimes) {
      const foundTime = group.times.find(t => t.value === consultationData.time);
      if (foundTime) return foundTime.label;
    }
    return consultationData.time;
  };

  // Confirm consultation booking
  const confirmConsultation = () => {
    if (!consultationData.type || !consultationData.date || !consultationData.time) {
      toast({
        title: "Incomplete Selection",
        description: "Please select consultation type, date and time.",
        variant: "destructive"
      });
      return;
    }

    updateConsultationData({ completed: true });
    
    toast({
      title: "Consultation Scheduled",
      description: `Your ${consultationData.type === 'virtual' ? 'Virtual Meeting' : 'In-Person Meeting'} consultation has been scheduled for ${getReadableDateFormat()} at ${getReadableTimeFormat()}.`,
    });
  };

  return (
    <div className="space-y-8">
      {/* Consultation Type Selection */}
      <div>
        <h3 className="text-lg font-medium mb-4">Select Consultation Type</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {consultationTypes.map(type => (
            <div 
              key={type.id}
              onClick={() => handleTypeSelection(type.id)} 
              className={`border rounded-lg p-5 cursor-pointer transition-all relative
                ${consultationData.type === type.id 
                  ? 'border-black ring-2 ring-black ring-opacity-10' 
                  : 'hover:border-gray-400'}`}
            >
              {consultationData.type === type.id && (
                <div className="absolute top-3 right-3 bg-black text-white rounded-full p-1">
                  <Check className="h-3 w-3" />
                </div>
              )}
              <h4 className="font-medium text-lg mb-2">{type.label}</h4>
              <p className="text-gray-600 text-sm">{type.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Date Selection with Calendar */}
      {consultationData.type && (
        <div>
          <h3 className="text-lg font-medium mb-4">Select Date</h3>
          <div className="flex flex-col gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full md:w-[300px] justify-start text-left font-normal",
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
                  onSelect={handleDateSelection}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            
            {selectedDate && (
              <p className="text-sm text-gray-500">
                Select a convenient date for your consultation.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Time Selection */}
      {consultationData.type && consultationData.date && (
        <div>
          <h3 className="text-lg font-medium mb-4">Select Time</h3>
          <div className="flex flex-col gap-2">
            <Select value={consultationData.time} onValueChange={handleTimeSelection}>
              <SelectTrigger className="w-full md:w-[300px]">
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Select a time" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {availableTimes.map(group => (
                  <SelectGroup key={group.label}>
                    <SelectLabel>{group.label}</SelectLabel>
                    {group.times.map(time => (
                      <SelectItem key={time.value} value={time.value}>
                        {time.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
            
            <p className="text-sm text-gray-500">
              Choose a time that works best for you.
            </p>
          </div>
        </div>
      )}

      {/* Confirm Button */}
      {consultationData.type && consultationData.date && consultationData.time && !consultationData.completed && (
        <div className="pt-4">
          <Button onClick={confirmConsultation} className="ml-auto block">
            Confirm Consultation
          </Button>
        </div>
      )}

      {/* Confirmation Display */}
      {consultationData.completed && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
          <div className="flex items-center">
            <div className="bg-green-500 rounded-full p-1 mr-3">
              <Check className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="font-medium">Consultation Scheduled</p>
              <p className="text-sm text-gray-600">
                {consultationData.type === 'virtual' ? 'Virtual Meeting' : 'In-Person Meeting'} on {getReadableDateFormat()} at {getReadableTimeFormat()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultationFormSection;
