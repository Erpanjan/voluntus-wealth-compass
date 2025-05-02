
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import OnboardingHeader from '@/components/onboarding/OnboardingHeader';
import { CheckCircle, Clock, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { clearUserStateFlags } from '@/hooks/auth/useLocalStorage';

const PendingApproval = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleLogout = async () => {
    try {
      // Clear all user state
      clearUserStateFlags();
      
      // Remove authentication state
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('isAdminMode');
      
      // Sign out from Supabase
      await supabase.auth.signOut();
      
      toast({
        title: "Logged out successfully",
        description: "You have been signed out of your account."
      });
      
      // Add transition effect
      document.body.classList.add('login-transition');
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 500);
    } catch (error) {
      console.error('Error during logout:', error);
      toast({
        title: "Logout Error",
        description: "There was a problem signing you out. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="min-h-screen bg-white">
      <OnboardingHeader currentStep={3} />
      
      <div className="container mx-auto px-6 py-8">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-3xl font-inter font-semibold mb-4">Thank You for Your Application</h1>
          <p className="text-sm md:text-base font-inter text-gray-600 mb-6">
            Your application is now being reviewed by our team. This process typically takes 1-2 business days.
          </p>
          
          <Card className="max-w-lg mx-auto mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="w-14 h-14 bg-[#F1F1F1] rounded-full flex items-center justify-center">
                  <CheckCircle className="h-7 w-7 text-black" />
                </div>
              </div>
              
              <h2 className="text-xl font-inter font-medium mb-3">Application Submitted Successfully</h2>
              <p className="text-gray-600 font-inter font-light text-sm mb-4">
                We've received your information and will review it shortly. You will receive an email when your account is approved.
              </p>
              
              <div className="flex items-center justify-center space-x-2 text-gray-500 font-inter">
                <Clock className="h-5 w-5" />
                <span className="text-sm">Estimated approval time: 1-2 business days</span>
              </div>
            </CardContent>
          </Card>
          
          <div className="bg-[#F1F1F1] p-5 rounded-lg max-w-lg mx-auto mb-6">
            <p className="text-sm text-gray-600 font-inter font-light">
              If you have any questions in the meantime, please contact our support team at <span className="font-medium">support@valencecapital.com</span>
            </p>
          </div>
          
          <Button 
            variant="outline" 
            className="flex items-center gap-2 mx-auto mt-6" 
            onClick={handleLogout}
          >
            <LogOut size={16} />
            Sign Out
          </Button>
          
          <p className="mt-6 text-xs text-gray-500 font-inter">
            (For demo purposes, you can sign out and try logging in again)
          </p>
        </div>
      </div>
    </div>
  );
};

export default PendingApproval;
