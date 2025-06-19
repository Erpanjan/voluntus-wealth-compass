
import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useWaitlistForm } from '@/hooks/useWaitlistForm';
import WaitlistFormHeader from './WaitlistFormHeader';
import WaitlistFormInput from './WaitlistFormInput';
import WaitlistFormTextarea from './WaitlistFormTextarea';

const WaitlistForm = () => {
  const { t } = useLanguage();
  const { formData, isSubmitting, handleInputChange, handleSubmit } = useWaitlistForm();

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
      <WaitlistFormHeader />
      
      <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          <WaitlistFormInput
            id="firstName"
            name="firstName"
            type="text"
            required
            value={formData.firstName}
            onChange={handleInputChange}
            label={t('waitlist.firstName')}
          />
          
          <WaitlistFormInput
            id="lastName"
            name="lastName"
            type="text"
            required
            value={formData.lastName}
            onChange={handleInputChange}
            label={t('waitlist.lastName')}
          />
        </div>

        <WaitlistFormInput
          id="preferredContact"
          name="preferredContact"
          type="text"
          required
          value={formData.preferredContact}
          onChange={handleInputChange}
          label={t('waitlist.preferredContact')}
        />

        <WaitlistFormInput
          id="contactInfo"
          name="contactInfo"
          type="text"
          required
          value={formData.contactInfo}
          onChange={handleInputChange}
          label={t('waitlist.contactInfo')}
        />

        <WaitlistFormTextarea
          id="interests"
          name="interests"
          value={formData.interests}
          onChange={handleInputChange}
          label={t('waitlist.interests')}
        />

        <div className="pt-3 sm:pt-4 w-full">
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-[#333333] hover:bg-[#555555] text-white py-3 sm:py-4 h-auto text-sm sm:text-base font-medium rounded-none font-poppins transition-colors duration-200"
          >
            {isSubmitting ? t('waitlist.submitting') : t('waitlist.submit')}
          </Button>
        </div>

        <p className="text-xs sm:text-sm text-[#999999] text-center mt-6 sm:mt-8 leading-relaxed font-poppins max-w-lg mx-auto">
          {t('waitlist.consent')}
        </p>
      </form>
    </div>
  );
};

export default WaitlistForm;
