
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { useIsMobile } from '@/hooks/use-mobile';

const WaitlistForm = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    preferredContact: '',
    contactInfo: '',
    interests: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert([
          {
            first_name: formData.firstName,
            last_name: formData.lastName,
            contact_type: formData.preferredContact,
            contact_info: formData.contactInfo,
            message: formData.interests || 'Waitlist signup'
          }
        ]);

      if (error) throw error;

      toast({
        title: t('toast.waitlistAdded'),
        description: t('toast.waitlistMessage'),
      });

      setFormData({
        firstName: '',
        lastName: '',
        preferredContact: '',
        contactInfo: '',
        interests: ''
      });
    } catch (error) {
      console.error('Error submitting waitlist form:', error);
      toast({
        title: t('common.error'),
        description: 'Failed to join waitlist. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-3 sm:px-6 md:px-8 lg:px-12">
      <div className="text-center mb-6 sm:mb-8 md:mb-12">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold mb-3 sm:mb-4 md:mb-6 text-[#333333] font-poppins leading-tight">
          {t('contact.title')}
        </h2>
        <p className="text-[#666666] text-sm sm:text-base md:text-lg font-poppins leading-relaxed max-w-xl mx-auto">
          {t('contact.subtitle')}
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 md:space-y-6 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
          <div className="w-full">
            <Label htmlFor="firstName" className="text-xs sm:text-sm text-[#666666] font-poppins mb-1 block">
              {t('waitlist.firstName')}
            </Label>
            <Input
              id="firstName"
              name="firstName"
              type="text"
              required
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder={isMobile ? "First name" : t('waitlist.firstName')}
              className="w-full !bg-transparent focus:!bg-transparent active:!bg-transparent border-0 border-b border-[#E5E5E5] rounded-none shadow-none text-[#666666] placeholder:text-[#999999] h-10 sm:h-11 md:h-12 px-0 pb-2 sm:pb-3 pt-0 font-poppins focus-visible:ring-0 focus-visible:border-[#333333] transition-colors min-w-0 [-webkit-autofill]:!bg-transparent text-sm sm:text-base"
              style={{
                WebkitBoxShadow: '0 0 0 1000px transparent inset',
                WebkitTextFillColor: '#666666'
              }}
            />
          </div>
          <div className="w-full">
            <Label htmlFor="lastName" className="text-xs sm:text-sm text-[#666666] font-poppins mb-1 block">
              {t('waitlist.lastName')}
            </Label>
            <Input
              id="lastName"
              name="lastName"
              type="text"
              required
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder={isMobile ? "Last name" : t('waitlist.lastName')}
              className="w-full !bg-transparent focus:!bg-transparent active:!bg-transparent border-0 border-b border-[#E5E5E5] rounded-none shadow-none text-[#666666] placeholder:text-[#999999] h-10 sm:h-11 md:h-12 px-0 pb-2 sm:pb-3 pt-0 font-poppins focus-visible:ring-0 focus-visible:border-[#333333] transition-colors min-w-0 [-webkit-autofill]:!bg-transparent text-sm sm:text-base"
              style={{
                WebkitBoxShadow: '0 0 0 1000px transparent inset',
                WebkitTextFillColor: '#666666'
              }}
            />
          </div>
        </div>

        <div className="w-full">
          <Label htmlFor="preferredContact" className="text-xs sm:text-sm text-[#666666] font-poppins mb-1 block">
            {t('waitlist.preferredContact')}
          </Label>
          <Input
            id="preferredContact"
            name="preferredContact"
            type="text"
            required
            value={formData.preferredContact}
            onChange={handleInputChange}
            placeholder={isMobile ? "Contact method" : "e.g., Email, Phone, WeChat"}
            className="w-full !bg-transparent focus:!bg-transparent active:!bg-transparent border-0 border-b border-[#E5E5E5] rounded-none shadow-none text-[#666666] placeholder:text-[#999999] h-10 sm:h-11 md:h-12 px-0 pb-2 sm:pb-3 pt-0 font-poppins focus-visible:ring-0 focus-visible:border-[#333333] transition-colors min-w-0 [-webkit-autofill]:!bg-transparent text-sm sm:text-base"
            style={{
              WebkitBoxShadow: '0 0 0 1000px transparent inset',
              WebkitTextFillColor: '#666666'
            }}
          />
        </div>

        <div className="w-full">
          <Label htmlFor="contactInfo" className="text-xs sm:text-sm text-[#666666] font-poppins mb-1 block">
            {t('waitlist.contactInfo')}
          </Label>
          <Input
            id="contactInfo"
            name="contactInfo"
            type="text"
            required
            value={formData.contactInfo}
            onChange={handleInputChange}
            placeholder={isMobile ? "Contact details" : t('waitlist.contactInfo')}
            className="w-full !bg-transparent focus:!bg-transparent active:!bg-transparent border-0 border-b border-[#E5E5E5] rounded-none shadow-none text-[#666666] placeholder:text-[#999999] h-10 sm:h-11 md:h-12 px-0 pb-2 sm:pb-3 pt-0 font-poppins focus-visible:ring-0 focus-visible:border-[#333333] transition-colors min-w-0 [-webkit-autofill]:!bg-transparent text-sm sm:text-base"
            style={{
              WebkitBoxShadow: '0 0 0 1000px transparent inset',
              WebkitTextFillColor: '#666666'
            }}
          />
        </div>

        <div className="w-full">
          <Label htmlFor="interests" className="text-xs sm:text-sm text-[#666666] font-poppins mb-1 block">
            {t('waitlist.interests')} <span className="text-[#999999] text-xs">(Optional)</span>
          </Label>
          <Textarea
            id="interests"
            name="interests"
            value={formData.interests}
            onChange={handleInputChange}
            placeholder={isMobile ? "Tell us about your interests..." : t('waitlist.interests')}
            className="w-full !bg-transparent focus:!bg-transparent active:!bg-transparent border-0 border-b border-[#E5E5E5] rounded-none shadow-none text-[#666666] placeholder:text-[#999999] min-h-[60px] sm:min-h-[80px] px-0 pb-2 sm:pb-3 pt-0 font-poppins resize-none focus-visible:ring-0 focus-visible:border-[#333333] transition-colors min-w-0 [-webkit-autofill]:!bg-transparent text-sm sm:text-base"
            style={{
              WebkitBoxShadow: '0 0 0 1000px transparent inset',
              WebkitTextFillColor: '#666666'
            }}
          />
        </div>

        <div className="pt-2 sm:pt-3 md:pt-4 w-full">
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-[#333333] hover:bg-[#555555] text-white py-3 sm:py-4 h-auto text-sm sm:text-base font-medium rounded-none font-poppins transition-colors duration-200"
          >
            {isSubmitting ? t('waitlist.submitting') : t('waitlist.submit')}
          </Button>
        </div>

        <p className="text-xs sm:text-sm text-[#999999] text-center mt-4 sm:mt-6 md:mt-8 leading-relaxed font-poppins max-w-lg mx-auto">
          {t('waitlist.consent')}
        </p>
      </form>
    </div>
  );
};

export default WaitlistForm;
