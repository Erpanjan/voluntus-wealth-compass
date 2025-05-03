
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { ApplicationData } from '@/services/applicationService';

interface ApplicationActionsProps {
  application: ApplicationData;
  openConfirmDialog: (app: ApplicationData, action: 'approve' | 'pending' | 'delete') => void;
}

const ApplicationActions: React.FC<ApplicationActionsProps> = ({ 
  application, 
  openConfirmDialog 
}) => {
  return (
    <div className="flex space-x-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            Actions <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => openConfirmDialog(application, 'approve')}>
            Approve
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => openConfirmDialog(application, 'pending')}>
            Mark as Pending
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => openConfirmDialog(application, 'delete')}
            className="text-red-500 hover:text-red-700"
          >
            Delete Application
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ApplicationActions;
