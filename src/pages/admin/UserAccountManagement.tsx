
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserTable } from '@/components/admin/users/UserTable';
import { SearchBar } from '@/components/admin/users/SearchBar';
import { ConfirmationDialog } from '@/components/admin/users/ConfirmationDialog';
import { useUserService, UserAccount } from '@/services/userService';
import { useToast } from '@/hooks/use-toast';

const UserAccountManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'activate' | 'deactivate'>('activate');
  const { fetchUsers, updateUserStatus } = useUserService();
  const { toast } = useToast();
  
  // Fetch users on component mount
  useEffect(() => {
    loadUsers();
  }, []);

  // Load users from the service
  const loadUsers = async () => {
    setIsLoading(true);
    const fetchedUsers = await fetchUsers();
    setUsers(fetchedUsers);
    setIsLoading(false);
  };

  // Handle user account activation/deactivation
  const handleUserStatusChange = (user: UserAccount, action: 'activate' | 'deactivate') => {
    setSelectedUser(user);
    setActionType(action);
    setIsConfirmDialogOpen(true);
  };

  // Confirm and execute status change
  const confirmStatusChange = async () => {
    if (!selectedUser) return;
    
    const success = await updateUserStatus(
      selectedUser.id, 
      actionType === 'activate'
    );
    
    if (success) {
      // Update local state
      setUsers(prevUsers => 
        prevUsers.map(u => 
          u.id === selectedUser.id
            ? { ...u, status: actionType === 'activate' ? 'Active' : 'Inactive' }
            : u
        )
      );
      
      toast({
        title: 'Success',
        description: `User account ${actionType === 'activate' ? 'activated' : 'deactivated'} successfully.`,
      });
    }
    
    // Close dialog
    setIsConfirmDialogOpen(false);
  };

  // Handle search query change
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  // Filter users based on search query
  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (user.firstName && user.firstName.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (user.lastName && user.lastName.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">User Account Management</h1>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>User Accounts</CardTitle>
            <CardDescription>Manage client user accounts and their status</CardDescription>
            
            <SearchBar 
              searchQuery={searchQuery} 
              onSearchChange={handleSearchChange} 
              onRefresh={loadUsers}
            />
          </CardHeader>
          
          <CardContent>
            <UserTable 
              users={filteredUsers}
              isLoading={isLoading}
              onActivate={(user) => handleUserStatusChange(user, 'activate')}
              onDeactivate={(user) => handleUserStatusChange(user, 'deactivate')}
            />
          </CardContent>
        </Card>
      </div>

      <ConfirmationDialog
        isOpen={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        onConfirm={confirmStatusChange}
        user={selectedUser}
        actionType={actionType}
      />
    </AdminLayout>
  );
};

export default UserAccountManagement;
