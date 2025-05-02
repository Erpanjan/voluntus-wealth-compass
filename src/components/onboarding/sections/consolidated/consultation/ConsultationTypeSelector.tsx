
import React from 'react';
import { Check } from 'lucide-react';

interface ConsultationTypeProps {
  selectedType: string;
  onTypeChange: (type: string) => void;
}

interface ConsultationTypeOption {
  id: string;
  label: string;
  description: string;
}

const ConsultationTypeSelector: React.FC<ConsultationTypeProps> = ({ 
  selectedType, 
  onTypeChange 
}) => {
  // Available consultation types
  const consultationTypes: ConsultationTypeOption[] = [
    { 
      id: 'virtual', 
      label: 'Virtual Meeting', 
      description: 'Schedule a video call with one of our advisors. Discuss your financial goals from the comfort of your home.' 
    },
    { 
      id: 'in-person', 
      label: 'In-Person Meeting', 
      description: 'Visit our office for a face-to-face consultation with our financial experts.' 
    }
  ];

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Select Consultation Type</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {consultationTypes.map(type => (
          <div 
            key={type.id}
            onClick={() => onTypeChange(type.id)} 
            className={`border rounded-lg p-5 cursor-pointer transition-all relative
              ${selectedType === type.id 
                ? 'border-black ring-2 ring-black ring-opacity-10' 
                : 'hover:border-gray-400'}`}
          >
            {selectedType === type.id && (
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
  );
};

export default ConsultationTypeSelector;
