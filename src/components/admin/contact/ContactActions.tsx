
import React from 'react';
import { Button } from '@/components/ui/button';

interface ContactActionsProps {
  status: string;
  onReply: () => void;
  onStatusChange: (newStatus: string) => void;
}

const ContactActions: React.FC<ContactActionsProps> = ({ 
  status, 
  onReply, 
  onStatusChange 
}) => {
  return (
    <div className="flex flex-wrap gap-2 mb-3">
      {status === 'New' ? (
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => onStatusChange('Responded')}
        >
          Mark as Responded
        </Button>
      ) : status === 'Responded' ? (
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => onStatusChange('Closed')}
        >
          Mark as Closed
        </Button>
      ) : (
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => onStatusChange('New')}
        >
          Reopen
        </Button>
      )}
    </div>
  );
};

export default ContactActions;
