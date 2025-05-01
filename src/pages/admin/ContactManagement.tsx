
import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, Mail, AtSign, User, MapPin } from 'lucide-react';

const ContactManagement = () => {
  // Mock contact inquiries
  const contactInquiries = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      message: 'I would like to learn more about your financial planning services.',
      date: '2025-04-28',
      status: 'New'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+1 (555) 987-6543',
      message: 'Please contact me regarding retirement planning options.',
      date: '2025-04-26',
      status: 'Responded'
    },
    {
      id: '3',
      name: 'Robert Johnson',
      email: 'robert.j@example.com',
      phone: '+1 (555) 246-8101',
      message: 'I need assistance with portfolio diversification strategies.',
      date: '2025-04-25',
      status: 'Closed'
    }
  ];
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Contact Inquiries</h1>
          <Button variant="outline">Export Data</Button>
        </div>
        
        <div className="grid gap-4">
          {contactInquiries.map((inquiry) => (
            <Card key={inquiry.id} className={`${inquiry.status === 'New' ? 'border-l-4 border-l-blue-500' : ''}`}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">{inquiry.name}</CardTitle>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    inquiry.status === 'New' ? 'bg-blue-100 text-blue-800' : 
                    inquiry.status === 'Responded' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-green-100 text-green-800'
                  }`}>
                    {inquiry.status}
                  </span>
                </div>
                <CardDescription className="flex items-center gap-1">
                  <AtSign size={14} />
                  {inquiry.email}
                  <span className="mx-2">•</span>
                  <Phone size={14} />
                  {inquiry.phone}
                  <span className="mx-2">•</span>
                  {inquiry.date}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <p className="text-gray-700">{inquiry.message}</p>
                <div className="mt-4 flex gap-2">
                  <Button size="sm" variant="default">Reply</Button>
                  <Button size="sm" variant="outline">Mark as {inquiry.status === 'New' ? 'Responded' : 'Closed'}</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ContactManagement;
