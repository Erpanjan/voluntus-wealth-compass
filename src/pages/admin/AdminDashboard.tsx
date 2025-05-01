
import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Users, Eye, FileUp } from 'lucide-react';

const AdminDashboard = () => {
  // Sample data - in a real app, this would come from the database
  const stats = [
    { title: 'Total Articles', value: '24', icon: FileText, change: '+4 this month' },
    { title: 'Total Authors', value: '8', icon: Users, change: '+1 this month' },
    { title: 'Article Views', value: '1.2k', icon: Eye, change: '+12% from last month' },
    { title: 'Reports Uploaded', value: '32', icon: FileUp, change: '+3 this week' },
  ];

  return (
    <AdminLayout>
      <h1 className="text-2xl font-semibold mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Articles</CardTitle>
            <CardDescription>Latest articles published on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="border-b pb-2">
                <div className="font-medium">The Future of Financial Planning</div>
                <div className="text-sm text-gray-500">Published 2 days ago</div>
              </li>
              <li className="border-b pb-2">
                <div className="font-medium">Investment Strategies for 2025</div>
                <div className="text-sm text-gray-500">Published 5 days ago</div>
              </li>
              <li>
                <div className="font-medium">Understanding Market Volatility</div>
                <div className="text-sm text-gray-500">Published 1 week ago</div>
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Authors</CardTitle>
            <CardDescription>Authors recently added to the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 border-b pb-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div>
                  <div className="font-medium">Sarah Johnson</div>
                  <div className="text-sm text-gray-500">Financial Advisor</div>
                </div>
              </li>
              <li className="flex items-center gap-3 border-b pb-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div>
                  <div className="font-medium">Michael Chen</div>
                  <div className="text-sm text-gray-500">Market Analyst</div>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div>
                  <div className="font-medium">Emma Williams</div>
                  <div className="text-sm text-gray-500">Investment Specialist</div>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
