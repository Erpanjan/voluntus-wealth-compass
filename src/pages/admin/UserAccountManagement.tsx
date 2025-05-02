
import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import AdminLayout from '@/components/admin/AdminLayout';
import { UserFilter } from '@/components/admin/users/UserFilter';
import { UserAccountList } from '@/components/admin/users/UserAccountList';
import { AlertsSection } from '@/components/admin/users/AlertsSection';
import { UserDetailsDialog } from '@/components/admin/users/UserDetailsDialog';
import { ConfirmationDialog } from '@/components/admin/users/ConfirmationDialog';
import { useUserService, UserAccount } from '@/services/userService';
import { TooltipProvider } from '@/components/ui/tooltip';

const UserAccountManagement = () => {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserAccount[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [loadingTimeout, setLoadingTimeout] = useState<NodeJS.Timeout | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false);
  const [showActivateDialog, setShowActivateDialog] = useState(false);
  const [databaseError, setDatabaseError] = useState<string | undefined>(undefined);
  const [connectError, setConnectError] = useState(false);
  const [userDetailsLoading, setUserDetailsLoading] = useState(false);
  const [userDetails, setUserDetails] = useState<any>(null);
  
  const userService = useUserService();
  const { toast } = useToast();

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      setDatabaseError(undefined);
      setConnectError(false);
      
      // Set a timeout to handle stuck loading states
      const timeout = setTimeout(() => {
        setIsLoading(false);
        setConnectError(true);
        toast({
          title: "Connection Timeout",
          description: "Could not connect to the database in a reasonable time",
          variant: "destructive",
        });
      }, 10000);
      
      setLoadingTimeout(timeout);
      
      const fetchedUsers = await userService.fetchUsers();
      
      if (loadingTimeout) clearTimeout(loadingTimeout);
      
      setUsers(fetchedUsers);
      setFilteredUsers(fetchedUsers);
      setIsLoading(false);
    } catch (error) {
      console.error('Error in fetchUsers:', error);
      setDatabaseError((error as Error).message);
      setIsLoading(false);
      
      if (loadingTimeout) clearTimeout(loadingTimeout);
    }
  }, [userService, toast, loadingTimeout]);

  useEffect(() => {
    fetchUsers();
    
    return () => {
      if (loadingTimeout) clearTimeout(loadingTimeout);
    };
  }, [fetchUsers, loadingTimeout]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(users);
      return;
    }

    const lowercaseQuery = searchQuery.toLowerCase();
    const filtered = users.filter(user => 
      user.firstName?.toLowerCase().includes(lowercaseQuery) ||
      user.lastName?.toLowerCase().includes(lowercaseQuery) ||
      user.email?.toLowerCase().includes(lowercaseQuery) ||
      user.userNumber?.toLowerCase().includes(lowercaseQuery)
    );
    
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  const fetchUserDetails = useCallback(async (userId: string) => {
    setUserDetailsLoading(true);
    try {
      const details = await userService.getUserDetails(userId);
      setUserDetails(details);
    } catch (error) {
      console.error('Error fetching user details:', error);
      toast({
        title: "Error",
        description: "Failed to load user details",
        variant: "destructive"
      });
      setUserDetails(null);
    } finally {
      setUserDetailsLoading(false);
    }
  }, [userService, toast]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleRefresh = () => {
    fetchUsers();
  };

  const handleViewDetails = (user: UserAccount) => {
    setSelectedUser(user);
    setShowDetailsDialog(true);
    fetchUserDetails(user.id);
  };

  const handleDelete = (user: UserAccount) => {
    setSelectedUser(user);
    setShowDeleteDialog(true);
  };

  const handleDeactivate = (user: UserAccount) => {
    setSelectedUser(user);
    setShowDeactivateDialog(true);
  };

  const handleActivate = (user: UserAccount) => {
    setSelectedUser(user);
    setShowActivateDialog(true);
  };

  const confirmDelete = async () => {
    if (!selectedUser) return;
    
    const success = await userService.deleteUser(selectedUser.id);
    
    if (success) {
      fetchUsers();
    }
    
    setShowDeleteDialog(false);
  };

  const confirmDeactivate = async () => {
    if (!selectedUser) return;
    
    const success = await userService.updateUserStatus(selectedUser.id, false);
    
    if (success) {
      fetchUsers();
    }
    
    setShowDeactivateDialog(false);
  };

  const confirmActivate = async () => {
    if (!selectedUser) return;
    
    const success = await userService.updateUserStatus(selectedUser.id, true);
    
    if (success) {
      fetchUsers();
    }
    
    setShowActivateDialog(false);
  };

  return (
    <AdminLayout>
      <TooltipProvider>
        <AlertsSection 
          adminPermissionsLimited={true} 
          noUsersFound={!isLoading && filteredUsers.length === 0 && users.length === 0}
          isLoading={isLoading}
          databaseError={databaseError}
          connectError={connectError}
        />
        
        <UserFilter 
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onRefresh={handleRefresh}
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

        {selectedUser && (
          <>
            <UserDetailsDialog 
              isOpen={showDetailsDialog}
              onClose={() => setShowDetailsDialog(false)}
              user={selectedUser}
              userDetails={userDetails}
              isLoading={userDetailsLoading}
            />
            
            <ConfirmationDialog 
              isOpen={showDeleteDialog}
              onClose={() => setShowDeleteDialog(false)}
              onConfirm={confirmDelete}
              user={selectedUser}
              actionType="delete"
            />
            
            <ConfirmationDialog 
              isOpen={showDeactivateDialog}
              onClose={() => setShowDeactivateDialog(false)}
              onConfirm={confirmDeactivate}
              user={selectedUser}
              actionType="deactivate"
            />
            
            <ConfirmationDialog 
              isOpen={showActivateDialog}
              onClose={() => setShowActivateDialog(false)}
              onConfirm={confirmActivate}
              user={selectedUser}
              actionType="activate"
            />
          </>
        )}
      </TooltipProvider>
    </AdminLayout>
  );
};

export default UserAccountManagement;
