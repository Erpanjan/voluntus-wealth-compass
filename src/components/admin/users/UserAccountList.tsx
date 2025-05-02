
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserTable } from '@/components/admin/users/UserTable';
import { SearchBar } from '@/components/admin/users/SearchBar';
import { UserAccount } from '@/services/userService';

interface UserAccountListProps {
  users: UserAccount[];
  isLoading: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onRefresh: () => void;
  onActivate: (user: UserAccount) => void;
  onDeactivate: (user: UserAccount) => void;
  onDelete: (user: UserAccount) => void;
  onViewDetails: (user: UserAccount) => void;
}

export const UserAccountList: React.FC<UserAccountListProps> = ({
  users,
  isLoading,
  searchQuery,
  onSearchChange,
  onRefresh,
  onActivate,
  onDeactivate,
  onDelete,
  onViewDetails
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Accounts</CardTitle>
        <CardDescription>Manage client user accounts and their status</CardDescription>
        
        <div className="flex items-center justify-end mt-4">
          <SearchBar 
            searchQuery={searchQuery} 
            onSearchChange={onSearchChange} 
            onRefresh={onRefresh}
          />
        </div>
      </CardHeader>
      
      <CardContent>
        <UserTable 
          users={users}
          isLoading={isLoading}
          onActivate={onActivate}
          onDeactivate={onDeactivate}
          onDelete={onDelete}
          onViewDetails={onViewDetails}
        />
      </CardContent>
    </Card>
  );
};
