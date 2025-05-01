
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
import { UserAccount } from '@/services/userService';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  user: UserAccount | null;
  actionType: 'activate' | 'deactivate';
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  user,
  actionType,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {actionType === 'activate' ? 'Activate Account' : 'Deactivate Account'}
          </DialogTitle>
          <DialogDescription>
            {actionType === 'activate' 
              ? 'This will allow the user to access the portal again.' 
              : 'This will prevent the user from accessing the portal.'}
          </DialogDescription>
        </DialogHeader>
        <p className="py-4">
          Are you sure you want to {actionType} the account for{' '}
          <span className="font-medium">{user?.email}</span>?
        </p>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            variant={actionType === 'deactivate' ? 'destructive' : 'default'} 
            onClick={onConfirm}
          >
            {actionType === 'activate' ? 'Activate Account' : 'Deactivate Account'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
