
import React from 'react';
import { UserAccount } from '@/services/userService';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { User, Phone, Eye, Shield, Ban, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

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
        <User className="h-10 w-10 text-gray-400 mx-auto mb-3" />
        <p className="mt-2 text-gray-500">No user accounts found.</p>
        <p className="text-sm text-gray-400">User accounts will appear here once created.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead>User ID</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Registration Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="w-[150px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex justify-center">
                  <User className="h-5 w-5 text-gray-500" />
                </div>
              </TableCell>
              <TableCell className="font-medium">{user.userNumber}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.phone || "—"}</TableCell>
              <TableCell>{user.createdAt || 'Unknown'}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {user.status}
                </span>
              </TableCell>
              <TableCell>{user.firstName} {user.lastName}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={() => onViewDetails(user)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>View details</TooltipContent>
                  </Tooltip>
                  
                  {user.status === 'Active' ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => onDeactivate(user)}>
                          <Ban className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Deactivate user</TooltipContent>
                    </Tooltip>
                  ) : (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => onActivate(user)}>
                          <Shield className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Activate user</TooltipContent>
                    </Tooltip>
                  )}
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={() => onDelete(user)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Delete user</TooltipContent>
                  </Tooltip>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
