
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const PendingApproval = () => {
  return (
    <div className="text-center">
      <h1 className="text-3xl font-semibold mb-6">Thank You for Your Application</h1>
      <p className="text-lg mb-8">
        Your application is now being reviewed by our team. This process typically takes 1-2 business days.
      </p>
      
      <Card className="max-w-lg mx-auto">
        <CardContent className="p-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          
          <h2 className="text-xl font-medium mb-4">Application Submitted</h2>
          <p className="text-gray-600 mb-6">
            We've received your information and will review it shortly. You will receive an email when your account is approved.
          </p>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">
              If you have any questions in the meantime, please contact our support team at <span className="font-medium">support@voluntus.com</span>
            </p>
          </div>
        </CardContent>
      </Card>
      
      {/* For demo purposes, this would normally be an automatic process */}
      <p className="mt-8 text-sm text-gray-500">
        (For demo purposes, your application will be automatically approved in a few seconds)
      </p>
    </div>
  );
};

export default PendingApproval;
