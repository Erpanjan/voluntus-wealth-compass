
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

const WaitlistForm = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
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
    <div className="max-w-2xl mx-auto p-8 md:p-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-[#333333] font-poppins">
          {t('contact.title')}
        </h2>
        <p className="text-[#666666] text-lg font-poppins">
          {t('contact.subtitle')}
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Input
              name="firstName"
              type="text"
              required
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder={t('waitlist.firstName')}
              className="w-full bg-transparent border-0 border-b border-[#E5E5E5] rounded-none shadow-none text-[#333333] placeholder:text-[#999999] h-12 px-0 pb-3 pt-0 font-poppins focus-visible:ring-0 focus-visible:border-[#333333] transition-colors"
            />
          </div>
          <div>
            <Input
              name="lastName"
              type="text"
              required
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder={t('waitlist.lastName')}
              className="w-full bg-transparent border-0 border-b border-[#E5E5E5] rounded-none shadow-none text-[#333333] placeholder:text-[#999999] h-12 px-0 pb-3 pt-0 font-poppins focus-visible:ring-0 focus-visible:border-[#333333] transition-colors"
            />
          </div>
        </div>

        <div>
          <Input
            name="preferredContact"
            type="text"
            required
            value={formData.preferredContact}
            onChange={handleInputChange}
            placeholder={t('waitlist.preferredContact')}
            className="w-full bg-transparent border-0 border-b border-[#E5E5E5] rounded-none shadow-none text-[#333333] placeholder:text-[#999999] h-12 px-0 pb-3 pt-0 font-poppins focus-visible:ring-0 focus-visible:border-[#333333] transition-colors"
          />
        </div>

        <div>
          <Input
            name="contactInfo"
            type="text"
            required
            value={formData.contactInfo}
            onChange={handleInputChange}
            placeholder={t('waitlist.contactInfo')}
            className="w-full bg-transparent border-0 border-b border-[#E5E5E5] rounded-none shadow-none text-[#333333] placeholder:text-[#999999] h-12 px-0 pb-3 pt-0 font-poppins focus-visible:ring-0 focus-visible:border-[#333333] transition-colors"
          />
        </div>

        <div>
          <Textarea
            name="interests"
            value={formData.interests}
            onChange={handleInputChange}
            placeholder={t('waitlist.interests')}
            className="w-full bg-transparent border-0 border-b border-[#E5E5E5] rounded-none shadow-none text-[#333333] placeholder:text-[#999999] min-h-[80px] px-0 pb-3 pt-0 font-poppins resize-none focus-visible:ring-0 focus-visible:border-[#333333] transition-colors"
          />
        </div>

        <div className="pt-4">
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-[#333333] hover:bg-[#555555] text-white py-4 h-auto text-base font-medium rounded-none font-poppins"
          >
            {isSubmitting ? t('waitlist.submitting') : t('waitlist.submit')}
          </Button>
        </div>

        <p className="text-xs text-[#999999] text-center mt-8 leading-relaxed font-poppins">
          By clicking 'Submit', I authorize Voluntus Long-term Capital to reach out to me about their service, exclusive events, service updates, and company news.
        </p>
      </form>
    </div>
  );
};

export default WaitlistForm;
