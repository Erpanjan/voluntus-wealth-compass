
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface UserAccount {
  id: string;
  email: string;
  status: string;
  role: string;
  phone?: string;
  lastLogin?: string;
  verified?: boolean;
  firstName?: string;
  lastName?: string;
  createdAt?: string;
  userNumber?: string;
}

export const useUserService = () => {
  const { toast } = useToast();
  
  const fetchUsers = async (): Promise<UserAccount[]> => {
    try {
      console.log('Fetching user accounts from profiles table...');
      
      // Fetch only non-admin users from the profiles table
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, created_at, first_name, last_name, is_active, phone')
        .eq('is_admin', false);
      
      if (error) {
        console.error('Error fetching users:', error.message, error.details, error.hint);
        toast({
          title: "Error",
          description: `Failed to fetch user accounts: ${error.message}`,
          variant: "destructive",
        });
        return [];
      }
      
      if (!data || data.length === 0) {
        console.log('No user profiles found');
        return [];
      }
      
      console.log(`Found ${data.length} user profiles`);
      
      // Transform the data to match our UserAccount interface
      return data.map(user => ({
        id: user.id,
        email: user.email || 'No email',
        status: user.is_active ? 'Active' : 'Inactive',
        role: 'Client', // All non-admin users are considered clients
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        phone: user.phone || '',
        createdAt: user.created_at ? new Date(user.created_at).toLocaleString() : 'Unknown',
        userNumber: user.id.substring(0, 8).toUpperCase(), // First 8 characters of UUID as user number
      }));
    } catch (err) {
      const error = err as Error;
      console.error('Unexpected error fetching users:', error.message, error.stack);
      toast({
        title: "Error",
        description: `An unexpected error occurred: ${error.message}`,
        variant: "destructive",
      });
      return [];
    }
  };
  
  const updateUserStatus = async (userId: string, isActive: boolean): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: isActive })
        .eq('id', userId);
      
      if (error) {
        console.error('Error updating user status:', error);
        toast({
          title: "Error",
          description: `Failed to update user status: ${error.message}`,
          variant: "destructive",
        });
        return false;
      }
      
      toast({
        title: "Success",
        description: `User status updated successfully`,
      });
      return true;
    } catch (err) {
      const error = err as Error;
      console.error('Unexpected error updating user status:', error.message);
      toast({
        title: "Error",
        description: `An unexpected error occurred: ${error.message}`,
        variant: "destructive",
      });
      return false;
    }
  };
  
  const deleteUser = async (userId: string): Promise<boolean> => {
    try {
      // Note: This only marks the user as inactive in the profiles table
      // To fully delete a user, you would need admin rights in Supabase
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: false })
        .eq('id', userId);
      
      if (error) {
        console.error('Error deactivating user:', error);
        toast({
          title: "Error",
          description: `Failed to deactivate user: ${error.message}`,
          variant: "destructive",
        });
        return false;
      }
      
      toast({
        title: "Success",
        description: "User deactivated successfully",
      });
      return true;
    } catch (err) {
      const error = err as Error;
      console.error('Unexpected error deactivating user:', error.message);
      toast({
        title: "Error",
        description: `An unexpected error occurred: ${error.message}`,
        variant: "destructive",
      });
      return false;
    }
  };
  
  const getUserDetails = async (userId: string): Promise<UserAccount | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, created_at, first_name, last_name, is_active, phone')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching user details:', error);
        toast({
          title: "Error",
          description: `Failed to fetch user details: ${error.message}`,
          variant: "destructive",
        });
        return null;
      }
      
      return {
        id: data.id,
        email: data.email || 'No email',
        status: data.is_active ? 'Active' : 'Inactive',
        role: 'Client',
        firstName: data.first_name || '',
        lastName: data.last_name || '',
        phone: data.phone || '',
        createdAt: data.created_at ? new Date(data.created_at).toLocaleString() : 'Unknown',
        userNumber: data.id.substring(0, 8).toUpperCase(),
      };
    } catch (err) {
      const error = err as Error;
      console.error('Unexpected error fetching user details:', error.message);
      toast({
        title: "Error",
        description: `An unexpected error occurred: ${error.message}`,
        variant: "destructive",
      });
      return null;
    }
  };
  
  return {
    fetchUsers,
    updateUserStatus,
    deleteUser,
    getUserDetails
  };
};
