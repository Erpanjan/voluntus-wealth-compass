
import { NavigateFunction } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { Toast } from '@/hooks/auth/types';

export interface AdminCheckResult {
  isAdmin: boolean;
  redirected: boolean;
}

export const useAdminAuthChecker = (
  navigate: NavigateFunction,
  toast: Toast,
  setIsAdmin: (isAdmin: boolean) => void
) => {
  // Check if user is an admin and handle admin-specific routes
  const checkAdminAccess = async (
    userId: string,
    session: Session,
    isAdminMode: boolean
  ): Promise<AdminCheckResult> => {
    try {
      // Check if user is in admin_users table
      const { data, error } = await supabase
        .from('admin_users')
        .select('id')
        .eq('id', userId)
        .single();
      
      const isUserAdmin = !!data && !error;
      
      if (isUserAdmin) {
        localStorage.setItem('isAdminMode', 'true');
        setIsAdmin(true);
        
        // If currently on admin route, no need to navigate
        if (window.location.pathname.startsWith('/admin')) {
          return { isAdmin: true, redirected: false };
        }
        
        navigate('/admin/dashboard');
        return { isAdmin: true, redirected: true };
      } else {
        // If not an admin but trying to access admin routes,
        // show error and redirect
        localStorage.removeItem('isAdminMode');
        
        if (isAdminMode) {
          toast({
            title: "Access Denied",
            description: "Your account does not have admin privileges.",
            variant: "destructive",
            duration: 5000,
          });
          
          await supabase.auth.signOut();
          return { isAdmin: false, redirected: true };
        }
      }
      
      return { isAdmin: false, redirected: false };
    } catch (error) {
      console.error('Error checking admin status:', error);
      return { isAdmin: false, redirected: false };
    }
  };

  return { checkAdminAccess };
};
