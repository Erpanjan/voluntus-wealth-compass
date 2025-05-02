
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface ConsultationTypeSelectorProps {
  selectedType: string;
  onTypeChange: (value: string) => void;
}

const ConsultationTypeSelector: React.FC<ConsultationTypeSelectorProps> = ({
  selectedType,
  onTypeChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Consultation Type</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup 
          value={selectedType} 
          onValueChange={onTypeChange}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="flex">
            <div className="border rounded-lg p-4 w-full hover:border-black transition-colors cursor-pointer">
              <RadioGroupItem value="virtual" id="virtual" className="sr-only" />
              <Label htmlFor="virtual" className="cursor-pointer">
                <div className="font-medium text-lg mb-2">Virtual Meeting</div>
                <p className="text-gray-600">
                  Schedule a video call with one of our advisors. Discuss your financial goals from the comfort of your home.
                </p>
              </Label>
            </div>
          </div>

          <div className="flex">
            <div className="border rounded-lg p-4 w-full hover:border-black transition-colors cursor-pointer">
              <RadioGroupItem value="in-person" id="in-person" className="sr-only" />
              <Label htmlFor="in-person" className="cursor-pointer">
                <div className="font-medium text-lg mb-2">In-Person Meeting</div>
                <p className="text-gray-600">
                  Visit our office for a face-to-face consultation with our financial experts.
                </p>
              </Label>
            </div>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default ConsultationTypeSelector;
