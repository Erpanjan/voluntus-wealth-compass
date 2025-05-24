
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Section from '@/components/ui/Section';
import OnboardingHeader from '@/components/onboarding/OnboardingHeader';
import { User, FileText, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

const Welcome = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  // Add thorough authentication check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Verify session exists
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.log('No valid session found in Welcome page, redirecting to login');
          navigate('/login', { replace: true });
          return;
        }
        
        // Double check that this is where the user should be based on onboarding status
        const { data, error } = await supabase
          .from('onboarding_data')
          .select('status, first_name, last_name')
          .eq('id', session.user.id)
          .maybeSingle();
          
        if (error) {
          console.error('Error checking onboarding status:', error);
          // Continue showing welcome page on error
        } else if (data) {
          // If user has already submitted their application, redirect to pending page
          if (data.status === 'submitted' || data.status === 'pending') {
            navigate('/pending-approval', { replace: true });
            return;
          }
          // If user's application is approved, redirect to dashboard
          else if (data.status === 'approved') {
            navigate('/dashboard', { replace: true });
            return;
          }
          // If user has started onboarding but not submitted, redirect to onboarding
          else if (data.status === 'draft' && (data.first_name || data.last_name)) {
            navigate('/onboarding', { replace: true });
            return;
          }
        }
        
        setAuthenticated(true);
      } catch (error) {
        console.error('Auth check error:', error);
        navigate('/login', { replace: true });
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [navigate]);

  const handleGetStarted = () => {
    navigate('/onboarding');
  };

  // Only render content when authenticated, otherwise show loading
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <OnboardingHeader currentStep={0} />
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-10 w-3/4 mx-auto mb-6" />
            <Skeleton className="h-6 w-full mx-auto mb-8" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-64 w-full rounded-3xl" />
              ))}
            </div>
            
            <Skeleton className="h-12 w-40 mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  // This will only render if authentication check passed
  return (
    <div className="min-h-screen bg-white">
      <OnboardingHeader currentStep={0} />
      
      <Section className="pt-2">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-inter font-semibold mb-4 tracking-tight">
            Welcome to Voluntas
          </h1>
          
          <p className="text-sm md:text-base font-inter text-gray-600 mb-6 max-w-3xl mx-auto">
            We're excited to have you on board. Before we can begin offering our services, 
            we kindly ask you to complete a few important steps. Once you've completed the these steps, 
            our team will review your application and follow up shortly.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-3xl shadow-soft border border-gray-100 transition-all duration-300 hover:shadow-hover">
              <div className="h-14 w-14 rounded-full bg-[#F1F1F1] flex items-center justify-center mx-auto mb-4">
                <User className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-inter font-medium mb-3">1. Create Your Profile</h3>
              <p className="text-gray-600 font-inter font-light text-sm">
                Start by telling us a bit about yourself. This helps us personalize your digital experience.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-3xl shadow-soft border border-gray-100 transition-all duration-300 hover:shadow-hover">
              <div className="h-14 w-14 rounded-full bg-[#F1F1F1] flex items-center justify-center mx-auto mb-4">
                <FileText className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-inter font-medium mb-3">2. Financial Questionnaire</h3>
              <p className="text-gray-600 font-inter font-light text-sm">
                This questionnaire is designed to help us understand your financial circumstances. 
                While completing it is optional at this stage, it will be required before we can 
                officially begin our service. You're welcome to skip it for now and complete it during consultation.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-3xl shadow-soft border border-gray-100 transition-all duration-300 hover:shadow-hover">
              <div className="h-14 w-14 rounded-full bg-[#F1F1F1] flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-inter font-medium mb-3">3. Schedule a Consultation</h3>
              <p className="text-gray-600 font-inter font-light text-sm">
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
