
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { format } from 'date-fns';
import ApplicationStatusBadge from './ApplicationStatusBadge';
import { ApplicationData } from '@/services/applicationService';

interface ClientApplicationTableProps {
  applications: ApplicationData[];
  isLoading: boolean;
  onViewDetails: (id: string) => void;
}

const ClientApplicationTable: React.FC<ClientApplicationTableProps> = ({ 
  applications, 
  isLoading, 
  onViewDetails 
}) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No applications found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead>Questionnaire</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((app) => (
            <TableRow key={app.id}>
              <TableCell className="font-medium">
                {app.first_name} {app.last_name || ''}
              </TableCell>
              <TableCell>{app.email || 'N/A'}</TableCell>
              <TableCell>{app.phone || 'N/A'}</TableCell>
              <TableCell>
                <ApplicationStatusBadge status={app.status} />
              </TableCell>
              <TableCell>{formatDate(app.updated_at)}</TableCell>
              <TableCell>
                {app.has_questionnaire ? (
                  <span className="text-green-600 text-sm">Completed</span>
                ) : (
                  <span className="text-gray-400 text-sm">Not submitted</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onViewDetails(app.id)}
                  className="hover:bg-gray-100"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ClientApplicationTable;
