
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle, XCircle, User, Search, Filter } from 'lucide-react';

const UserAccountManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock user data
  const users = [
    {
      id: '1',
      name: 'Alice Johnson',
      email: 'alice.johnson@example.com',
      status: 'Active',
      role: 'Client',
      lastLogin: '2025-05-01',
      verified: true
    },
    {
      id: '2',
      name: 'Michael Brown',
      email: 'michael.brown@example.com',
      status: 'Active',
      role: 'Client',
      lastLogin: '2025-04-29',
      verified: true
    },
    {
      id: '3',
      name: 'Sarah Davis',
      email: 'sarah.davis@example.com',
      status: 'Inactive',
      role: 'Client',
      lastLogin: '2025-04-15',
      verified: false
    },
    {
      id: '4',
      name: 'David Wilson',
      email: 'david.wilson@example.com',
      status: 'Pending',
      role: 'Client',
      lastLogin: 'Never',
      verified: false
    },
    {
      id: '5',
      name: 'Emily Garcia',
      email: 'emily.garcia@example.com',
      status: 'Active',
      role: 'Advisor',
      lastLogin: '2025-05-01',
      verified: true
    }
  ];
  
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">User Account Management</h1>
          <Button>Add New User</Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>User Accounts</CardTitle>
            <CardDescription>Manage user accounts and their permissions</CardDescription>
            
            <div className="flex gap-2 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input 
                  type="text" 
                  placeholder="Search by name or email" 
                  className="pl-8" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </CardHeader>
          
          <CardContent>
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
                {filteredUsers.map(user => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center mr-2">
                          <User size={16} />
                        </div>
                        {user.name}
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
                      <Button size="sm" variant="ghost">Edit</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default UserAccountManagement;
