
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { UserProfile } from '@/services/userService';

interface UserTableProps {
  users: UserProfile[];
  isLoading: boolean;
}

export const UserTable: React.FC<UserTableProps> = ({ 
  users, 
  isLoading
}) => {
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

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Joined</TableHead>
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
            <TableCell>{user.phone || 'N/A'}</TableCell>
            <TableCell>{formatDate(user.created_at)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
