
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead,
  TableHeader,
  TableRow 
} from '@/components/ui/table';
import { ApplicationData } from '@/services/applicationService';
import StatusBadge from './StatusBadge';
import QuestionnaireStatus from './QuestionnaireStatus';
import ApplicationActions from './ApplicationActions';
import ApplicationTableSkeleton from './ApplicationTableSkeleton';

interface ApplicationTableProps {
  applications: ApplicationData[];
  isLoading: boolean;
  openConfirmDialog: (app: ApplicationData, action: 'approve' | 'pending' | 'delete') => void;
  page: number;
  pageSize: number;
}

const ApplicationTable: React.FC<ApplicationTableProps> = ({ 
  applications, 
  isLoading, 
  openConfirmDialog,
  page,
  pageSize
}) => {
  // Calculate the visible applications for the current page
  const paginatedApplications = applications.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-medium text-gray-700">Name</TableHead>
            <TableHead className="font-medium text-gray-700">Email</TableHead>
            <TableHead className="font-medium text-gray-700">Phone</TableHead>
            <TableHead className="font-medium text-gray-700">Status</TableHead>
            <TableHead className="font-medium text-gray-700">Questionnaire</TableHead>
            <TableHead className="font-medium text-gray-700">Application Date</TableHead>
            <TableHead className="font-medium text-gray-700 text-right pr-4">Actions</TableHead>
          </TableRow>
        </TableHeader>
        
        {isLoading ? (
          <ApplicationTableSkeleton />
        ) : paginatedApplications.length === 0 ? (
          <TableBody>
            <TableRow>
              <TableCell colSpan={7} className="text-center py-10">
                {applications.length === 0 ? (
                  <div className="py-8">
                    <p className="text-gray-500 mb-2">No applications found</p>
                    <p className="text-sm text-gray-400">Try refreshing or adjusting your search criteria</p>
                  </div>
                ) : (
                  <div className="py-8">
                    <p className="text-gray-500">No matching applications for your search</p>
                  </div>
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        ) : (
          <TableBody>
            {paginatedApplications.map((app) => (
              <TableRow key={app.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">
                  {app.first_name} {app.last_name || ''}
                </TableCell>
                <TableCell>{app.email}</TableCell>
                <TableCell>{app.phone}</TableCell>
                <TableCell>
                  <StatusBadge status={app.status} />
                </TableCell>
                <TableCell>
                  <QuestionnaireStatus 
                    hasQuestionnaire={app.has_questionnaire} 
                    isCompleted={app.questionnaire_completed} 
                  />
                </TableCell>
                <TableCell className="text-gray-600 text-sm">
                  {new Date(app.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <ApplicationActions 
                    application={app}
                    openConfirmDialog={openConfirmDialog}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>
    </div>
  );
};

export default ApplicationTable;
