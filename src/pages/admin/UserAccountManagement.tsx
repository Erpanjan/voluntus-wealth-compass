
import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const UserAccountManagement = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">User Account Management</h1>
        </div>
        
        <Alert variant="warning" className="border-amber-300 bg-amber-50">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <AlertDescription className="text-amber-800">
            The user account management functionality is currently being updated. Please check back later.
          </AlertDescription>
        </Alert>
        
        <Card>
          <CardHeader>
            <CardTitle>User Accounts</CardTitle>
            <CardDescription>Manage client user accounts and their status</CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="text-center py-10">
              <p className="text-gray-500">User account management is currently unavailable.</p>
              <p className="text-sm text-gray-400 mt-2">We're working on improving this feature for better performance.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default UserAccountManagement;
