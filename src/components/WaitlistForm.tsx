
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
    contactMethod: '',
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
        .from('waitlist')
        .insert([
          {
            first_name: formData.firstName,
            last_name: formData.lastName,
            contact_method: formData.contactMethod,
            preferred_contact: formData.preferredContact,
            contact_info: formData.contactInfo,
            interests: formData.interests || null
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
        contactMethod: '',
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
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">
          {t('waitlist.joinWaitlist')}
        </h2>
        <p className="text-gray-600 text-sm md:text-base">
          {t('contact.subtitle')}
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              {t('waitlist.firstName')}
            </label>
            <Input
              id="firstName"
              name="firstName"
              type="text"
              required
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder={t('waitlist.firstName')}
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              {t('waitlist.lastName')}
            </label>
            <Input
              id="lastName"
              name="lastName"
              type="text"
              required
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder={t('waitlist.lastName')}
              className="w-full"
            />
          </div>
        </div>

        <div>
          <label htmlFor="contactMethod" className="block text-sm font-medium text-gray-700 mb-1">
            {t('waitlist.contactMethod')}
          </label>
          <Input
            id="contactMethod"
            name="contactMethod"
            type="text"
            required
            value={formData.contactMethod}
            onChange={handleInputChange}
            placeholder={t('waitlist.contactMethod')}
            className="w-full"
          />
        </div>

        <div>
          <label htmlFor="preferredContact" className="block text-sm font-medium text-gray-700 mb-1">
            {t('waitlist.preferredContact')}
          </label>
          <Input
            id="preferredContact"
            name="preferredContact"
            type="text"
            required
            value={formData.preferredContact}
            onChange={handleInputChange}
            placeholder={t('waitlist.preferredContact')}
            className="w-full"
          />
        </div>

        <div>
          <label htmlFor="contactInfo" className="block text-sm font-medium text-gray-700 mb-1">
            {t('waitlist.contactInfo')}
          </label>
          <Input
            id="contactInfo"
            name="contactInfo"
            type="text"
            required
            value={formData.contactInfo}
            onChange={handleInputChange}
            placeholder={t('waitlist.contactInfo')}
            className="w-full"
          />
        </div>

        <div>
          <label htmlFor="interests" className="block text-sm font-medium text-gray-700 mb-1">
            {t('waitlist.interests')}
          </label>
          <Textarea
            id="interests"
            name="interests"
            value={formData.interests}
            onChange={handleInputChange}
            placeholder={t('waitlist.message')}
            className="w-full min-h-[100px]"
          />
        </div>

        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-black hover:bg-gray-800 text-white py-3"
        >
          {isSubmitting ? t('waitlist.submitting') : t('waitlist.submit')}
        </Button>

        <p className="text-xs text-gray-500 text-center mt-4">
          {t('waitlist.consent')}
        </p>
      </form>
    </div>
  );
};

export default WaitlistForm;
