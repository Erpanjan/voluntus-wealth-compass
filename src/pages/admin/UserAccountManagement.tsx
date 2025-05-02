
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useUserService, UserProfile } from '@/services/userService';
import { useToast } from '@/hooks/use-toast';
import { AlertsSection } from '@/components/admin/users/AlertsSection';
import { UserFilter } from '@/components/admin/users/UserFilter';
import { UserAccountList } from '@/components/admin/users/UserAccountList';

const UserAccountManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [noUsersFound, setNoUsersFound] = useState(false);
  const { fetchUsers, updateUserStatus } = useUserService();
  const { toast } = useToast();
  
  // Fetch users on component mount
  useEffect(() => {
    loadUsers();
  }, []);

  // Load users from the service
  const loadUsers = async () => {
    setIsLoading(true);
    console.log('Loading profiles...');
    
    try {
      const fetchedProfiles = await fetchUsers();
      console.log('Fetched profiles:', fetchedProfiles);
      
      setUsers(fetchedProfiles);
      setNoUsersFound(fetchedProfiles.length === 0);
      
      if (fetchedProfiles.length > 0) {
        toast({
          title: 'Success',
          description: `Loaded ${fetchedProfiles.length} user profiles`,
        });
      }
    } catch (error) {
      console.error('Error loading profiles:', error);
      toast({
        title: 'Error',
        description: 'Failed to load user profiles. Please check your connection.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle user status update
  const handleUpdateUserStatus = async (userId: string, isActive: boolean) => {
    try {
      await updateUserStatus(userId, isActive);
      // Refresh the user list after updating a user's status
      await loadUsers();
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  // Handle search query change
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  // Filter users based on search query
  const filteredUsers = users.filter(user => {
    const searchLower = searchQuery.toLowerCase();
    return (
      (user.email && user.email.toLowerCase().includes(searchLower)) || 
      (user.first_name && user.first_name.toLowerCase().includes(searchLower)) ||
      (user.last_name && user.last_name.toLowerCase().includes(searchLower))
    );
  });
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <UserFilter 
          searchQuery={searchQuery} 
          onSearchChange={handleSearchChange} 
          onRefresh={loadUsers}
          isLoading={isLoading}
        />
        
        <AlertsSection 
          noUsersFound={noUsersFound}
          isLoading={isLoading}
        />
        
        <UserAccountList 
          users={filteredUsers}
          isLoading={isLoading}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onRefresh={loadUsers}
          onUpdateUserStatus={handleUpdateUserStatus}
        />
      </div>
    </AdminLayout>
  );
};

export default UserAccountManagement;
