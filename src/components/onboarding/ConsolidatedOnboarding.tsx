
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { OnboardingFormData } from '@/hooks/use-onboarding-form';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import ProfileFormSection from './sections/consolidated/ProfileFormSection';
import ConsultationFormSection from './sections/consolidated/ConsultationFormSection';
import OnboardingReview from './sections/consolidated/OnboardingReview';

interface ConsolidatedOnboardingProps {
  formData: OnboardingFormData;
  updateProfileData: (data: Partial<OnboardingFormData['profile']>) => void;
  updateConsultationData: (data: Partial<OnboardingFormData['consultation']>) => void;
  handleSubmit: () => void;
  handleSaveDraft: () => void;
  saving?: boolean;
}

const ConsolidatedOnboarding: React.FC<ConsolidatedOnboardingProps> = ({
  formData,
  updateProfileData,
  updateConsultationData,
  handleSubmit,
  handleSaveDraft,
  saving = false
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  const handlePreview = () => {
    // Check if required fields are filled
    if (!formData.profile.firstName || !formData.profile.lastName || !formData.profile.email || !formData.profile.phone) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in all required fields before previewing.",
        variant: "destructive"
      });
      return;
    }
    
    setIsPreviewOpen(true);
  };
  
  const handleSubmitForm = () => {
    if (!formData.consultation.completed) {
      toast({
        title: "Consultation Required",
        description: "Please schedule a consultation to complete your application.",
        variant: "destructive"
      });
      return;
    }
    
    handleSubmit();
  };
  
  return (
    <div className="w-full max-w-3xl mx-auto pb-24">
      {/* Profile Section */}
      <div className="mb-16">
        <ProfileFormSection 
          profileData={formData.profile}
          updateProfileData={updateProfileData}
        />
      </div>
      
      {/* Divider */}
      <div className="w-full h-px bg-gray-200 my-10"></div>
      
      {/* Consultation Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">Schedule a Consultation</h2>
        <p className="text-gray-600 mb-8">
          Meet with one of our advisors for an in-depth discussion of your financial situation. We'll also use this session to verify key details and better understand your needs.
        </p>
        
        <ConsultationFormSection
          consultationData={formData.consultation}
          updateConsultationData={updateConsultationData}
        />
      </div>
      
      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-4 px-6 z-10">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <Button 
            variant="outline" 
            onClick={handleSaveDraft}
            disabled={saving}
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : "Save Draft"}
          </Button>
          
          <div className="flex gap-3">
            <Button 
              variant="secondary" 
              onClick={handlePreview}
              disabled={saving}
            >
              Preview
            </Button>
            <Button 
              onClick={handleSubmitForm}
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : "Submit Application"}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Review Your Application</DialogTitle>
          </DialogHeader>
          
          <OnboardingReview formData={formData} />
          
          <DialogFooter className="pt-6">
            <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
              Close
            </Button>
            <Button 
              onClick={handleSubmitForm}
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : "Submit Application"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ConsolidatedOnboarding;
