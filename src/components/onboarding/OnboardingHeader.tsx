
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { clearUserStateFlags } from '@/hooks/auth/useLocalStorage';

interface OnboardingHeaderProps {
  currentStep: number;
}

const OnboardingHeader: React.FC<OnboardingHeaderProps> = ({ currentStep }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleExitSetup = () => {
    // Set onboardingComplete to true in localStorage
    localStorage.setItem('onboardingComplete', 'true');
    
    // Remove authentication state to properly log out the user
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('isAdminMode');
    
    // Sign out from Supabase
    supabase.auth.signOut();
    
    // Add transition effect to the body
    document.body.classList.add('login-transition');
    
    // Redirect to login after a short delay to allow animation to play
    setTimeout(() => {
      navigate('/login');
    }, 300); // Match this with the CSS animation duration in animations.css
  };
  
  const handleLogout = async () => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      // Clear user state flags if we have a user ID
      if (user) {
        clearUserStateFlags(user.id);
      }
      
      // Sign out from Supabase
      await supabase.auth.signOut();
      
      // Remove authentication state
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('isAdminMode');
      
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out.',
      });
      
      // Add transition effect to the body
      document.body.classList.add('login-transition');
      
      // Redirect to login
      setTimeout(() => {
        navigate('/login');
      }, 300);
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: 'Logout failed',
        description: 'There was a problem signing you out. Please try again.',
        variant: 'destructive',
      });
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
        <div className="flex items-center space-x-4">
          {currentStep < 3 && (
            <Button variant="link" onClick={handleExitSetup}>
              Exit Setup
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleLogout}
            className="flex items-center gap-2 text-[#9F9EA1] hover:text-[#333333]"
          >
            <LogOut size={16} />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default OnboardingHeader;
