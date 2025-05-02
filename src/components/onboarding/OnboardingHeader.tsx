
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
      
      // Sign out from Supabase first
      await supabase.auth.signOut();
      
      // Clear all user-specific flags
      clearUserStateFlags(userId);
      
      // Add transition effect to the body
      document.body.classList.add('login-transition');
      
      // Redirect to login after a short delay to ensure session changes are processed
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 500); // Increased from 300ms to 500ms for more reliable session clearing
    } catch (error) {
      console.error('Error during logout:', error);
      // Fallback navigation in case of error
      navigate('/login', { replace: true });
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
