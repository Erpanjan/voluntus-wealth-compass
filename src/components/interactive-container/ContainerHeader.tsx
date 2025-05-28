
import React from 'react';
import NavigationDots from './NavigationDots';

interface ContainerHeaderProps {
  sectionsLength: number;
  current: number;
  onNavigate: (index: number) => void;
}

const ContainerHeader: React.FC<ContainerHeaderProps> = ({
  sectionsLength,
  current,
  onNavigate
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-12 mt-6 sm:mt-8 px-4 sm:px-0">
      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold mb-4 sm:mb-0">What We Can Help</h2>
      
      <NavigationDots 
        sectionsLength={sectionsLength}
        current={current}
        onNavigate={onNavigate}
      />
    </div>
  );
};

export default ContainerHeader;
