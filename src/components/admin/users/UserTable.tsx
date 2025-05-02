
import React from 'react';
import { UserAccount } from '@/services/userService';

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

  return (
    <div className="text-center py-10">
      <p className="mt-2 text-gray-500">User account functionality has been temporarily disabled.</p>
      <p className="text-sm text-gray-400">We're working on implementing a new version.</p>
    </div>
  );
};
