
import React from 'react';
import ConsultationTypeSelector from './ConsultationTypeSelector';

interface ConsultationTypeProps {
  selectedType: string;
  onTypeChange: (type: string) => void;
}

const ConsultationType: React.FC<ConsultationTypeProps> = ({
  selectedType,
  onTypeChange
}) => {
  return (
    <div className="mb-8">
      <ConsultationTypeSelector 
        selectedType={selectedType}
        onTypeChange={onTypeChange}
      />
    </div>
  );
};

export default ConsultationType;
