
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle, XCircle, User, Search, Filter, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface UserAccount {
  id: string;
  email: string;
  status: string;
  role: string;
  lastLogin: string;
  verified: boolean;
  firstName?: string;
  lastName?: string;
}

const UserAccountManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'activate' | 'deactivate'>('activate');
  const { toast } = useToast();
  
  // Fetch users from Supabase on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch users from both auth.users and profiles tables
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      
      // First, get the auth users
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        throw authError;
      }
      
      // Then get the profiles for additional information
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');
      
      if (profilesError) {
        throw profilesError;
      }
      
      // Map the auth users to our UserAccount interface
      const mappedUsers: UserAccount[] = authUsers.users.map(user => {
        // Find the corresponding profile
        const profile = profiles?.find(p => p.id === user.id);
        
        // Skip admin users
        if (profile?.is_admin) {
          return null;
        }
        
        return {
          id: user.id,
          email: user.email || 'No email',
          status: user.banned ? 'Inactive' : (user.last_sign_in_at ? 'Active' : 'Pending'),
          role: 'Client',
          lastLogin: user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'Never',
          verified: user.email_confirmed_at !== null,
          firstName: profile?.first_name || '',
          lastName: profile?.last_name || '',
        };
      }).filter(Boolean) as UserAccount[];
      
      setUsers(mappedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch user accounts.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle user account activation/deactivation
  const handleUserStatusChange = async (user: UserAccount, action: 'activate' | 'deactivate') => {
    setSelectedUser(user);
    setActionType(action);
    setIsConfirmDialogOpen(true);
  };

  // Confirm and execute status change
  const confirmStatusChange = async () => {
    if (!selectedUser) return;
    
    try {
      // Update user status in Supabase Auth
      const { error } = await supabase.auth.admin.updateUserById(
        selectedUser.id,
        { banned: actionType === 'deactivate' }
      );
      
      if (error) throw error;
      
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
      
      // Close dialog
      setIsConfirmDialogOpen(false);
      
    } catch (error: any) {
      console.error(`Error ${actionType}ing user:`, error);
      toast({
        title: 'Error',
        description: `Failed to ${actionType} user account. ${error.message}`,
        variant: 'destructive',
      });
    }
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
          {/* Note: Add User functionality would go here if needed */}
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>User Accounts</CardTitle>
            <CardDescription>Manage client user accounts and their status</CardDescription>
            
            <div className="flex gap-2 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input 
                  type="text" 
                  placeholder="Search by name or email" 
                  className="pl-8" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" onClick={() => fetchUsers()}>
                Refresh
              </Button>
            </div>
          </CardHeader>
          
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-10">
                <AlertCircle className="mx-auto h-10 w-10 text-gray-400" />
                <p className="mt-2 text-gray-500">No user accounts found.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Verified</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map(user => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center mr-2">
                            <User size={16} />
                          </div>
                          {user.firstName && user.lastName 
                            ? `${user.firstName} ${user.lastName}` 
                            : 'Unnamed User'}
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === 'Advisor' ? 'default' : 'outline'}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={
                            user.status === 'Active' ? 'border-green-500 text-green-500' :
                            user.status === 'Inactive' ? 'border-gray-400 text-gray-400' :
                            'border-amber-500 text-amber-500'
                          }
                        >
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.verified ? 
                          <CheckCircle className="h-5 w-5 text-green-500" /> : 
                          <XCircle className="h-5 w-5 text-red-500" />
                        }
                      </TableCell>
                      <TableCell>{user.lastLogin}</TableCell>
                      <TableCell className="text-right">
                        {user.status === 'Active' ? (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleUserStatusChange(user, 'deactivate')}
                          >
                            Deactivate
                          </Button>
                        ) : (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleUserStatusChange(user, 'activate')}
                          >
                            Activate
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'activate' ? 'Activate Account' : 'Deactivate Account'}
            </DialogTitle>
            <DialogDescription>
              {actionType === 'activate' 
                ? 'This will allow the user to access the portal again.' 
                : 'This will prevent the user from accessing the portal.'}
            </DialogDescription>
          </DialogHeader>
          <p className="py-4">
            Are you sure you want to {actionType} the account for{' '}
            <span className="font-medium">{selectedUser?.email}</span>?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant={actionType === 'deactivate' ? 'destructive' : 'default'} 
              onClick={confirmStatusChange}
            >
              {actionType === 'activate' ? 'Activate Account' : 'Deactivate Account'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default UserAccountManagement;
