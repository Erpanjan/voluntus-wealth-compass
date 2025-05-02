
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { UserProfile } from '@/services/userService';
import { Button } from '@/components/ui/button';
import { Eye, UserCheck, UserX, MoreHorizontal, Shield } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { UserDetailsDialog } from './UserDetailsDialog';
import { ConfirmationDialog } from './ConfirmationDialog';

interface UserTableProps {
  users: UserProfile[];
  isLoading: boolean;
  onUpdateUserStatus?: (userId: string, isActive: boolean) => Promise<void>;
}

export const UserTable: React.FC<UserTableProps> = ({ 
  users, 
  isLoading,
  onUpdateUserStatus
}) => {
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState<'activate' | 'deactivate' | 'delete'>('activate');
  const [userDetailsLoading, setUserDetailsLoading] = useState(false);
  const [userDetails, setUserDetails] = useState<any>(null);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="mt-2 text-gray-500">No user accounts found.</p>
      </div>
    );
  }

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };

  const handleViewDetails = (user: UserProfile) => {
    setSelectedUser(user);
    setUserDetailsLoading(true);
    // In a real implementation, you might fetch additional user details here
    setUserDetails(user);
    setUserDetailsLoading(false);
    setIsDetailsOpen(true);
  };

  const handleStatusAction = (user: UserProfile, action: 'activate' | 'deactivate' | 'delete') => {
    setSelectedUser(user);
    setConfirmationAction(action);
    setIsConfirmationOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedUser || !onUpdateUserStatus) return;
    
    try {
      const newStatus = confirmationAction === 'activate';
      await onUpdateUserStatus(selectedUser.id, newStatus);
    } catch (error) {
      console.error('Error updating user status:', error);
    } finally {
      setIsConfirmationOpen(false);
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map(user => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">
                {user.first_name || user.last_name ? 
                  `${user.first_name || ''} ${user.last_name || ''}`.trim() : 
                  'Not provided'}
              </TableCell>
              <TableCell>{user.email || 'N/A'}</TableCell>
              <TableCell>
                <Badge 
                  variant="outline" 
                  className={
                    user.is_active === true ? 'border-green-500 text-green-500' : 
                    'border-gray-400 text-gray-400'
                  }
                >
                  {user.is_active === true ? 'Active' : 'Inactive'}
                </Badge>
              </TableCell>
              <TableCell>
                {user.is_admin === true ? (
                  <Badge variant="outline" className="border-blue-500 text-blue-500 flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    Admin
                  </Badge>
                ) : (
                  <Badge variant="outline" className="border-gray-400 text-gray-400">
                    User
                  </Badge>
                )}
              </TableCell>
              <TableCell>{user.phone || 'N/A'}</TableCell>
              <TableCell>{formatDate(user.created_at)}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleViewDetails(user)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    {user.is_active ? (
                      <DropdownMenuItem onClick={() => handleStatusAction(user, 'deactivate')}>
                        <UserX className="mr-2 h-4 w-4" />
                        Deactivate
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem onClick={() => handleStatusAction(user, 'activate')}>
                        <UserCheck className="mr-2 h-4 w-4" />
                        Activate
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <UserDetailsDialog 
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        user={selectedUser}
        userDetails={userDetails}
        isLoading={userDetailsLoading}
      />

      <ConfirmationDialog
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        onConfirm={handleConfirmAction}
        user={selectedUser}
        actionType={confirmationAction}
      />
    </>
  );
};
