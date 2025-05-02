
import React, { useRef, useState, ReactNode } from 'react';
import OnboardingSectionNavigation from '@/components/onboarding/sections/OnboardingSectionNavigation';
import { OnboardingFormData } from '@/hooks/use-onboarding-form';

interface OnboardingSectionContainerProps {
  formData: OnboardingFormData;
  children: ReactNode;
  initialSection?: string;
}

const OnboardingSectionContainer: React.FC<OnboardingSectionContainerProps> = ({ 
  formData,
  children,
  initialSection = 'profile'
}) => {
  // Current active section
  const [activeSection, setActiveSection] = useState<string>(initialSection);
  
  // References to scroll to sections
  const sectionRefs = {
    profile: useRef<HTMLDivElement>(null),
    questionnaire: useRef<HTMLDivElement>(null),
    consultation: useRef<HTMLDivElement>(null),
    review: useRef<HTMLDivElement>(null),
  };

  // Handle navigation between sections
  const navigateToSection = (section: string) => {
    setActiveSection(section);
    sectionRefs[section as keyof typeof sectionRefs]?.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  // Clone children and inject refs and navigation function
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      const sectionId = child.props.id;
      if (sectionId && sectionRefs[sectionId as keyof typeof sectionRefs]) {
        return React.cloneElement(child, {
          ref: sectionRefs[sectionId as keyof typeof sectionRefs]
        });
      }
    }
    return child;
  });

  return (
    <>
      <OnboardingSectionNavigation 
        activeSection={activeSection} 
        navigate={navigateToSection} 
        formData={formData}
      />
      <div className="container mx-auto px-6 py-8 mb-20">
        <div className="max-w-4xl mx-auto">
          {childrenWithProps}
        </div>
      </div>
    </>
  );
};

export default OnboardingSectionContainer;
