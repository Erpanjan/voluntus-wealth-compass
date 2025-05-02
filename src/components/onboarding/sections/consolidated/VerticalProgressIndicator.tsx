
import React, { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface ProgressStep {
  id: string;
  title: string; // We'll keep title in the data structure but won't display it
  completed: boolean;
  active: boolean;
}

interface VerticalProgressIndicatorProps {
  steps: ProgressStep[];
  className?: string;
  onActiveStepChange?: (stepIndex: number) => void;
}

const VerticalProgressIndicator: React.FC<VerticalProgressIndicatorProps> = ({
  steps,
  className,
  onActiveStepChange
}) => {
  const isMobile = useIsMobile();
  const stepCount = steps.length;
  
  // On mobile, we'll render a horizontal progress indicator
  if (isMobile) {
    return (
      <div className={cn("w-full flex items-center justify-between py-2", className)}>
        {steps.map((step, index) => (
          <React.Fragment key={step.id || step.title}>
            {/* Step with outer circle and inner circle/checkmark */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                  step.completed 
                    ? "border-black" // Outer circle for completed step
                    : step.active 
                    ? "border-black" // Outer circle for active step
                    : "border-gray-300" // Outer circle for inactive step
                )}
              >
                <div
                  className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300",
                    step.completed 
                      ? "bg-black text-white" // Inner circle for completed step
                      : step.active 
                      ? "bg-black text-white" // Inner circle for active step
                      : "bg-gray-200" // Inner circle for inactive step
                  )}
                >
                  {step.completed ? (
                    <Check className="w-4 h-4 stroke-2" />
                  ) : null}
                </div>
              </div>
            </div>
            
            {/* Connecting line between steps */}
            {index < stepCount - 1 && (
              <div className={cn(
                "h-px grow mx-1 transition-all duration-300",
                (step.completed || steps[index + 1].active || steps[index + 1].completed) ? "bg-black" : "bg-gray-300"
              )} />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  }
  
  // On desktop, we'll render a vertical progress indicator
  return (
    <div className={cn("h-full flex flex-col items-center py-16", className)}>
      {steps.map((step, index) => (
        <React.Fragment key={step.id || step.title}>
          {/* Step with outer circle and inner circle/checkmark */}
          <div className="relative">
            <div
              className={cn(
                "w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                step.completed 
                  ? "border-black" // Outer circle for completed step
                  : step.active 
                  ? "border-black" // Outer circle for active step
                  : "border-gray-300" // Outer circle for inactive step
              )}
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                  step.completed 
                    ? "bg-black text-white" // Inner circle for completed step
                    : step.active 
                    ? "bg-black text-white" // Inner circle for active step
                    : "bg-gray-200" // Inner circle for inactive step
                )}
              >
                {step.completed ? (
                  <Check className="w-5 h-5 stroke-2" />
                ) : null}
              </div>
            </div>
          </div>
          
          {/* Connecting line between steps */}
          {index < stepCount - 1 && (
            <div className={cn(
              "w-px grow my-4 transition-all duration-300",
              (step.completed || steps[index + 1].active || steps[index + 1].completed) ? "bg-black" : "bg-gray-300"
            )} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default VerticalProgressIndicator;
