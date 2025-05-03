
import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead,
  TableHeader,
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, ChevronDown, CheckCircle, XCircle, RefreshCw, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ApplicationData, useApplicationService } from '@/services/applicationService';
import { useToast } from '@/hooks/use-toast';
import ConfirmationDialog from '@/components/admin/applications/ConfirmationDialog';

const ClientAppManagement: React.FC = () => {
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<ApplicationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<ApplicationData | null>(null);
  const [confirmAction, setConfirmAction] = useState<'approve' | 'pending' | 'delete'>('approve');
  
  const { fetchApplications, updateApplicationStatus, deleteApplication } = useApplicationService();
  const { toast } = useToast();

  const loadApplications = async () => {
    try {
      setIsLoading(true);
      console.log("Starting to load applications...");
      const data = await fetchApplications();
      console.log("Applications loaded:", data);
      setApplications(data);
      setFilteredApplications(data);
    } catch (error) {
      console.error('Failed to load applications', error);
      toast({
        title: 'Error',
        description: 'Failed to load application data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  useEffect(() => {
    const filtered = applications.filter(app => 
      (app.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      app.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.status.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredApplications(filtered);
  }, [searchTerm, applications]);

  const openConfirmDialog = (app: ApplicationData, action: 'approve' | 'pending' | 'delete') => {
    setSelectedApplication(app);
    setConfirmAction(action);
    setConfirmDialogOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedApplication) return;
    
    try {
      if (confirmAction === 'delete') {
        await deleteApplication(selectedApplication.id);
        // Remove the application from the local state
        setApplications(prev => prev.filter(app => app.id !== selectedApplication.id));
      } else {
        const newStatus = confirmAction === 'approve' ? 'approved' : 'pending';
        await updateApplicationStatus(selectedApplication.id, newStatus);
        // Update the application status in local state
        setApplications(prev => prev.map(app => 
          app.id === selectedApplication.id ? {...app, status: newStatus} : app
        ));
      }
    } catch (error) {
      console.error('Failed to process action', error);
    } finally {
      setConfirmDialogOpen(false);
      setSelectedApplication(null);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadApplications();
  };

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
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight mb-2">Client Applications</h2>
          <p className="text-muted-foreground">
            Manage and review client onboarding applications.
          </p>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search applications..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        
        <Card>
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
                ) : filteredApplications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10">
                      No applications found. Try refreshing or check your database connection.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredApplications.map((app) => (
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
                        <div className="flex space-x-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm">
                                Change Status <ChevronDown className="ml-2 h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem onClick={() => openConfirmDialog(app, 'approve')}>
                                Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openConfirmDialog(app, 'pending')}>
                                Mark as Pending
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-red-500 hover:text-red-700 border-red-200 hover:border-red-300"
                            onClick={() => openConfirmDialog(app, 'delete')}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
      
      <ConfirmationDialog
        isOpen={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        onConfirm={handleConfirmAction}
        application={selectedApplication}
        actionType={confirmAction}
      />
    </AdminLayout>
  );
};

export default ClientAppManagement;
