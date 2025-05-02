
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { clearUserStateFlags } from '@/hooks/auth/useLocalStorage';

interface OnboardingHeaderProps {
  currentStep: number;
}

const OnboardingHeader: React.FC<OnboardingHeaderProps> = ({ currentStep }) => {
  const navigate = useNavigate();
  
  const handleExitSetup = async () => {
    try {
      // Get user ID before signing out
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      // Clear all user-specific flags and Supabase session
      clearUserStateFlags(userId);
      
      // Hard redirect to login page (forces page reload)
      window.location.href = '/login';
    } catch (error) {
      console.error('Error during logout:', error);
      
      // Clear all flags even on error
      clearUserStateFlags();
      
      // Hard redirect to login page (forces page reload)
      window.location.href = '/login';
    }
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
        <Button 
          variant="link" 
          onClick={handleExitSetup}
        >
          Exit Setup
        </Button>
      </div>
    </header>
  );
};

export default OnboardingHeader;
