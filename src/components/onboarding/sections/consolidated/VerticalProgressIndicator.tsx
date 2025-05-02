
import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface ProgressStep {
  title: string;
  completed: boolean;
  active: boolean;
}

interface VerticalProgressIndicatorProps {
  steps: ProgressStep[];
  className?: string;
}

const VerticalProgressIndicator: React.FC<VerticalProgressIndicatorProps> = ({ 
  steps, 
  className 
}) => {
  const isMobile = useIsMobile();
  const stepCount = steps.length;
  
  // On mobile, we'll render a horizontal progress indicator
  if (isMobile) {
    return (
      <div className={cn("w-full flex items-center justify-between py-2", className)}>
        {steps.map((step, index) => (
          <React.Fragment key={step.title}>
            {/* Step circle with number or check */}
            <div className="flex flex-col items-center">
              <div 
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
                  step.completed 
                    ? "bg-black text-white" 
                    : step.active 
                    ? "bg-white border-2 border-black" 
                    : "bg-white border-2 border-gray-200"
                )}
              >
                {step.completed ? (
                  <Check className="w-4 h-4 stroke-2" />
                ) : (
                  <span className={cn(
                    "font-medium text-sm",
                    step.active ? "text-black" : "text-gray-400"
                  )}>
                    {index + 1}
                  </span>
                )}
              </div>
              
              {/* Step title below the circle on mobile */}
              <span className={cn(
                "text-xs font-medium mt-1 text-center max-w-[80px]",
                step.completed || step.active ? "text-black" : "text-gray-400"
              )}>
                {step.title.split(' ').slice(-1)[0]} {/* Just display the last word for space */}
              </span>
            </div>
            
            {/* Connecting line between steps */}
            {index < stepCount - 1 && (
              <div className={cn(
                "h-px grow mx-1 transition-all duration-300",
                step.completed ? "bg-black" : "bg-gray-200"
              )} />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  }
  
  // On desktop, we'll render a vertical progress indicator
  return (
    <div className={cn("h-full flex flex-col items-center py-8", className)}>
      {steps.map((step, index) => (
        <React.Fragment key={step.title}>
          {/* Step circle with icon */}
          <div className="relative">
            <div 
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                step.completed 
                  ? "bg-black text-white" 
                  : step.active 
                  ? "bg-white border-2 border-black" 
                  : "bg-white border-2 border-gray-200"
              )}
            >
              {step.completed ? (
                <Check className="w-5 h-5 stroke-2" />
              ) : (
                <span className={cn(
                  "font-medium",
                  step.active ? "text-black" : "text-gray-400"
                )}>
                  {index + 1}
                </span>
              )}
            </div>
            
            {/* Step label */}
            <div className={cn(
              "absolute left-full ml-4 whitespace-nowrap top-1/2 -translate-y-1/2 font-medium text-sm",
              step.completed || step.active ? "text-black" : "text-gray-400"
            )}>
              {step.title}
            </div>
          </div>
          
          {/* Connecting line between steps */}
          {index < stepCount - 1 && (
            <div className={cn(
              "w-px grow my-4 transition-all duration-300",
              step.completed ? "bg-black" : "bg-gray-200"
            )} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default VerticalProgressIndicator;
