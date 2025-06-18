
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
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-heading font-semibold mb-6 text-brand-black-olive leading-tight">
          {t('contact.title')}
        </h2>
        <p className="text-brand-muted-gray text-lg font-body leading-relaxed max-w-xl mx-auto">
          {t('contact.subtitle')}
        </p>
      </div>
      
      <div className="bg-white rounded-comfortable shadow-peaceful p-8">
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
                className="w-full bg-brand-white-smoke border border-brand-light-gray rounded-gentle shadow-inner-peaceful text-brand-black-olive placeholder:text-brand-muted-gray h-12 px-4 py-3 font-body focus-visible:ring-1 focus-visible:ring-brand-black-olive focus-visible:border-brand-black-olive transition-all duration-200 min-w-0"
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
                className="w-full bg-brand-white-smoke border border-brand-light-gray rounded-gentle shadow-inner-peaceful text-brand-black-olive placeholder:text-brand-muted-gray h-12 px-4 py-3 font-body focus-visible:ring-1 focus-visible:ring-brand-black-olive focus-visible:border-brand-black-olive transition-all duration-200 min-w-0"
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
              className="w-full bg-brand-white-smoke border border-brand-light-gray rounded-gentle shadow-inner-peaceful text-brand-black-olive placeholder:text-brand-muted-gray h-12 px-4 py-3 font-body focus-visible:ring-1 focus-visible:ring-brand-black-olive focus-visible:border-brand-black-olive transition-all duration-200 min-w-0"
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
              className="w-full bg-brand-white-smoke border border-brand-light-gray rounded-gentle shadow-inner-peaceful text-brand-black-olive placeholder:text-brand-muted-gray h-12 px-4 py-3 font-body focus-visible:ring-1 focus-visible:ring-brand-black-olive focus-visible:border-brand-black-olive transition-all duration-200 min-w-0"
            />
          </div>

          <div className="w-full">
            <Textarea
              name="interests"
              value={formData.interests}
              onChange={handleInputChange}
              placeholder={t('waitlist.interests')}
              className="w-full bg-brand-white-smoke border border-brand-light-gray rounded-gentle shadow-inner-peaceful text-brand-black-olive placeholder:text-brand-muted-gray min-h-[80px] px-4 py-3 font-body resize-none focus-visible:ring-1 focus-visible:ring-brand-black-olive focus-visible:border-brand-black-olive transition-all duration-200 min-w-0"
            />
          </div>

          <div className="pt-4 w-full">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-brand-black-olive hover:bg-opacity-90 text-white py-4 h-auto text-base font-medium rounded-comfortable font-body shadow-gentle hover:shadow-comfortable transition-all duration-300"
            >
              {isSubmitting ? t('waitlist.submitting') : t('waitlist.submit')}
            </Button>
          </div>

          <p className="text-xs text-brand-muted-gray text-center mt-8 leading-relaxed font-body max-w-lg mx-auto">
            {t('waitlist.consent')}
          </p>
        </form>
      </div>
    </div>
  );
};

export default WaitlistForm;
