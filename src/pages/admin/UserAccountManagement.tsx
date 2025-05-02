
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserTable } from '@/components/admin/users/UserTable';
import { SearchBar } from '@/components/admin/users/SearchBar';
import { ConfirmationDialog } from '@/components/admin/users/ConfirmationDialog';
import { UserDetailsDialog } from '@/components/admin/users/UserDetailsDialog';
import { useUserService, UserAccount } from '@/services/userService';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const UserAccountManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isUserDetailsDialogOpen, setIsUserDetailsDialogOpen] = useState(false);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [actionType, setActionType] = useState<'activate' | 'deactivate' | 'delete'>('activate');
  const { fetchUsers, updateUserStatus, deleteUser, getUserDetails } = useUserService();
  const { toast } = useToast();
  const [adminPermissionsLimited, setAdminPermissionsLimited] = useState(false);
  
  // Fetch users on component mount
  useEffect(() => {
    loadUsers();
  }, []);

  // Load users from the service
  const loadUsers = async () => {
    setIsLoading(true);
    const fetchedUsers = await fetchUsers();
    setUsers(fetchedUsers);
    
    // Check if we got a permission error
    if (fetchedUsers.length > 0) {
      try {
        await supabase.auth.admin.listUsers();
        setAdminPermissionsLimited(false);
      } catch (error) {
        console.log('Admin permissions limited:', error);
        setAdminPermissionsLimited(true);
      }
    }
    
    setIsLoading(false);
  };

  // Handle user account activation/deactivation
  const handleUserStatusChange = (user: UserAccount, action: 'activate' | 'deactivate') => {
    setSelectedUser(user);
    setActionType(action);
    setIsConfirmDialogOpen(true);
  };
  
  // Handle user deletion
  const handleUserDelete = (user: UserAccount) => {
    setSelectedUser(user);
    setActionType('delete');
    setIsConfirmDialogOpen(true);
  };
  
  // Handle user details view
  const handleViewUserDetails = async (user: UserAccount) => {
    setSelectedUser(user);
    setIsUserDetailsDialogOpen(true);
    setIsLoadingDetails(true);
    
    const details = await getUserDetails(user.id);
    setUserDetails(details);
    setIsLoadingDetails(false);
  };

  // Confirm and execute status change or deletion
  const confirmAction = async () => {
    if (!selectedUser) return;
    
    let success = false;
    
    if (actionType === 'delete') {
      success = await deleteUser(selectedUser.id);
      
      if (success) {
        // Remove from UI
        setUsers(prevUsers => prevUsers.filter(u => u.id !== selectedUser.id));
        
        toast({
          title: 'Success',
          description: `User account deleted successfully.`,
        });
      }
    } else {
      // Activate or deactivate
      success = await updateUserStatus(
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
    (user.userNumber && user.userNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (user.firstName && user.firstName.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (user.lastName && user.lastName.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">User Account Management</h1>
        </div>
        
        {adminPermissionsLimited && (
          <Alert variant="warning" className="border-amber-300 bg-amber-50">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <AlertDescription className="text-amber-800">
              Limited admin permissions detected. Some operations (like user deletion at auth level) may not work. User profiles will still be manageable.
            </AlertDescription>
          </Alert>
        )}
        
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
              onDelete={handleUserDelete}
              onViewDetails={handleViewUserDetails}
            />
          </CardContent>
        </Card>
      </div>

      <ConfirmationDialog
        isOpen={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        onConfirm={confirmAction}
        user={selectedUser}
        actionType={actionType}
      />
      
      <UserDetailsDialog 
        isOpen={isUserDetailsDialogOpen}
        onClose={() => setIsUserDetailsDialogOpen(false)}
        user={selectedUser}
        userDetails={userDetails}
        isLoading={isLoadingDetails}
      />
    </AdminLayout>
  );
};

export default UserAccountManagement;
