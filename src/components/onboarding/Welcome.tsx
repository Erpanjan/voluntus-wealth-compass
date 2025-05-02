
import React from 'react';
import { User, FileText, Calendar } from 'lucide-react';

const Welcome = () => {
  return (
    <div className="text-center">
      <h1 className="text-3xl md:text-4xl font-semibold mb-6">Welcome to Valence Long-Term Capital</h1>
      
      <p className="text-lg mb-10 max-w-3xl mx-auto text-voluntus-gray-medium">
        We're excited to have you on board. Before we can begin delivering our personalized 
        financial services, we kindly ask you to complete a few important steps:
      </p>
      
      <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
        <div className="bg-white p-8 rounded-3xl shadow-soft border border-gray-100 transition-all duration-300 hover:shadow-hover relative overflow-hidden">
          <div className="absolute top-0 left-0 h-2 w-full bg-gray-300"></div>
          <div className="flex items-center mb-6">
            <div className="bg-[#F1F1F1] p-3 rounded-full mr-4">
              <User className="h-6 w-6 text-black" />
            </div>
            <div className="text-xl font-semibold flex items-center">
              <span className="bg-gray-200 text-gray-600 w-7 h-7 rounded-full flex items-center justify-center text-sm mr-3">1</span>
              Create Your Profile
            </div>
          </div>
          <p className="text-gray-600 ml-16">
            This is the first step. Tell us a bit about yourself so we can tailor your digital 
            experience throughout our service.
          </p>
        </div>
        
        <div className="bg-white p-8 rounded-3xl shadow-soft border border-gray-100 transition-all duration-300 hover:shadow-hover relative overflow-hidden">
          <div className="absolute top-0 left-0 h-2 w-full bg-gray-300"></div>
          <div className="flex items-center mb-6">
            <div className="bg-[#F1F1F1] p-3 rounded-full mr-4">
              <FileText className="h-6 w-6 text-black" />
            </div>
            <div className="text-xl font-semibold flex items-center">
              <span className="bg-gray-200 text-gray-600 w-7 h-7 rounded-full flex items-center justify-center text-sm mr-3">2</span>
              Complete the Questionnaire
            </div>
          </div>
          <p className="text-gray-600 ml-16">
            Help us understand your financial circumstances and investment goals. This step is optional, 
            but it allows us to provide more relevant and meaningful advice.
          </p>
        </div>
        
        <div className="bg-white p-8 rounded-3xl shadow-soft border border-gray-100 transition-all duration-300 hover:shadow-hover relative overflow-hidden">
          <div className="absolute top-0 left-0 h-2 w-full bg-gray-300"></div>
          <div className="flex items-center mb-6">
            <div className="bg-[#F1F1F1] p-3 rounded-full mr-4">
              <Calendar className="h-6 w-6 text-black" />
            </div>
            <div className="text-xl font-semibold flex items-center">
              <span className="bg-gray-200 text-gray-600 w-7 h-7 rounded-full flex items-center justify-center text-sm mr-3">3</span>
              Schedule a Consultation
            </div>
          </div>
          <p className="text-gray-600 ml-16">
            Book a session with one of our advisors. We'll have an in-depth conversation about your 
            financial situation and verify key details.
          </p>
        </div>
      </div>
      
      <div className="mt-12 text-lg text-voluntus-gray-medium animate-fade-in">
        <p>Once you've completed these steps, our team will review your application and follow up shortly.</p>
      </div>
    </div>
  );
};

export default Welcome;
