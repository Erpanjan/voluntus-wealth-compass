
import React from 'react';
import { UserAccount } from '@/services/userService';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { User } from 'lucide-react';

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
            <TableHead>Registration Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Name</TableHead>
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
              <TableCell>{user.createdAt || 'Unknown'}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {user.status}
                </span>
              </TableCell>
              <TableCell>{user.firstName} {user.lastName}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
