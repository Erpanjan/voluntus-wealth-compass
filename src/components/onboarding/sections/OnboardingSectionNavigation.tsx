
import React from 'react';
import { CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OnboardingSectionNavigationProps {
  activeSection: string;
  navigate: (section: string) => void;
  formData: any;
}

const OnboardingSectionNavigation: React.FC<OnboardingSectionNavigationProps> = ({ 
  activeSection, 
  navigate, 
  formData 
}) => {
  const sections = [
    { id: 'profile', name: 'Profile', isComplete: formData.profile.firstName && formData.profile.lastName },
    { id: 'questionnaire', name: 'Questionnaire', isComplete: formData.questionnaire.completed },
    { id: 'consultation', name: 'Consultation', isComplete: formData.consultation.completed },
    { id: 'review', name: 'Review & Submit', isComplete: false },
  ];

  return (
    <div className="bg-white sticky top-0 z-10 shadow-sm">
      <div className="container mx-auto px-6">
        <nav className="flex justify-between overflow-x-auto py-3">
          {sections.map((section, index) => (
            <button
              key={section.id}
              onClick={() => navigate(section.id)}
              className={cn(
                "flex flex-col items-center min-w-[100px] px-2 py-1 transition-colors relative",
                activeSection === section.id ? "text-black" : "text-gray-500"
              )}
            >
              <div className="flex items-center mb-1">
                {section.isComplete ? (
                  <span className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center mr-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </span>
                ) : (
                  <span className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center mr-1",
                    activeSection === section.id ? "bg-black text-white" : "bg-gray-200 text-gray-500"
                  )}>
                    {index + 1}
                  </span>
                )}
                <span className="text-sm font-medium whitespace-nowrap">{section.name}</span>
              </div>
              <div className={cn(
                "h-0.5 w-full absolute bottom-0",
                activeSection === section.id ? "bg-black" : "bg-transparent"
              )} />
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default OnboardingSectionNavigation;
