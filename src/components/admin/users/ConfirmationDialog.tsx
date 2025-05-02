
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { UserProfile } from '@/services/userService';
import { AlertTriangle } from 'lucide-react';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  user: UserProfile | null;
  actionType: 'activate' | 'deactivate' | 'delete';
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  user,
  actionType,
}) => {
  const getTitle = () => {
    switch (actionType) {
      case 'activate': return 'Activate Account';
      case 'deactivate': return 'Deactivate Account';
      case 'delete': return 'Delete Account';
    }
  };

  const getDescription = () => {
    switch (actionType) {
      case 'activate': return 'This will allow the user to access the portal again.';
      case 'deactivate': return 'This will prevent the user from accessing the portal.';
      case 'delete': return 'This will permanently remove the user account. This action cannot be undone.';
    }
  };

  const getButtonText = () => {
    switch (actionType) {
      case 'activate': return 'Activate Account';
      case 'deactivate': return 'Deactivate Account';
      case 'delete': return 'Delete Account';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {getTitle()}
          </DialogTitle>
          <DialogDescription>
            {getDescription()}
          </DialogDescription>
        </DialogHeader>
        
        {actionType === 'delete' && (
          <div className="flex items-center gap-2 p-3 bg-red-50 text-red-800 rounded-md">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <p className="text-sm font-medium">
              Warning: This action cannot be undone. All user data will be permanently removed.
            </p>
          </div>
        )}
        
        <p className="py-4">
          Are you sure you want to {actionType} the account for{' '}
          <span className="font-medium">{user?.email}</span>?
        </p>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            variant={actionType === 'delete' ? 'destructive' : actionType === 'deactivate' ? 'secondary' : 'default'} 
            onClick={onConfirm}
          >
            {getButtonText()}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
