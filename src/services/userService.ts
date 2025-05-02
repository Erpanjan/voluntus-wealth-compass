
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface UserAccount {
  id: string;
  email: string;
  status: string;
  role: string;
  lastLogin: string;
  verified: boolean;
  firstName?: string;
  lastName?: string;
  phone?: string;
  createdAt?: string;
  userNumber?: string; // Added user number field
}

export const useUserService = () => {
  const { toast } = useToast();
  
  const fetchUsers = async (): Promise<UserAccount[]> => {
    try {
      // Get all users from the profiles table - this is accessible with regular permissions
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');
      
      if (profilesError) {
        throw profilesError;
      }
      
      const usersWithAuth: UserAccount[] = [];
      
      // Map profiles to user accounts
      for (const profile of profiles || []) {
        // Skip admin users
        if (profile.is_admin) continue;
        
        // We'll use the email from the profile if available
        const userEmail = profile.email || 'No email';
        
        // Generate a user number based on the first 6 chars of the UUID
        const userNumber = `USR-${profile.id.substring(0, 6).toUpperCase()}`;
          
        usersWithAuth.push({
          id: profile.id,
          email: userEmail,
          status: profile.is_active === false ? 'Inactive' : 'Active',
          role: 'Client',
          lastLogin: profile.updated_at || 'N/A', // Using updated_at as proxy for last login
          verified: true, // Assuming verified by default
          firstName: profile.first_name || '',
          lastName: profile.last_name || '',
          createdAt: profile.created_at || 'N/A',
          userNumber, // Added user number
          phone: profile.phone || 'N/A'
        });
      }
      
      // Try to get users from auth.users if we have admin permissions (this will likely fail without service role key)
      try {
        // This is just an attempt, we don't rely on this working
        const { data: { users } } = await supabase.auth.admin.listUsers();
        
        if (users && users.length > 0) {
          console.log('Successfully retrieved auth users:', users);
          
          // If needed, we could merge with profile data here
        }
      } catch (authError) {
        console.log('Could not fetch auth users with admin permissions:', authError);
        // This is expected if we don't have admin permissions, so we won't show an error
      }
      
      return usersWithAuth;
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch user accounts. Using profiles table data only.',
        variant: 'destructive',
      });
      return [];
    }
  };
  
  const updateUserStatus = async (userId: string, isActive: boolean): Promise<boolean> => {
    try {
      // Update user status in profiles table
      const { error } = await supabase
        .from('profiles')
        .update({ 
          is_active: isActive,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
      
      if (error) throw error;
      
      // Try to update auth status if we have permissions
      try {
        await supabase.auth.admin.updateUserById(
          userId,
          { 
            ban_duration: isActive ? null : 'infinite' 
          }
        );
      } catch (authError) {
        console.log('Could not update auth user status (requires admin permissions):', authError);
        // We'll continue anyway since we updated the profiles table
      }
      
      return true;
    } catch (error: any) {
      console.error(`Error updating user status:`, error);
      toast({
        title: 'Error',
        description: `Failed to update user account status. ${error.message}`,
        variant: 'destructive',
      });
      return false;
    }
  };
  
  const deleteUser = async (userId: string): Promise<boolean> => {
    try {
      // First try to delete the user from auth (requires admin privileges)
      try {
        // Attempt to delete the user using the admin API
        await supabase.auth.admin.deleteUser(userId);
        console.log('Successfully deleted user from auth');
      } catch (authError) {
        console.log('Could not delete auth user (requires admin permissions):', authError);
        // We'll fall back to just marking the profile as deleted
      }
      
      // Even if we can't delete the auth user, we can still mark the profile
      // We'll use a soft delete approach for the profile
      const { error } = await supabase
        .from('profiles')
        .update({ 
          is_active: false,
          is_deleted: true,
          updated_at: new Date().toISOString(),
          email: `deleted_${userId}@deleted.com` // Anonymize the email
        })
        .eq('id', userId);
      
      if (error) throw error;
      
      return true;
    } catch (error: any) {
      console.error(`Error deleting user:`, error);
      toast({
        title: 'Error',
        description: `Failed to delete user account. ${error.message}`,
        variant: 'destructive',
      });
      return false;
    }
  };
  
  const getUserDetails = async (userId: string): Promise<any> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) throw error;
      
      return data;
    } catch (error: any) {
      console.error(`Error fetching user details:`, error);
      toast({
        title: 'Error',
        description: `Failed to fetch user details. ${error.message}`,
        variant: 'destructive',
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
