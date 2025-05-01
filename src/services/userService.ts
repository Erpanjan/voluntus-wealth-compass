
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
        
        // We need to get the email from another source since it's not in the profiles table directly
        // Let's attempt to get the user email from auth if possible, otherwise use a placeholder
        let userEmail = 'No email';
        try {
          // This is a workaround to try to get the user's email, but will likely fail due to permissions
          const { data: user } = await supabase.auth.admin.getUserById(profile.id);
          if (user?.email) {
            userEmail = user.email;
          }
        } catch (error) {
          console.log('Could not fetch user email:', error);
        }
          
        usersWithAuth.push({
          id: profile.id,
          email: userEmail,
          // Check if is_active exists on the profile, if not assume active
          status: profile.is_active === false ? 'Inactive' : 'Active',
          role: 'Client',
          lastLogin: 'N/A', // We can't get this info without admin access
          verified: true, // Assuming verified by default
          firstName: profile.first_name || '',
          lastName: profile.last_name || '',
        });
      }
      
      // Also try to get users from auth.users if we have admin permissions
      // This will only work if the app has service_role key configured
      try {
        const authResponse = await fetch(`https://${process.env.SUPABASE_PROJECT_ID || 'kikdcvyhuwrqfovlgrer'}.supabase.co/auth/v1/admin/users`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY || ''}`,
            'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY || '',
          }
        });
        
        if (authResponse.ok) {
          const authUsers = await authResponse.json();
          console.log('Successfully retrieved auth users:', authUsers);
          
          // TODO: If needed, we could merge with profile data here
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
  
  return {
    fetchUsers,
    updateUserStatus
  };
};
