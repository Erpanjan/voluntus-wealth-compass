
import { supabase } from '@/integrations/supabase/client';

export const useAuthSession = (setIsAdmin: (isAdmin: boolean) => void) => {
  // Check if user is an admin
  const checkIsAdmin = async (userId: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error checking admin status:', error);
        return false;
      }
      
      return !!data?.is_admin;
    } catch (error) {
      console.error('Unexpected error checking admin status:', error);
      return false;
    }
  };

  return { checkIsAdmin };
};
