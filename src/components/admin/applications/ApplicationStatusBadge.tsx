
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Check, Clock, AlertTriangle } from 'lucide-react';

interface ApplicationStatusBadgeProps {
  status: string;
  className?: string;
}

const ApplicationStatusBadge: React.FC<ApplicationStatusBadgeProps> = ({ status, className = '' }) => {
  if (status === 'approved') {
    return (
      <Badge 
        variant="outline" 
        className={`bg-green-50 text-green-600 border-green-200 flex items-center gap-1 ${className}`}
      >
        <Check className="h-3 w-3" />
        Approved
      </Badge>
    );
  } else if (status === 'submitted') {
    return (
      <Badge 
        variant="outline" 
        className={`bg-amber-50 text-amber-600 border-amber-200 flex items-center gap-1 ${className}`}
      >
        <Clock className="h-3 w-3" />
        Pending
      </Badge>
    );
  } else if (status === 'rejected') {
    return (
      <Badge 
        variant="outline" 
        className={`bg-red-50 text-red-600 border-red-200 flex items-center gap-1 ${className}`}
      >
        <AlertTriangle className="h-3 w-3" />
        Rejected
      </Badge>
    );
  } else {
    return (
      <Badge 
        variant="outline" 
        className={`bg-gray-100 text-gray-500 border-gray-200 ${className}`}
      >
        {status || 'Unknown'}
      </Badge>
    );
  }
};

export default ApplicationStatusBadge;
