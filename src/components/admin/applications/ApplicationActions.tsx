
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { Check, ChevronDown, X, Trash } from 'lucide-react';
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 px-3 py-0 text-gray-700 border-gray-300 hover:bg-gray-50">
          Actions <ChevronDown className="ml-1 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 p-1">
        <DropdownMenuItem 
          onClick={() => openConfirmDialog(application, 'approve')}
          className="cursor-pointer rounded-md hover:bg-green-50"
          disabled={application.status === 'approved'}
        >
          <Check className="mr-2 h-4 w-4 text-green-500" />
          <span>Approve</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => openConfirmDialog(application, 'pending')}
          className="cursor-pointer rounded-md hover:bg-yellow-50"
          disabled={application.status === 'pending'}
        >
          <X className="mr-2 h-4 w-4 text-amber-500" />
          <span>Mark as Pending</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => openConfirmDialog(application, 'delete')}
          className="text-red-600 cursor-pointer rounded-md hover:bg-red-50"
        >
          <Trash className="mr-2 h-4 w-4" />
          <span>Delete Application</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ApplicationActions;
