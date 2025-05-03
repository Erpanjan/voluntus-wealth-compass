
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from 'lucide-react';

interface StatusDropdownProps {
  applicationId: string;
  onStatusChange: (applicationId: string, newStatus: string) => Promise<void>;
}

const StatusDropdown: React.FC<StatusDropdownProps> = ({ applicationId, onStatusChange }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          Change Status <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => onStatusChange(applicationId, 'draft')}>
          Draft
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onStatusChange(applicationId, 'pending')}>
          Pending
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onStatusChange(applicationId, 'approved')}>
          Approved
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onStatusChange(applicationId, 'rejected')}>
          Rejected
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default StatusDropdown;
