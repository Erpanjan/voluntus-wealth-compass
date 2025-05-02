
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface AlertsSectionProps {
  adminPermissionsLimited: boolean;
  noUsersFound: boolean;
  isLoading: boolean;
}

export const AlertsSection: React.FC<AlertsSectionProps> = ({
  adminPermissionsLimited,
  noUsersFound,
  isLoading
}) => {
  if (isLoading) return null;
  
  return (
    <div className="space-y-4 mb-4">
      {adminPermissionsLimited && (
        <Alert variant="warning" className="border-amber-300 bg-amber-50">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <AlertDescription className="text-amber-800">
            Limited admin permissions detected. Some operations (like user deletion at auth level) may not work. User profiles will still be manageable.
          </AlertDescription>
        </Alert>
      )}

      {noUsersFound && (
        <Alert variant="warning" className="border-amber-300 bg-amber-50">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <AlertDescription className="text-amber-800">
            No user accounts found. If you expected to see users, please check your Supabase configuration.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
