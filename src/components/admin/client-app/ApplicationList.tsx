
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Check, X, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ApplicationData } from '@/hooks/admin/useClientApplications';

interface ApplicationListProps {
  applications: ApplicationData[];
  loading: boolean;
  onViewDetails: (application: ApplicationData) => void;
  onUpdateStatus: (applicationId: string, status: 'approved' | 'rejected') => Promise<boolean>;
}

const ApplicationList: React.FC<ApplicationListProps> = ({ 
  applications, 
  loading, 
  onViewDetails,
  onUpdateStatus
}) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      case 'submitted':
        return <Badge className="bg-blue-100 text-blue-800">Pending Review</Badge>;
      case 'draft':
        return <Badge className="bg-gray-100 text-gray-800">Draft</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="w-full">
      <Table>
        <TableCaption>
          {loading
            ? 'Loading client applications...'
            : applications.length === 0
            ? 'No client applications found.'
            : 'List of client applications.'}
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Full Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Submitted On</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                Loading client applications...
              </TableCell>
            </TableRow>
          ) : applications.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                No client applications found.
              </TableCell>
            </TableRow>
          ) : (
            applications.map((application) => (
              <TableRow key={application.id}>
                <TableCell className="font-medium">
                  {application.first_name} {application.last_name}
                </TableCell>
                <TableCell>{application.email || '-'}</TableCell>
                <TableCell>{application.phone || '-'}</TableCell>
                <TableCell>{formatDate(application.created_at)}</TableCell>
                <TableCell>{getStatusBadge(application.status)}</TableCell>
                <TableCell className="text-right flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => onViewDetails(application)}
                    title="View Details"
                  >
                    <Eye size={16} />
                  </Button>
                  
                  {application.status === 'submitted' && (
                    <>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="text-red-500 border-red-200 hover:bg-red-50"
                        onClick={() => onUpdateStatus(application.id, 'rejected')}
                        title="Decline Application"
                      >
                        <X size={16} />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="text-green-500 border-green-200 hover:bg-green-50"
                        onClick={() => onUpdateStatus(application.id, 'approved')}
                        title="Approve Application"
                      >
                        <Check size={16} />
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ApplicationList;
