
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
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Shield } from 'lucide-react';

interface UserDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
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
  const formatDate = (dateString: string | undefined | null) => {
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
                    <p className="text-sm">{user.id ? user.id.substring(0, 8) : 'N/A'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <Badge 
                      variant="outline" 
                      className={
                        user.is_active === true ? 'border-green-500 text-green-500' :
                        'border-gray-400 text-gray-400'
                      }
                    >
                      {user.is_active === true ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">First Name</p>
                    <p className="text-sm">{user.first_name || 'Not provided'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Last Name</p>
                    <p className="text-sm">{user.last_name || 'Not provided'}</p>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-sm">{user.email || 'Not provided'}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Account Created</p>
                    <p className="text-sm">{formatDate(user.created_at)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Last Updated</p>
                    <p className="text-sm">{formatDate(user.updated_at)}</p>
                  </div>
                </div>
                
                <div className="pt-2 border-t">
                  <h4 className="text-sm font-medium mb-2">Additional Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500">Phone</p>
                      <p className="text-sm">{user.phone || 'Not provided'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500">Role</p>
                      {user.is_admin ? (
                        <div className="flex items-center gap-1">
                          <Shield className="h-3 w-3 text-blue-500" />
                          <span className="text-sm text-blue-500 font-medium">Admin</span>
                        </div>
                      ) : (
                        <span className="text-sm">User</span>
                      )}
                    </div>
                  </div>
                </div>
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
