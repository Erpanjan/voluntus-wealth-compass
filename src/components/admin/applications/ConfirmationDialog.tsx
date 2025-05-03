
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
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  application,
  actionType,
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
        return 'This will permanently delete the application and all associated data. This action cannot be undone.';
    }
  };

  const getButtonText = () => {
    switch (actionType) {
      case 'approve': return 'Approve';
      case 'pending': return 'Mark as Pending';
      case 'delete': return 'Delete Application';
    }
  };

  const getName = () => {
    if (!application) return '';
    return application.first_name && application.last_name 
      ? `${application.first_name} ${application.last_name}`
      : application.email || 'Unknown User';
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {getTitle()}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {getDescription()}
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        {actionType === 'delete' && (
          <div className="flex items-center gap-2 p-3 bg-red-50 text-red-800 rounded-md mb-4">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <p className="text-sm font-medium">
              Warning: This action cannot be undone. The application will be permanently deleted.
            </p>
          </div>
        )}
        
        <p className="py-2">
          Are you sure you want to {actionType === 'delete' ? 'delete' : actionType} the application for{' '}
          <span className="font-medium">{getName()}</span>?
        </p>
        
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className={actionType === 'delete' ? 'bg-red-500 hover:bg-red-600' : ''}
          >
            {getButtonText()}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmationDialog;
