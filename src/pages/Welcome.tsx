
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Section from '@/components/ui/Section';
import OnboardingHeader from '@/components/onboarding/OnboardingHeader';

const Welcome = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/onboarding');
  };

  return (
    <div className="min-h-screen bg-white">
      <OnboardingHeader currentStep={0} />
      
      <Section className="pt-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-semibold mb-6 tracking-tight">
            Welcome to Valence Long-Term Capital
          </h1>
          
          <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
            We're excited to have you on board. Before we begin delivering our personalized 
            financial services, we need to collect some information to better understand your needs.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
            <div className="bg-white p-8 rounded-3xl shadow-soft border border-gray-100 transition-all duration-300 hover:shadow-hover">
              <div className="h-16 w-16 rounded-full bg-[#F1F1F1] flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-semibold">1</span>
              </div>
              <h3 className="text-xl font-medium mb-4">Create Your Profile</h3>
              <p className="text-gray-600">Tell us who you are and how we can best communicate with you.</p>
            </div>
            
            <div className="bg-white p-8 rounded-3xl shadow-soft border border-gray-100 transition-all duration-300 hover:shadow-hover">
              <div className="h-16 w-16 rounded-full bg-[#F1F1F1] flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-semibold">2</span>
              </div>
              <h3 className="text-xl font-medium mb-4">Complete the Questionnaire</h3>
              <p className="text-gray-600">Help us understand your financial goals and risk tolerance.</p>
            </div>
            
            <div className="bg-white p-8 rounded-3xl shadow-soft border border-gray-100 transition-all duration-300 hover:shadow-hover">
              <div className="h-16 w-16 rounded-full bg-[#F1F1F1] flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-semibold">3</span>
              </div>
              <h3 className="text-xl font-medium mb-4">Schedule a Consultation</h3>
              <p className="text-gray-600">Book time with our advisor to discuss your personalized financial plan.</p>
            </div>
          </div>
          
          <Button onClick={handleGetStarted} size="lg">
            Get Started
          </Button>
        </div>
      </Section>
    </div>
  );
};

export default Welcome;
