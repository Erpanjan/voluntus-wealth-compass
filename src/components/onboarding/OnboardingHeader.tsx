
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface OnboardingHeaderProps {
  currentStep: number;
}

const OnboardingHeader: React.FC<OnboardingHeaderProps> = ({ currentStep }) => {
  return (
    <header className="border-b py-4">
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <span className="font-bold text-xl">VOLUNTUS</span>
        </Link>
        {currentStep < 3 && (
          <Button variant="link" onClick={() => window.location.href = '/login'}>
            Exit Setup
          </Button>
        )}
      </div>
    </header>
  );
};

export default OnboardingHeader;
