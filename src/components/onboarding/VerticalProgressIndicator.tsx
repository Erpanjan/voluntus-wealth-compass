
import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface ProgressStep {
  id: string;
  title: string;
  completed: boolean;
  active: boolean;
}

interface VerticalProgressIndicatorProps {
  steps: ProgressStep[];
}

const VerticalProgressIndicator: React.FC<VerticalProgressIndicatorProps> = ({
  steps
}) => {
  return (
    <div className="flex flex-col items-center space-y-8">
      {steps.map((step, index) => (
        <div key={step.id} className="flex flex-col items-center">
          {/* Connector line between steps */}
          {index > 0 && (
            <div 
              className={cn(
                "w-[2px] h-8 -mb-4",
                step.completed || steps[index - 1].completed ? "bg-black" : "bg-gray-300"
              )}
            />
          )}
          
          {/* Step indicator with outer circle */}
          <div className="relative flex items-center justify-center">
            {/* Outer circle */}
            <div 
              className={cn(
                "w-8 h-8 rounded-full border-2",
                step.active ? "border-black" : "border-gray-300"
              )}
            />
            
            {/* Inner circle or checkmark */}
            <div 
              className={cn(
                "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
                "w-5 h-5 rounded-full flex items-center justify-center",
                step.completed ? "bg-black text-white" : 
                  step.active ? "bg-black" : "bg-gray-200"
              )}
            >
              {step.completed && (
                <Check size={12} className="text-white" />
              )}
            </div>
          </div>
          
          {/* Step title */}
          <div className="mt-2 text-xs text-center font-medium w-24">
            {step.title}
          </div>
        </div>
      ))}
    </div>
  );
};

export default VerticalProgressIndicator;
