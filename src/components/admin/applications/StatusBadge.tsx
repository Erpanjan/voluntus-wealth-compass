
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusBadge = (status: string) => {
    switch(status.toLowerCase()) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-0 py-1 px-2 text-xs font-medium">Approved</Badge>;
      case 'pending':
      case 'submitted':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-0 py-1 px-2 text-xs font-medium">Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200 border-0 py-1 px-2 text-xs font-medium">Rejected</Badge>;
      case 'draft':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200 border-0 py-1 px-2 text-xs font-medium">Draft</Badge>;
      default:
        return <Badge className="py-1 px-2 text-xs font-medium">{status}</Badge>;
    }
  };

  return getStatusBadge(status);
};

export default StatusBadge;
