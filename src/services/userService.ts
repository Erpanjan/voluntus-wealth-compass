
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface UserProfile {
  id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  is_active: boolean | null;
  is_admin: boolean | null;
  phone: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export const useUserService = () => {
  const { toast } = useToast();
  
  const fetchUsers = async (): Promise<UserProfile[]> => {
    try {
      console.log('Fetching profiles from Supabase...');
      
      // Get all profiles from the public.profiles table
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*');
      
      if (error) {
        console.error('Error fetching profiles:', error);
        throw error;
      }
      
      console.log(`Fetched ${profiles?.length || 0} profiles from database`);
      console.log('Raw profiles data:', profiles);
      
      // Return all profiles - we're not filtering out admin users anymore
      // since we want to see all user accounts in the management interface
      return profiles || [];
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch user profiles. Please try again later.',
        variant: 'destructive',
      });
      return [];
    }
  };
  
  return {
    fetchUsers
  };
};
