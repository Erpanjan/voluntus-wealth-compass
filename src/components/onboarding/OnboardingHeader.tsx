
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
    <header className="py-4">
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img 
            src="/lovable-uploads/e4b4f8b7-8d82-468f-b861-b6a593038f7c.png" 
            alt="Voluntus Logo" 
            className="h-16" 
          />
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
