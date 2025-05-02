
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
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return format(new Date(dateString), 'MMM d, yyyy h:mm a');
  };

  return (
    <>
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-medium">{`${inquiry.first_name} ${inquiry.last_name}`}</h3>
        <Badge className={`px-2 py-1 text-xs ${getStatusColor(inquiry.status)}`}>
          {inquiry.status}
        </Badge>
      </div>
      
      <div className="text-sm text-gray-500 flex flex-wrap items-center gap-1 mb-3">
        <span className="flex items-center">
          {getContactIcon(inquiry.contact_type)}
          {inquiry.contact_type}
        </span>
        <span className="mx-2">•</span>
        <span className="flex items-center font-medium">
          {inquiry.contact_info}
        </span>
        <span className="mx-2">•</span>
        <span>{formatDate(inquiry.created_at)}</span>
      </div>
      
      <div className="mb-4 text-gray-700 bg-gray-50 p-3 rounded-md">
        {inquiry.message}
      </div>
    </>
  );
};

export default ContactDetails;
