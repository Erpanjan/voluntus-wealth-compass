
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { GlassEffect, GlassButton, GlassFilter } from '@/components/ui/glass-effect';

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
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 relative">
      <GlassFilter />
      
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-[#333333] font-poppins leading-tight">
          {t('contact.title')}
        </h2>
        <p className="text-[#666666] text-lg font-poppins leading-relaxed max-w-xl mx-auto">
          {t('contact.subtitle')}
        </p>
      </div>
      
      <GlassEffect className="rounded-3xl p-8 sm:p-10 w-full flex-col">
        <form onSubmit={handleSubmit} className="space-y-6 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="w-full">
              <Input
                name="firstName"
                type="text"
                required
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder={t('waitlist.firstName')}
                className="w-full bg-white/20 border-0 border-b border-white/30 rounded-none shadow-none text-white placeholder:text-white/70 h-12 px-0 pb-3 pt-0 font-poppins focus-visible:ring-0 focus-visible:border-white transition-colors min-w-0 backdrop-blur-sm"
              />
            </div>
            <div className="w-full">
              <Input
                name="lastName"
                type="text"
                required
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder={t('waitlist.lastName')}
                className="w-full bg-white/20 border-0 border-b border-white/30 rounded-none shadow-none text-white placeholder:text-white/70 h-12 px-0 pb-3 pt-0 font-poppins focus-visible:ring-0 focus-visible:border-white transition-colors min-w-0 backdrop-blur-sm"
              />
            </div>
          </div>

          <div className="w-full">
            <Input
              name="preferredContact"
              type="text"
              required
              value={formData.preferredContact}
              onChange={handleInputChange}
              placeholder={t('waitlist.preferredContact')}
              className="w-full bg-white/20 border-0 border-b border-white/30 rounded-none shadow-none text-white placeholder:text-white/70 h-12 px-0 pb-3 pt-0 font-poppins focus-visible:ring-0 focus-visible:border-white transition-colors min-w-0 backdrop-blur-sm"
            />
          </div>

          <div className="w-full">
            <Input
              name="contactInfo"
              type="text"
              required
              value={formData.contactInfo}
              onChange={handleInputChange}
              placeholder={t('waitlist.contactInfo')}
              className="w-full bg-white/20 border-0 border-b border-white/30 rounded-none shadow-none text-white placeholder:text-white/70 h-12 px-0 pb-3 pt-0 font-poppins focus-visible:ring-0 focus-visible:border-white transition-colors min-w-0 backdrop-blur-sm"
            />
          </div>

          <div className="w-full">
            <Textarea
              name="interests"
              value={formData.interests}
              onChange={handleInputChange}
              placeholder={t('waitlist.interests')}
              className="w-full bg-white/20 border-0 border-b border-white/30 rounded-none shadow-none text-white placeholder:text-white/70 min-h-[80px] px-0 pb-3 pt-0 font-poppins resize-none focus-visible:ring-0 focus-visible:border-white transition-colors min-w-0 backdrop-blur-sm"
            />
          </div>

          <div className="pt-4 w-full flex justify-center">
            <GlassButton
              type="submit"
              onClick={(e) => {
                if (!isSubmitting) {
                  handleSubmit(e as any);
                }
              }}
            >
              <div className="text-white py-2 px-4 text-base font-medium font-poppins">
                {isSubmitting ? t('waitlist.submitting') : t('waitlist.submit')}
              </div>
            </GlassButton>
          </div>

          <p className="text-xs text-white/70 text-center mt-8 leading-relaxed font-poppins max-w-lg mx-auto">
            {t('waitlist.consent')}
          </p>
        </form>
      </GlassEffect>
    </div>
  );
};

export default WaitlistForm;
