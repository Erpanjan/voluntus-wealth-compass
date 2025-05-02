
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { UserTable } from '@/components/admin/users/UserTable';
import { UserProfile } from '@/services/userService';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

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
      <CardContent className="pt-6">
        {users.length === 0 && !isLoading && (
          <Alert className="mb-4 bg-amber-50 border-amber-300">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <AlertTitle>No Users Found</AlertTitle>
            <AlertDescription>
              This could be due to:
              <ul className="mt-2 list-disc pl-5">
                <li>No user accounts exist in the database</li>
                <li>RLS policy restrictions (check your admin access)</li>
                <li>Connection issues with the Supabase API</li>
              </ul>
            </AlertDescription>
          </Alert>
        )}
        
        <UserTable 
          users={users}
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  );
};
