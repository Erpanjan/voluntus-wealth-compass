
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { LogOut } from 'lucide-react';
import { clearUserStateFlags } from '@/hooks/auth/useLocalStorage';

interface OnboardingHeaderProps {
  currentStep: number;
}

const OnboardingHeader: React.FC<OnboardingHeaderProps> = ({ currentStep }) => {
  const navigate = useNavigate();
  
  const handleExitSetup = async () => {
    // Get user ID before signing out
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    
    // Clear all user-specific flags
    clearUserStateFlags(userId);
    
    // Remove authentication state to properly log out the user
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('isAdminMode');
    
    // Sign out from Supabase
    await supabase.auth.signOut();
    
    // Add transition effect to the body
    document.body.classList.add('login-transition');
    
    // Redirect to login after a short delay to allow animation to play
    setTimeout(() => {
      navigate('/login');
    }, 300); // Match this with the CSS animation duration in animations.css
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
          variant="outline" 
          onClick={handleExitSetup} 
          className="flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Exit Setup
        </Button>
      </div>
    </header>
  );
};

export default OnboardingHeader;
