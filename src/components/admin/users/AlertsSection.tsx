
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Info } from 'lucide-react';

interface AlertsSectionProps {
  isLoading: boolean;
  noUsersFound: boolean;
}

export const AlertsSection: React.FC<AlertsSectionProps> = ({
  isLoading,
  noUsersFound
}) => {
  if (isLoading) return null;
  
  return (
    <div className="space-y-4 mb-4">
      {noUsersFound && (
        <Alert variant="warning" className="border-amber-300 bg-amber-50">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <AlertDescription className="text-amber-800">
            No user accounts found. This could be due to:
            <ul className="mt-2 list-disc pl-5">
              <li>No user accounts exist in the Supabase database</li>
              <li>Connection issues with the Supabase API</li>
              <li>Authentication issues - check if your session is valid</li>
            </ul>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
