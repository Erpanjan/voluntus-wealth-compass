
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export const useDemoAccount = (isAdminMode: boolean) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Handle demo account login
  const handleDemoLogin = () => {
    localStorage.setItem('isAuthenticated', 'true');
    
    // Set admin mode in localStorage if toggle is on
    if (isAdminMode) {
      localStorage.setItem('isAdminMode', 'true');
      navigate('/admin/dashboard');
    } else {
      localStorage.removeItem('isAdminMode');
      // Demo users go directly to welcome page
      navigate('/welcome');
    }
    
    toast({
      title: isAdminMode ? "Admin Demo Account Activated" : "Demo Account Activated",
      description: isAdminMode 
        ? "You are now using a demo admin account to explore the admin portal." 
        : "You are now using a demo account to explore the platform.",
      duration: 5000,
    });
  };

  return { handleDemoLogin };
};
