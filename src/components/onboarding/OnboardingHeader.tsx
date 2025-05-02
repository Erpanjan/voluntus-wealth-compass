
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface OnboardingHeaderProps {
  currentStep: number;
}

const OnboardingHeader: React.FC<OnboardingHeaderProps> = ({ currentStep }) => {
  const navigate = useNavigate();
  
  const handleExitSetup = () => {
    // Set onboardingComplete to true in localStorage
    localStorage.setItem('onboardingComplete', 'true');
    // Redirect to dashboard
    navigate('/dashboard');
  };
  
  return (
    <header className="border-b py-4">
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <span className="font-bold text-xl">VOLUNTUS</span>
        </Link>
        {currentStep < 3 && (
          <Button variant="link" onClick={handleExitSetup}>
            Exit Setup
          </Button>
        )}
      </div>
    </header>
  );
};

export default OnboardingHeader;
