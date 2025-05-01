
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Smartphone, Upload, CheckCircle2, Settings, FileText, MessageSquare } from 'lucide-react';

const ClientAppManagement = () => {
  const [activeTab, setActiveTab] = useState('policies');
  
  const policyDocuments = [
    { id: '1', title: 'Investment Policy', uploadDate: '2025-04-15', status: 'Published' },
    { id: '2', title: 'Risk Assessment Framework', uploadDate: '2025-04-10', status: 'Published' },
    { id: '3', title: 'Financial Planning Guide', uploadDate: '2025-04-05', status: 'Draft' },
    { id: '4', title: 'Client Privacy Policy', uploadDate: '2025-03-28', status: 'Published' },
    { id: '5', title: 'Retirement Strategy', uploadDate: '2025-03-20', status: 'Draft' },
  ];
  
  const chatMessages = [
    {
      id: '1',
      client: 'Alice Johnson',
      message: 'How do I update my risk profile?',
      timestamp: '2025-05-01 10:30 AM',
      status: 'Answered',
    },
    {
      id: '2',
      client: 'Michael Brown',
      message: 'When is my next scheduled meeting?',
      timestamp: '2025-05-01 09:15 AM',
      status: 'Pending',
    },
    {
      id: '3',
      client: 'Sarah Davis',
      message: 'I need help understanding my portfolio performance',
      timestamp: '2025-04-30 04:45 PM',
      status: 'Answered',
    },
    {
      id: '4',
      client: 'David Wilson',
      message: 'How do I share my tax documents securely?',
      timestamp: '2025-04-30 02:20 PM',
      status: 'Pending',
    },
  ];
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Client Application</h1>
            <p className="text-gray-500">Manage client-facing application content</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
              <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
              App Online
            </Badge>
            <Button size="sm" variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              App Settings
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="policies" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 w-full max-w-md mb-4">
            <TabsTrigger value="policies">
              <FileText className="h-4 w-4 mr-2" />
              Policies
            </TabsTrigger>
            <TabsTrigger value="chat">
              <MessageSquare className="h-4 w-4 mr-2" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="interface">
              <Smartphone className="h-4 w-4 mr-2" />
              Interface
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="policies" className="space-y-4">
            <div className="flex justify-between">
              <h2 className="text-xl font-semibold">Policy Documents</h2>
              <Button>
                <Upload className="h-4 w-4 mr-2" />
                Upload New Policy
              </Button>
            </div>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Published and Draft Policies</CardTitle>
                <CardDescription>
                  Manage documents that appear in your client's policy tab
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="divide-y">
                  {policyDocuments.map(doc => (
                    <div key={doc.id} className="py-3 flex items-center justify-between">
                      <div>
                        <div className="font-medium">{doc.title}</div>
                        <div className="text-sm text-gray-500">Uploaded on {doc.uploadDate}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={doc.status === 'Published' ? 'default' : 'outline'}>
                          {doc.status}
                        </Badge>
                        <Button size="sm" variant="ghost">Edit</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="chat" className="space-y-4">
            <div className="flex justify-between">
              <h2 className="text-xl font-semibold">AI Chat Management</h2>
              <Button variant="outline">Configure AI</Button>
            </div>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Recent Client Inquiries</CardTitle>
                <CardDescription>
                  View and manage messages from client chat interface
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="divide-y">
                  {chatMessages.map(message => (
                    <div key={message.id} className="py-3">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium">{message.client}</span>
                        <Badge variant={message.status === 'Answered' ? 'outline' : 'default'} 
                          className={message.status === 'Answered' ? 'border-green-500 text-green-500' : ''}>
                          {message.status}
                        </Badge>
                      </div>
                      <p className="text-gray-700">{message.message}</p>
                      <div className="text-sm text-gray-500 mt-1">{message.timestamp}</div>
                      <Button size="sm" variant="ghost" className="mt-1">
                        View Conversation
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="interface" className="space-y-4">
            <div className="flex justify-between">
              <h2 className="text-xl font-semibold">Client Interface Settings</h2>
              <Button variant="outline">Preview App</Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>App Appearance</CardTitle>
                  <CardDescription>Configure how the client application looks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <label className="font-medium">Theme</label>
                    <div className="flex gap-2">
                      <Button className="flex-1" variant="outline">Light</Button>
                      <Button className="flex-1" variant="default">Auto</Button>
                      <Button className="flex-1" variant="outline">Dark</Button>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="font-medium">Navigation Style</label>
                    <div className="flex gap-2">
                      <Button className="flex-1" variant="default">Tabs</Button>
                      <Button className="flex-1" variant="outline">Sidebar</Button>
                    </div>
                  </div>
                  
                  <Button className="w-full">Save Appearance</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Features Toggle</CardTitle>
                  <CardDescription>Enable or disable client-facing features</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>AI Assistant</span>
                    <Button variant="outline" size="sm">Enabled</Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span>File Upload</span>
                    <Button variant="outline" size="sm">Enabled</Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span>Video Meetings</span>
                    <Button variant="outline" size="sm">Enabled</Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span>Notifications</span>
                    <Button variant="outline" size="sm">Disabled</Button>
                  </div>
                  
                  <Button className="w-full">Save Settings</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default ClientAppManagement;
