
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AlertTriangle } from 'lucide-react';
import { ApplicationData } from '@/services/applicationService';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  application: ApplicationData | null;
  actionType: 'approve' | 'pending' | 'delete';
  isProcessing?: boolean;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  application,
  actionType,
  isProcessing = false,
}) => {
  const getTitle = () => {
    switch (actionType) {
      case 'approve': return 'Approve Application';
      case 'pending': return 'Mark as Pending';
      case 'delete': return 'Delete Application';
    }
  };

  const getDescription = () => {
    switch (actionType) {
      case 'approve': 
        return 'This will approve the application and grant the user access to the client dashboard.';
      case 'pending': 
        return 'This will mark the application as pending, and the user will see the pending approval screen.';
      case 'delete': 
        return 'This will permanently delete the application, user account, and all associated data. This action cannot be undone.';
    }
  };

  const getButtonText = () => {
    if (isProcessing) return 'Processing...';
    
    switch (actionType) {
      case 'approve': return 'Approve';
      case 'pending': return 'Mark as Pending';
      case 'delete': return 'Delete';
    }
  };

  const getName = () => {
    if (!application) return '';
    return application.first_name && application.last_name 
      ? `${application.first_name} ${application.last_name}`
      : application.email || 'Unknown User';
  };

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader className="space-y-3">
          <AlertDialogTitle className="text-xl font-semibold">
            {getTitle()}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base text-gray-600">
            {getDescription()}
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        {actionType === 'delete' && (
          <div className="flex items-center gap-2 p-3 bg-red-50 text-red-800 rounded-md my-2">
            <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0" />
            <p className="text-sm font-medium">
              Warning: This action cannot be undone. The application and user account will be permanently deleted.
            </p>
          </div>
        )}
        
        <p className="py-2 text-gray-700">
          {actionType === 'delete' ? 'Delete' : actionType === 'approve' ? 'Approve' : 'Update'} application for{' '}
          <span className="font-medium">{getName()}</span>?
        </p>
        
        <AlertDialogFooter className="gap-2 mt-4">
          <AlertDialogCancel 
            onClick={onClose}
            className="font-normal border-gray-300"
            disabled={isProcessing}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className={`${isProcessing ? 'opacity-75 cursor-not-allowed' : ''} ${
              actionType === 'delete' 
                ? 'bg-red-600 hover:bg-red-700' 
                : actionType === 'approve'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-amber-600 hover:bg-amber-700'
            }`}
            disabled={isProcessing}
          >
            {getButtonText()}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmationDialog;
