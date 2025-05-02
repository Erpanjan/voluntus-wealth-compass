
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface UserAccount {
  id: string;
  email: string;
  status: string;
  role: string;
  lastLogin?: string;
  verified?: boolean;
  firstName?: string;
  lastName?: string;
  phone?: string;
  createdAt?: string;
  userNumber?: string;
}

export const useUserService = () => {
  const { toast } = useToast();
  
  const fetchUsers = async (): Promise<UserAccount[]> => {
    try {
      // Fetch only non-admin users from the profiles table
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, created_at, first_name, last_name, is_active')
        .eq('is_admin', false);
      
      if (error) {
        console.error('Error fetching users:', error);
        toast({
          title: "Error",
          description: "Failed to fetch user accounts",
          variant: "destructive",
        });
        return [];
      }
      
      // Transform the data to match our UserAccount interface
      return data.map(user => ({
        id: user.id,
        email: user.email || 'No email',
        status: user.is_active ? 'Active' : 'Inactive',
        role: 'Client', // All non-admin users are considered clients
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        createdAt: user.created_at ? new Date(user.created_at).toLocaleString() : 'Unknown',
        userNumber: user.id.substring(0, 8).toUpperCase(), // First 8 characters of UUID as user number
      }));
    } catch (err) {
      console.error('Unexpected error fetching users:', err);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return [];
    }
  };
  
  const updateUserStatus = async (userId: string, isActive: boolean): Promise<boolean> => {
    // Stub implementation
    return true;
  };
  
  const deleteUser = async (userId: string): Promise<boolean> => {
    // Stub implementation
    return true;
  };
  
  const getUserDetails = async (userId: string): Promise<any> => {
    // Stub implementation
    return null;
  };
  
  return {
    fetchUsers,
    updateUserStatus,
    deleteUser,
    getUserDetails
  };
};
