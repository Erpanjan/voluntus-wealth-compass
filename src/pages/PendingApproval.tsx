import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import OnboardingHeader from '@/components/onboarding/OnboardingHeader';
import { CheckCircle, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

const PendingApproval = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  // Add authentication check and status verification
  useEffect(() => {
    const checkAuthAndStatus = async () => {
      try {
        // Verify session exists
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.log('No valid session found in PendingApproval page, redirecting to login');
          navigate('/login', { replace: true });
          return;
        }
        
        // Verify this is the correct page based on onboarding status
        const { data, error } = await supabase
          .from('onboarding_data')
          .select('status')
          .eq('id', session.user.id)
          .maybeSingle();
          
        if (error) {
          console.error('Error checking onboarding status:', error);
          // Show the pending page anyway on error
          setAuthorized(true);
        } else if (data) {
          // If user hasn't submitted application yet, redirect to welcome or onboarding
          if (data.status === 'draft') {
            navigate('/welcome', { replace: true });
            return;
          }
          // If user's application is approved, redirect to dashboard
          else if (data.status === 'approved') {
            navigate('/dashboard', { replace: true });
            return;
          }
          // Otherwise, this is the correct page for a submitted/pending application
          setAuthorized(true);
        } else {
          // No onboarding data, redirect to welcome
          navigate('/welcome', { replace: true });
          return;
        }
      } catch (error) {
        console.error('Auth check error:', error);
        navigate('/login', { replace: true });
      } finally {
        setLoading(false);
      }
    };
    
    checkAuthAndStatus();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <OnboardingHeader currentStep={3} />
        <div className="container mx-auto px-6 py-8">
          <div className="text-center max-w-3xl mx-auto">
            <Skeleton className="h-10 w-3/4 mx-auto mb-6" />
            <Skeleton className="h-6 w-full mx-auto mb-8" />
            <Skeleton className="h-64 w-full max-w-lg mx-auto mb-8 rounded-lg" />
            <Skeleton className="h-24 w-full max-w-lg mx-auto rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return null; // Will navigate away, no need to render anything
  }

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
          
          <div className="bg-[#F1F1F1] p-5 rounded-lg max-w-lg mx-auto">
            <p className="text-sm text-gray-600 font-inter font-light">
              If you have any questions in the meantime, please contact our support team at <span className="font-medium">support@valencecapital.com</span>
            </p>
          </div>
          
          {/* For demo purposes only */}
          <p className="mt-6 text-xs text-gray-500 font-inter">
            (For demo purposes, you can manually navigate to the dashboard when ready)
          </p>
        </div>
      </div>
    </div>
  );
};

export default PendingApproval;
