
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ApplicationData } from '@/hooks/admin/useClientApplications';
import { supabase } from '@/integrations/supabase/client';
import { Check, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

interface QuestionnaireResponse {
  id: string;
  user_id: string;
  investment_goals: string | null;
  risk_tolerance: string | null;
  time_horizon: string | null;
  additional_info: string | null;
  age_group: string | null;
  income_level: string | null;
  net_worth: string | null;
  investment_knowledge: string | null;
  investment_experience: string | null;
  complex_products: number | null;
  investment_composition: string | null;
  behavioral_biases: string | null;
}

interface ApplicationDetailsProps {
  application: ApplicationData;
  onClose: () => void;
  onUpdateStatus: (applicationId: string, status: 'approved' | 'rejected') => Promise<boolean>;
}

const ApplicationDetails: React.FC<ApplicationDetailsProps> = ({ 
  application, 
  onClose,
  onUpdateStatus
}) => {
  const [questionnaireData, setQuestionnaireData] = useState<QuestionnaireResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [processingAction, setProcessingAction] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchQuestionnaireData = async () => {
      if (!application.id) return;
      
      try {
        setLoading(true);
        
        // Query for questionnaire data associated with this user
        const { data, error } = await supabase
          .from('questionnaire_responses')
          .select('*')
          .eq('user_id', application.id)
          .maybeSingle();
        
        if (error) {
          console.error('Error fetching questionnaire data:', error);
          return;
        }
        
        setQuestionnaireData(data);
      } catch (error) {
        console.error('Error in questionnaire fetch:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchQuestionnaireData();
  }, [application.id]);
  
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const formatTime = (timeString: string) => {
    if (!timeString) return 'N/A';
    
    // Handle "09:00" format
    if (timeString.includes(':')) {
      const [hours, minutes] = timeString.split(':').map(Number);
      const period = hours >= 12 ? 'PM' : 'AM';
      const adjustedHours = hours % 12 || 12;
      return `${adjustedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
    }
    
    return timeString;
  };
  
  const handleUpdateStatus = async (status: 'approved' | 'rejected') => {
    setProcessingAction(true);
    try {
      const success = await onUpdateStatus(application.id, status);
      if (success) {
        toast({
          title: 'Status Updated',
          description: `Application ${status === 'approved' ? 'approved' : 'rejected'} successfully`,
        });
      }
    } finally {
      setProcessingAction(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold">
            Client Application Details
          </h2>
          <p className="text-gray-500">
            Submitted on {formatDate(application.created_at)}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {application.status === 'submitted' && (
            <>
              <Button 
                variant="outline" 
                className="flex items-center gap-2 text-red-500 border-red-200 hover:bg-red-50"
                onClick={() => handleUpdateStatus('rejected')}
                disabled={processingAction}
              >
                <X size={16} />
                Decline
              </Button>
              
              <Button 
                className="flex items-center gap-2"
                onClick={() => handleUpdateStatus('approved')}
                disabled={processingAction}
              >
                <Check size={16} />
                Approve
              </Button>
            </>
          )}
          
          {application.status !== 'submitted' && (
            <Badge className={`
              ${application.status === 'approved' ? 'bg-green-100 text-green-800' : ''}  
              ${application.status === 'rejected' ? 'bg-red-100 text-red-800' : ''}
              ${application.status === 'draft' ? 'bg-gray-100 text-gray-800' : ''}
            `}>
              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
            </Badge>
          )}
          
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm font-medium text-gray-500">Name</div>
              <div>{application.first_name} {application.last_name}</div>
            </div>
            
            <div>
              <div className="text-sm font-medium text-gray-500">Email</div>
              <div>{application.email || 'N/A'}</div>
            </div>
            
            <div>
              <div className="text-sm font-medium text-gray-500">Phone</div>
              <div>{application.phone || 'N/A'}</div>
            </div>
            
            <div>
              <div className="text-sm font-medium text-gray-500">Address</div>
              <div>{application.address || 'N/A'}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Consultation Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm font-medium text-gray-500">Consultation Type</div>
              <div>{application.consultation_type || 'Not scheduled'}</div>
            </div>
            
            <div>
              <div className="text-sm font-medium text-gray-500">Date</div>
              <div>{application.consultation_date ? formatDate(application.consultation_date) : 'Not scheduled'}</div>
            </div>
            
            <div>
              <div className="text-sm font-medium text-gray-500">Time</div>
              <div>{application.consultation_time ? formatTime(application.consultation_time) : 'Not scheduled'}</div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Financial Questionnaire</CardTitle>
          <CardDescription>
            {questionnaireData ? 'Client responses to financial assessment questions.' : 'No questionnaire data available.'}
          </CardDescription>
        </CardHeader>
        
        {loading && (
          <CardContent>
            <p className="text-gray-500 italic">Loading questionnaire data...</p>
          </CardContent>
        )}
        
        {!loading && questionnaireData && (
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {questionnaireData.investment_goals && (
                  <div>
                    <div className="text-sm font-medium text-gray-500">Investment Goals</div>
                    <div>{questionnaireData.investment_goals}</div>
                  </div>
                )}
                
                {questionnaireData.risk_tolerance && (
                  <div>
                    <div className="text-sm font-medium text-gray-500">Risk Tolerance</div>
                    <div>{questionnaireData.risk_tolerance}</div>
                  </div>
                )}
                
                {questionnaireData.time_horizon && (
                  <div>
                    <div className="text-sm font-medium text-gray-500">Time Horizon</div>
                    <div>{questionnaireData.time_horizon}</div>
                  </div>
                )}
                
                {questionnaireData.age_group && (
                  <div>
                    <div className="text-sm font-medium text-gray-500">Age Group</div>
                    <div>{questionnaireData.age_group}</div>
                  </div>
                )}
                
                {questionnaireData.income_level && (
                  <div>
                    <div className="text-sm font-medium text-gray-500">Income Level</div>
                    <div>{questionnaireData.income_level}</div>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">  
                {questionnaireData.net_worth && (
                  <div>
                    <div className="text-sm font-medium text-gray-500">Net Worth</div>
                    <div>{questionnaireData.net_worth}</div>
                  </div>
                )}
                
                {questionnaireData.investment_knowledge && (
                  <div>
                    <div className="text-sm font-medium text-gray-500">Investment Knowledge</div>
                    <div>{questionnaireData.investment_knowledge}</div>
                  </div>
                )}
                
                {questionnaireData.investment_experience && (
                  <div>
                    <div className="text-sm font-medium text-gray-500">Investment Experience</div>
                    <div>{questionnaireData.investment_experience}</div>
                  </div>
                )}
                
                {questionnaireData.investment_composition && (
                  <div>
                    <div className="text-sm font-medium text-gray-500">Investment Composition</div>
                    <div>{questionnaireData.investment_composition}</div>
                  </div>
                )}
                
                {questionnaireData.behavioral_biases && (
                  <div>
                    <div className="text-sm font-medium text-gray-500">Behavioral Biases</div>
                    <div>{questionnaireData.behavioral_biases}</div>
                  </div>
                )}
              </div>
            </div>
            
            {questionnaireData.additional_info && (
              <>
                <Separator className="my-4" />
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-2">Additional Information</div>
                  <div className="whitespace-pre-wrap">{questionnaireData.additional_info}</div>
                </div>
              </>
            )}
          </CardContent>
        )}
        
        {!loading && !questionnaireData && (
          <CardContent>
            <p className="text-gray-500 italic">The client has not completed the financial questionnaire.</p>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default ApplicationDetails;
