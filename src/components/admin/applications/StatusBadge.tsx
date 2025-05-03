
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusBadge = (status: string) => {
    switch(status.toLowerCase()) {
      case 'approved':
        return <Badge className="bg-green-500">Approved</Badge>;
      case 'pending':
      case 'submitted':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">Rejected</Badge>;
      case 'draft':
        return <Badge className="bg-gray-500">Draft</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return getStatusBadge(status);
};

export default StatusBadge;
