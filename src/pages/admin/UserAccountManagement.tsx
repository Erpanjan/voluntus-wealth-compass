
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { UserAccountList } from '@/components/admin/users/UserAccountList';
import { AlertsSection } from '@/components/admin/users/AlertsSection';
import { UserFilter } from '@/components/admin/users/UserFilter';
import { useUserService, UserAccount } from '@/services/userService';
import { useToast } from '@/hooks/use-toast';

const UserAccountManagement = () => {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserAccount[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [adminPermissionsLimited, setAdminPermissionsLimited] = useState(false);
  const { fetchUsers } = useUserService();
  const { toast } = useToast();

  // Fetch users on page load
  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true);
      try {
        const userData = await fetchUsers();
        setUsers(userData);
        setFilteredUsers(userData);
      } catch (error) {
        console.error('Error loading users:', error);
        toast({
          title: "Error loading users",
          description: "Please try again later or contact support",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, [fetchUsers, toast]);

  // Filter users based on search query
  useEffect(() => {
    if (!searchQuery) {
      setFilteredUsers(users);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = users.filter(user => 
      user.email?.toLowerCase().includes(query) ||
      user.firstName?.toLowerCase().includes(query) ||
      user.lastName?.toLowerCase().includes(query) ||
      user.userNumber?.toLowerCase().includes(query)
    );
    
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  // Handle search input change
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  // Handle refresh button click
  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const userData = await fetchUsers();
      setUsers(userData);
      setFilteredUsers(userData);
      toast({
        title: "Refreshed",
        description: "User data has been refreshed",
      });
    } catch (error) {
      console.error('Error refreshing users:', error);
      toast({
        title: "Error refreshing users",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Placeholder handler functions to pass to components
  const handleActivate = (user: UserAccount) => {};
  const handleDeactivate = (user: UserAccount) => {};
  const handleDelete = (user: UserAccount) => {};
  const handleViewDetails = (user: UserAccount) => {};

  return (
    <AdminLayout>
      <div className="space-y-6">
        <UserFilter 
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onRefresh={handleRefresh}
          isLoading={isLoading}
        />
        
        <AlertsSection 
          adminPermissionsLimited={adminPermissionsLimited}
          noUsersFound={!isLoading && filteredUsers.length === 0}
          isLoading={isLoading}
        />
        
        <UserAccountList 
          users={filteredUsers}
          isLoading={isLoading}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onRefresh={handleRefresh}
          onActivate={handleActivate}
          onDeactivate={handleDeactivate}
          onDelete={handleDelete}
          onViewDetails={handleViewDetails}
        />
      </div>
    </AdminLayout>
  );
};

export default UserAccountManagement;
