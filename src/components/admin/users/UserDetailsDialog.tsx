
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
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface UserDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserAccount | null;
  userDetails: any;
  isLoading: boolean;
}

export const UserDetailsDialog: React.FC<UserDetailsDialogProps> = ({
  isOpen,
  onClose,
  user,
  userDetails,
  isLoading,
}) => {
  const formatDate = (dateString: string | undefined) => {
    if (!dateString || dateString === 'N/A') return 'N/A';
    try {
      return format(new Date(dateString), 'MMM d, yyyy h:mm a');
    } catch (e) {
      return 'Invalid date';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>User Account Details</DialogTitle>
          <DialogDescription>
            Detailed information about this user account.
          </DialogDescription>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <>
            {user && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">User ID</p>
                    <p className="text-sm">{user.userNumber || `USR-${user.id.substring(0, 6)}`}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <Badge 
                      variant="outline" 
                      className={
                        user.status === 'Active' ? 'border-green-500 text-green-500' :
                        user.status === 'Inactive' ? 'border-gray-400 text-gray-400' :
                        'border-amber-500 text-amber-500'
                      }
                    >
                      {user.status}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">First Name</p>
                    <p className="text-sm">{user.firstName || 'Not provided'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Last Name</p>
                    <p className="text-sm">{user.lastName || 'Not provided'}</p>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-sm">{user.email}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Account Created</p>
                    <p className="text-sm">{formatDate(user.createdAt)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Last Login</p>
                    <p className="text-sm">{formatDate(user.lastLogin)}</p>
                  </div>
                </div>
                
                {userDetails && (
                  <div className="pt-2 border-t">
                    <h4 className="text-sm font-medium mb-2">Additional Information</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-500">Phone</p>
                        <p className="text-sm">{userDetails.phone || 'Not provided'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-500">Role</p>
                        <p className="text-sm">{userDetails.role || 'Client'}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
        
        <DialogFooter>
          <Button onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
