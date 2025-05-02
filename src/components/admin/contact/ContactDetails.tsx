import React from 'react';
import { format } from 'date-fns';
import { Phone, Mail, MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ContactDetailsProps {
  inquiry: {
    first_name: string;
    last_name: string;
    contact_type: string;
    contact_info: string;
    message: string;
    created_at: string;
    status: string;
  };
}

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'New': return 'bg-blue-100 text-blue-800';
    case 'Responded': return 'bg-yellow-100 text-yellow-800';
    case 'Closed': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const getContactIcon = (contactType: string) => {
  const type = contactType.toLowerCase();
  if (type.includes('email')) return <Mail size={14} className="mr-1" />;
  if (type.includes('phone') || type.includes('call')) return <Phone size={14} className="mr-1" />;
  return <MessageSquare size={14} className="mr-1" />;
};

const ContactDetails: React.FC<ContactDetailsProps> = ({ inquiry }) => {
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy h:mm a');
  };

  return (
    <div className="flex-1">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium">{`${inquiry.first_name} ${inquiry.last_name}`}</h3>
        <Badge className={`px-2 py-1 text-xs ${getStatusColor(inquiry.status)}`}>
          {inquiry.status}
        </Badge>
      </div>
      
      <div className="grid md:grid-cols-2 gap-2 mb-3">
        <div className="text-sm text-gray-700">
          <span className="text-gray-500">Contact via:</span> {inquiry.contact_type}
        </div>
        <div className="text-sm text-gray-700">
          <span className="text-gray-500">Contact info:</span>{' '}
          <span className="font-medium">{inquiry.contact_info}</span>
        </div>
        <div className="text-sm text-gray-700">
          <span className="text-gray-500">Date:</span> {formatDate(inquiry.created_at)}
        </div>
      </div>
      
      <div className="mb-4 text-gray-700 bg-gray-50 p-3 rounded-md text-sm">
        {inquiry.message}
      </div>
    </div>
  );
};

export default ContactDetails;
