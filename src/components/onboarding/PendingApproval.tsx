
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Clock } from 'lucide-react';

const PendingApproval = () => {
  return (
    <div className="text-center max-w-3xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6">Thank You for Your Application</h1>
      <p className="text-lg mb-8">
        Your application is now being reviewed by our team. This process typically takes 1-2 business days.
      </p>
      
      <Card className="max-w-lg mx-auto mb-10">
        <CardContent className="p-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-[#F1F1F1] rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-black" />
            </div>
          </div>
          
          <h2 className="text-xl font-medium mb-4">Application Submitted Successfully</h2>
          <p className="text-gray-600 mb-6">
            We've received your information and will review it shortly. You will receive an email when your account is approved.
          </p>
          
          <div className="flex items-center justify-center space-x-2 text-gray-500">
            <Clock className="h-5 w-5" />
            <span>Estimated approval time: 1-2 business days</span>
          </div>
        </CardContent>
      </Card>
      
      <div className="bg-[#F1F1F1] p-6 rounded-lg max-w-lg mx-auto">
        <p className="text-sm text-gray-600">
          If you have any questions in the meantime, please contact our support team at <span className="font-medium">support@valencecapital.com</span>
        </p>
      </div>
      
      {/* For demo purposes, this would normally be an automatic process */}
      <p className="mt-8 text-sm text-gray-500">
        (For demo purposes, your application will be automatically approved in a few seconds)
      </p>
    </div>
  );
};

export default PendingApproval;
