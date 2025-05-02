
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { AlertCircle, ThumbsUp, AlertTriangle } from 'lucide-react';
import { ApplicationDetail } from '@/services/applicationService';
import ApplicationStatusBadge from './ApplicationStatusBadge';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ApplicationDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  application: ApplicationDetail | null;
  isLoading: boolean;
  onApprove: (id: string) => Promise<boolean>;
  onReject?: (id: string) => Promise<boolean>;
  onRefresh: () => void;
}

const ApplicationDetailsDialog: React.FC<ApplicationDetailsDialogProps> = ({
  isOpen,
  onClose,
  application,
  isLoading,
  onApprove,
  onReject,
  onRefresh,
}) => {
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const { toast } = useToast();

  // Format date with fallback
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not specified';
    try {
      return format(new Date(dateString), 'MMMM d, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };

  // Handle application approval
  const handleApprove = async () => {
    if (!application) return;
    try {
      setIsApproving(true);
      const success = await onApprove(application.id);
      if (success) {
        onRefresh();
        setShowApprovalDialog(false);
      }
    } catch (error) {
      console.error('Error approving application:', error);
      toast({
        title: 'Error',
        description: 'Failed to approve application. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsApproving(false);
    }
  };

  // Handle application rejection
  const handleReject = async () => {
    if (!application || !onReject) return;
    try {
      setIsRejecting(true);
      const success = await onReject(application.id);
      if (success) {
        onRefresh();
        setShowRejectDialog(false);
      }
    } catch (error) {
      console.error('Error rejecting application:', error);
      toast({
        title: 'Error',
        description: 'Failed to reject application. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsRejecting(false);
    }
  };

  if (isLoading || !application) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center justify-between">
              <span>Application Details</span>
              <ApplicationStatusBadge status={application.status} />
            </DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="profile" className="mt-2">
            <TabsList className="mb-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="consultation">Consultation</TabsTrigger>
              {application.questionnaire && (
                <TabsTrigger value="questionnaire">Questionnaire</TabsTrigger>
              )}
            </TabsList>
            
            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">First Name</p>
                  <p>{application.first_name || 'Not provided'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Last Name</p>
                  <p>{application.last_name || 'Not provided'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p>{application.email || 'Not provided'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <p>{application.phone || 'Not provided'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Address</p>
                  <p>{application.address || 'Not provided'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Preferred Communication</p>
                  <p>{application.preferred_communication || 'Not specified'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Media Account Number</p>
                  <p>{application.media_account_number || 'Not provided'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Application Date</p>
                  <p>{formatDate(application.created_at)}</p>
                </div>
              </div>
            </TabsContent>
            
            {/* Consultation Tab */}
            <TabsContent value="consultation" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Consultation Type</p>
                  <p>{application.consultation_type || 'Not specified'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Consultation Date</p>
                  <p>{application.consultation_date ? formatDate(application.consultation_date) : 'Not scheduled'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Consultation Time</p>
                  <p>{application.consultation_time || 'Not specified'}</p>
                </div>
              </div>
            </TabsContent>
            
            {/* Questionnaire Tab */}
            {application.questionnaire && (
              <TabsContent value="questionnaire" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Age Group</p>
                    <p>{application.questionnaire.age_group || 'Not provided'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Income Level</p>
                    <p>{application.questionnaire.income_level || 'Not provided'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Net Worth</p>
                    <p>{application.questionnaire.net_worth || 'Not provided'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Investment Knowledge</p>
                    <p>{application.questionnaire.investment_knowledge || 'Not provided'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Investment Experience</p>
                    <p>{application.questionnaire.investment_experience || 'Not provided'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Investment Composition</p>
                    <p>{application.questionnaire.investment_composition || 'Not provided'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Complex Products Interest</p>
                    <p>{application.questionnaire.complex_products !== null ? 
                      `${application.questionnaire.complex_products}/10` : 'Not provided'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Behavioral Biases</p>
                    <p>{application.questionnaire.behavioral_biases || 'Not provided'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Investment Goals</p>
                    <p>{application.questionnaire.investment_goals || 'Not provided'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Risk Tolerance</p>
                    <p>{application.questionnaire.risk_tolerance || 'Not provided'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Time Horizon</p>
                    <p>{application.questionnaire.time_horizon || 'Not provided'}</p>
                  </div>
                </div>
                
                {application.questionnaire.additional_info && (
                  <div className="space-y-1 col-span-2 mt-4">
                    <p className="text-sm font-medium text-gray-500">Additional Information</p>
                    <p className="whitespace-pre-wrap">{application.questionnaire.additional_info}</p>
                  </div>
                )}
              </TabsContent>
            )}
          </Tabs>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 justify-end mt-6">
            {application.status === 'submitted' && (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => setShowRejectDialog(true)}
                  className="sm:order-1"
                  disabled={isApproving}
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button 
                  onClick={() => setShowApprovalDialog(true)}
                  className="bg-green-600 hover:bg-green-700 sm:order-2"
                  disabled={isApproving}
                >
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  Approve Application
                </Button>
              </>
            )}
            {application.status === 'approved' && (
              <div className="text-green-600 flex items-center">
                <ThumbsUp className="h-4 w-4 mr-2" />
                This application has been approved
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Approval Confirmation Dialog */}
      <AlertDialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve Application</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve this application? The user will gain access to the client dashboard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isApproving}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                handleApprove();
              }} 
              disabled={isApproving}
              className="bg-green-600 hover:bg-green-700"
            >
              {isApproving ? 'Approving...' : 'Approve'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Reject Confirmation Dialog */}
      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Application</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reject this application? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRejecting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                handleReject();
              }} 
              disabled={isRejecting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isRejecting ? 'Rejecting...' : 'Reject'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ApplicationDetailsDialog;
