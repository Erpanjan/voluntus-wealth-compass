
import React from 'react';

const Welcome = () => {
  return (
    <div className="text-center">
      <h1 className="text-3xl md:text-4xl font-semibold mb-6">Welcome to Voluntus Long-Term Capital</h1>
      
      <p className="text-lg mb-10 max-w-2xl mx-auto">
        We're excited to have you join us. Let's set up your account to create personalized 
        investment solutions tailored to your financial journey.
      </p>
      
      <div className="grid md:grid-cols-3 gap-8 mt-12">
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="font-medium text-xl mb-3">Personalized Strategy</h3>
          <p className="text-gray-600">
            We'll create a customized financial plan based on your unique goals and circumstances.
          </p>
        </div>
        
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="font-medium text-xl mb-3">Expert Guidance</h3>
          <p className="text-gray-600">
            Connect with our financial advisors who will help you navigate your investment journey.
          </p>
        </div>
        
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="font-medium text-xl mb-3">Long-Term Focus</h3>
          <p className="text-gray-600">
            Our strategies are designed for sustainable growth and long-term financial security.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
