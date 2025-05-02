
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Section from '@/components/ui/Section';
import OnboardingHeader from '@/components/onboarding/OnboardingHeader';
import { User, FileText, Calendar } from 'lucide-react';

const Welcome = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/onboarding');
  };

  return (
    <div className="min-h-screen bg-white">
      <OnboardingHeader currentStep={0} />
      
      <Section className="py-4 h-[calc(100vh-80px)] flex items-center justify-center">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-inter font-semibold mb-4 tracking-tight">
            Welcome to Voluntus
          </h1>
          
          <p className="text-sm md:text-base font-inter text-gray-600 mb-6 max-w-3xl mx-auto">
            We're excited to have you on board. Before we can begin offering our services, 
            we kindly ask you to complete a few important steps.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-3xl shadow-soft border border-gray-100 transition-all duration-300 hover:shadow-hover">
              <div className="h-12 w-12 rounded-full bg-[#F1F1F1] flex items-center justify-center mx-auto mb-4">
                <User className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-inter font-medium mb-2">1. Create Your Profile</h3>
              <p className="text-gray-600 font-inter font-light text-xs">
                Start by telling us a bit about yourself. This helps us personalize your digital experience.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-3xl shadow-soft border border-gray-100 transition-all duration-300 hover:shadow-hover">
              <div className="h-12 w-12 rounded-full bg-[#F1F1F1] flex items-center justify-center mx-auto mb-4">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-inter font-medium mb-2">2. Financial Questionnaire</h3>
              <p className="text-gray-600 font-inter font-light text-xs">
                This questionnaire is designed to help us understand your financial circumstances. 
                While completing it is optional at this stage, it will be required before we can 
                officially begin our service.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-3xl shadow-soft border border-gray-100 transition-all duration-300 hover:shadow-hover">
              <div className="h-12 w-12 rounded-full bg-[#F1F1F1] flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-inter font-medium mb-2">3. Schedule a Consultation</h3>
              <p className="text-gray-600 font-inter font-light text-xs">
                Meet with one of our advisors for a discussion of your financial situation. 
                We'll also use this session to verify key details and better understand your needs.
              </p>
            </div>
          </div>
          
          <Button onClick={handleGetStarted} size="lg" className="font-inter">
            Get Started
          </Button>
        </div>
      </Section>
    </div>
  );
};

export default Welcome;
