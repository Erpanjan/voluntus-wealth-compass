
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusBadge = (status: string) => {
    switch(status.toLowerCase()) {
      case 'approved':
        return <Badge className="bg-green-500 hover:bg-green-600 py-1 text-xs font-medium">Approved</Badge>;
      case 'pending':
      case 'submitted':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600 py-1 text-xs font-medium">Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500 hover:bg-red-600 py-1 text-xs font-medium">Rejected</Badge>;
      case 'draft':
        return <Badge className="bg-gray-400 hover:bg-gray-500 py-1 text-xs font-medium">Draft</Badge>;
      default:
        return <Badge className="py-1 text-xs font-medium">{status}</Badge>;
    }
  };

  return getStatusBadge(status);
};

export default StatusBadge;
