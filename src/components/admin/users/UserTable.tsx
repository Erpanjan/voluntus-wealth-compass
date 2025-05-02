
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UserCheck, UserMinus, UserX, User, AlertCircle, Eye } from 'lucide-react';
import { UserAccount } from '@/services/userService';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { format } from 'date-fns';

interface UserTableProps {
  users: UserAccount[];
  isLoading: boolean;
  onActivate: (user: UserAccount) => void;
  onDeactivate: (user: UserAccount) => void;
  onDelete: (user: UserAccount) => void;
  onViewDetails: (user: UserAccount) => void;
}

export const UserTable: React.FC<UserTableProps> = ({ 
  users, 
  isLoading, 
  onActivate, 
  onDeactivate,
  onDelete,
  onViewDetails
}) => {
  console.log('UserTable rendering with users:', users);
  
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

  const formatDate = (dateString: string | undefined) => {
    if (!dateString || dateString === 'N/A') return 'N/A';
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
          <TableHead>User #</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Joined</TableHead>
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
            <TableCell>{user.userNumber || `USR-${user.id.substring(0, 6).toUpperCase()}`}</TableCell>
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
            <TableCell>{formatDate(user.createdAt)}</TableCell>
            <TableCell className="text-right space-x-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-8 w-8 p-0"
                      onClick={() => onViewDetails(user)}
                    >
                      <Eye size={16} />
                      <span className="sr-only">View details</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>View user details</TooltipContent>
                </Tooltip>

                {user.status === 'Active' ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 w-8 p-0 text-amber-500"
                        onClick={() => onDeactivate(user)}
                      >
                        <UserMinus size={16} />
                        <span className="sr-only">Deactivate</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Deactivate account</TooltipContent>
                  </Tooltip>
                ) : (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        className="h-8 w-8 p-0 text-green-500"
                        onClick={() => onActivate(user)}
                      >
                        <UserCheck size={16} />
                        <span className="sr-only">Activate</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Activate account</TooltipContent>
                  </Tooltip>
                )}

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-8 w-8 p-0 text-red-500"
                      onClick={() => onDelete(user)}
                    >
                      <UserX size={16} />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Delete account</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
