
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { clearPortalSpecificFlags } from '@/hooks/auth/useLocalStorage';
import { usePortalContext } from '@/hooks/auth/usePortalContext';

interface OnboardingHeaderProps {
  currentStep: number;
}

const OnboardingHeader: React.FC<OnboardingHeaderProps> = ({ currentStep }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { switchToPortal } = usePortalContext('client');
  
  const handleExitSetup = async () => {
    try {
      // Add transition effect to the body
      document.body.classList.add('login-transition');
      
      // Clear all client-specific localStorage flags first
      clearPortalSpecificFlags('client');
      
      // Remove authentication state
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('isAdminMode');
      
      // Reset portal context to client
      localStorage.setItem('portalContext', 'client');
      switchToPortal('client');
      
      // Sign out from Supabase
      await supabase.auth.signOut();
      
      // Provide feedback to user
      toast({
        title: "Logged out successfully",
        description: "You have been signed out of your account."
      });
      
      // Redirect to login after a short delay to allow animation to play
      // and ensure session is properly cleared
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
    } finally {
      // Clean up transition class after navigation
      setTimeout(() => {
        document.body.classList.remove('login-transition');
      }, 1000);
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
        {/* Show Exit Setup button on all onboarding pages */}
        <Button variant="link" onClick={handleExitSetup}>
          Exit Setup
        </Button>
      </div>
    </header>
  );
};

export default OnboardingHeader;
