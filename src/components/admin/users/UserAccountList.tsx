
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserTable } from '@/components/admin/users/UserTable';
import { UserProfile } from '@/services/userService';

interface UserAccountListProps {
  users: UserProfile[];
  isLoading: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onRefresh: () => void;
}

export const UserAccountList: React.FC<UserAccountListProps> = ({
  users,
  isLoading,
  searchQuery,
  onSearchChange,
  onRefresh
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Profiles</CardTitle>
        <CardDescription>View all registered user profiles from the Supabase database</CardDescription>
      </CardHeader>
      
      <CardContent>
        <UserTable 
          users={users}
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  );
};
