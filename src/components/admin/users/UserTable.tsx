
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, User, AlertCircle } from 'lucide-react';
import { UserAccount } from '@/services/userService';

interface UserTableProps {
  users: UserAccount[];
  isLoading: boolean;
  onActivate: (user: UserAccount) => void;
  onDeactivate: (user: UserAccount) => void;
}

export const UserTable: React.FC<UserTableProps> = ({ 
  users, 
  isLoading, 
  onActivate, 
  onDeactivate 
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
        <AlertCircle className="mx-auto h-10 w-10 text-gray-400" />
        <p className="mt-2 text-gray-500">No user accounts found.</p>
      </div>
    );
  }

  return (
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
        {users.map(user => (
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
                  onClick={() => onDeactivate(user)}
                >
                  Deactivate
                </Button>
              ) : (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onActivate(user)}
                >
                  Activate
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
