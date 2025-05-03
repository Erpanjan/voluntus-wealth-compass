
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

interface ApplicationTableProps {
  applications: ApplicationData[];
  isLoading: boolean;
  openConfirmDialog: (app: ApplicationData, action: 'approve' | 'pending' | 'delete') => void;
}

const ApplicationTable: React.FC<ApplicationTableProps> = ({ 
  applications, 
  isLoading, 
  openConfirmDialog 
}) => {
  return (
    <div className="rounded-md border">
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
                Loading applications...
              </TableCell>
            </TableRow>
          ) : applications.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-10">
                No applications found. Try refreshing or check your database connection.
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
                  <StatusBadge status={app.status} />
                </TableCell>
                <TableCell>
                  <QuestionnaireStatus 
                    hasQuestionnaire={app.has_questionnaire} 
                    isCompleted={app.questionnaire_completed} 
                  />
                </TableCell>
                <TableCell>
                  {new Date(app.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <ApplicationActions 
                    application={app}
                    openConfirmDialog={openConfirmDialog}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ApplicationTable;
