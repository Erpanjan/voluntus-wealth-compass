
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
  phone?: string; // Made optional
  createdAt?: string;
  userNumber?: string;
}

export const useUserService = () => {
  const { toast } = useToast();
  
  const fetchUsers = async (): Promise<UserAccount[]> => {
    try {
      console.log('Fetching users from profiles table...');
      
      // Get all users from the profiles table - this is accessible with regular permissions
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');
      
      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }
      
      console.log(`Fetched ${profiles?.length || 0} profiles from database:`, profiles);
      
      const usersWithAuth: UserAccount[] = [];
      
      // Map profiles to user accounts
      if (profiles) {
        console.log(`Processing ${profiles.length} profiles...`);
      } else {
        console.log('No profiles found in the database');
      }
      
      // Map profiles to user accounts
      for (const profile of profiles || []) {
        // Clearly log each profile processing step
        console.log(`Processing profile:`, profile);
        
        // Skip admin accounts completely - they should not appear in the user list at all
        if (profile.is_admin) {
          console.log(`Skipping admin profile ${profile.id}`);
          continue;
        }
        
        // We'll use the email from the profile if available
        const userEmail = profile.email || 'No email';
        
        // Generate a user number based on the first 6 chars of the UUID
        const userNumber = `USR-${profile.id.substring(0, 6).toUpperCase()}`;
          
        const userAccount = {
          id: profile.id,
          email: userEmail,
          status: profile.is_active === false ? 'Inactive' : 'Active',
          role: profile.is_admin ? 'Admin' : 'Client',
          lastLogin: profile.updated_at || 'N/A', // Using updated_at as proxy for last login
          verified: true, // Assuming verified by default
          firstName: profile.first_name || '',
          lastName: profile.last_name || '',
          createdAt: profile.created_at || 'N/A',
          userNumber, // Added user number
        };
        
        // Add phone only if it exists in profile
        // This fixes the TypeScript error by avoiding direct access to a potentially non-existent property
        if ('phone' in profile && profile.phone) {
          userAccount.phone = profile.phone;
        }
        
        console.log(`Added user account:`, userAccount);
        usersWithAuth.push(userAccount);
      }
      
      console.log(`Processed ${usersWithAuth.length} users to display:`, usersWithAuth);
      
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
      
      // We know we can't update auth status, so we'll just skip that part
      console.log('Updated user status in profiles table only (limited admin permissions)');
      
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
      console.log(`Attempting to delete user ${userId} (soft delete in profiles table)`);
      
      // We'll use a soft delete approach for the profile since we can't delete auth users
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
      
      console.log(`Successfully soft-deleted user ${userId} in profiles table`);
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
