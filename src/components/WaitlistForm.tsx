
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
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-16 md:mb-20">
        <h2 className="text-2xl md:text-3xl font-medium mb-6 text-black leading-tight">
          {t('contact.title')}
        </h2>
        <p className="text-gray-600 text-lg font-light leading-loose max-w-xl mx-auto">
          {t('contact.subtitle')}
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="w-full">
            <Input
              name="firstName"
              type="text"
              required
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder={t('waitlist.firstName')}
              className="w-full bg-transparent border-0 border-b border-gray-200 focus:border-black rounded-none shadow-none text-black placeholder:text-gray-400 h-12 px-0 pb-3 pt-4 font-light focus-visible:ring-0 transition-colors text-base"
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
              className="w-full bg-transparent border-0 border-b border-gray-200 focus:border-black rounded-none shadow-none text-black placeholder:text-gray-400 h-12 px-0 pb-3 pt-4 font-light focus-visible:ring-0 transition-colors text-base"
            />
          </div>
        </div>

        <div className="w-full">
          <Input
            name="contactInfo"
            type="text"
            required
            value={formData.contactInfo}
            onChange={handleInputChange}
            placeholder={t('waitlist.contactInfo')}
            className="w-full bg-transparent border-0 border-b border-gray-200 focus:border-black rounded-none shadow-none text-black placeholder:text-gray-400 h-12 px-0 pb-3 pt-4 font-light focus-visible:ring-0 transition-colors text-base"
          />
        </div>

        <div className="w-full">
          <Textarea
            name="interests"
            value={formData.interests}
            onChange={handleInputChange}
            placeholder={t('waitlist.interests')}
            className="w-full bg-transparent border-0 border-b border-gray-200 focus:border-black rounded-none shadow-none text-black placeholder:text-gray-400 min-h-[100px] px-0 pb-3 pt-4 font-light resize-none focus-visible:ring-0 transition-colors text-base"
          />
        </div>

        <div className="pt-8 w-full">
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-black hover:bg-gray-800 text-white py-4 h-auto text-sm font-light rounded-none uppercase tracking-widest transition-colors duration-200"
          >
            {isSubmitting ? 'SUBMITTING...' : t('waitlist.submit')}
          </Button>
        </div>

        <p className="text-xs text-gray-400 text-center mt-8 leading-loose font-light max-w-lg mx-auto">
          {t('waitlist.consent')}
        </p>
      </form>
    </div>
  );
};

export default WaitlistForm;
