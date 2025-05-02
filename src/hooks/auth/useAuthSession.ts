
import { supabase } from '@/integrations/supabase/client';

export const useAuthSession = (setIsAdmin: (isAdmin: boolean) => void) => {
  // Check if user is an admin
  const checkIsAdmin = async (userId: string): Promise<boolean> => {
    try {
      // Now checking admin_users table instead of profiles table
      const { data, error } = await supabase
        .from('admin_users')
        .select('id')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error checking admin status:', error);
        return false;
      }
      
      // If record exists in admin_users, user is an admin
      return !!data;
    } catch (error) {
      console.error('Unexpected error checking admin status:', error);
      return false;
    }
  };

  return { checkIsAdmin };
};
