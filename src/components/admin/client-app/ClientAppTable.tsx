
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead,
  TableHeader,
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ApplicationData } from '@/services/applicationService';
import StatusDropdown from './StatusDropdown';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface ClientAppTableProps {
  applications: ApplicationData[];
  isLoading: boolean;
  onStatusChange: (applicationId: string, newStatus: string) => Promise<void>;
}

const ClientAppTable: React.FC<ClientAppTableProps> = ({ applications, isLoading, onStatusChange }) => {
  const getStatusBadge = (status: string) => {
    switch(status.toLowerCase()) {
      case 'approved':
        return <Badge className="bg-green-500">Approved</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">Rejected</Badge>;
      case 'draft':
        return <Badge className="bg-gray-500">Draft</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Questionnaire</TableHead>
          <TableHead>Application Date</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-10">
              <div className="flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-2"></div>
                <span>Loading applications...</span>
              </div>
            </TableCell>
          </TableRow>
        ) : applications.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-10">
              <div className="flex flex-col items-center justify-center">
                <AlertCircle className="h-8 w-8 text-gray-400 mb-2" />
                <span>No applications found. Try refreshing or check your database.</span>
              </div>
            </TableCell>
          </TableRow>
        ) : (
          applications.map((app) => (
            <TableRow key={app.id}>
              <TableCell>
                {app.first_name} {app.last_name}
              </TableCell>
              <TableCell>{app.email}</TableCell>
              <TableCell>{app.phone}</TableCell>
              <TableCell>
                {getStatusBadge(app.status)}
              </TableCell>
              <TableCell>
                {app.has_questionnaire ? (
                  app.questionnaire_completed ? (
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                      <span>Completed</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <XCircle className="h-4 w-4 text-amber-500 mr-1" />
                      <span>Incomplete</span>
                    </div>
                  )
                ) : (
                  <div className="flex items-center">
                    <XCircle className="h-4 w-4 text-gray-400 mr-1" />
                    <span>None</span>
                  </div>
                )}
              </TableCell>
              <TableCell>
                {new Date(app.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <StatusDropdown 
                  applicationId={app.id} 
                  onStatusChange={onStatusChange} 
                />
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default ClientAppTable;
