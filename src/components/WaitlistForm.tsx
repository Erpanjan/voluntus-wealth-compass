
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';

const WaitlistForm: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    contactType: '',
    contact: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Insert the form data into Supabase
      const { error } = await supabase
        .from('contact_submissions')
        .insert({
          first_name: formData.firstName,
          last_name: formData.lastName,
          contact_type: formData.contactType,
          contact_info: formData.contact,
          message: formData.message,
          status: 'Waitlist',
        });
        
      if (error) {
        throw error;
      }
      
      // Show success toast
      toast({
        title: "Added to waitlist",
        description: "Thank you for joining our waitlist. We'll notify you when we launch.",
        duration: 5000,
      });

      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        contactType: '',
        contact: '',
        message: '',
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      // Show error toast
      toast({
        title: "Error",
        description: "There was an error adding you to the waitlist. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 md:px-0">
      <div className="text-center mb-8 md:mb-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-3 md:mb-4">
          Join the Waitlist
        </h2>
        <p className="text-gray-600">
          Be the first to know when we launch
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="space-y-1.5">
            <Input
              id="firstName"
              name="firstName"
              type="text"
              placeholder="First name"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="border-0 border-b border-gray-300 rounded-none px-0 h-12 bg-transparent focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-500 text-base md:text-sm"
              aria-label="First name"
            />
          </div>

          <div className="space-y-1.5">
            <Input
              id="lastName"
              name="lastName"
              type="text"
              placeholder="Last name"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="border-0 border-b border-gray-300 rounded-none px-0 h-12 bg-transparent focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-500 text-base md:text-sm"
              aria-label="Last name"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Input
            id="contactType"
            name="contactType"
            type="text"
            placeholder="Preferred contact avenue (Email, Phone, WeChat, WhatsApp, etc.)"
            value={formData.contactType}
            onChange={handleChange}
            required
            className="border-0 border-b border-gray-300 rounded-none px-0 h-12 bg-transparent focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-500 text-base md:text-sm"
            aria-label="Contact type"
          />
        </div>

        <div className="space-y-1.5">
          <Input
            id="contact"
            name="contact"
            type="text"
            placeholder="Your contact information"
            value={formData.contact}
            onChange={handleChange}
            required
            className="border-0 border-b border-gray-300 rounded-none px-0 h-12 bg-transparent focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-500 text-base md:text-sm"
            aria-label="Contact information"
          />
        </div>

        <div className="space-y-1.5">
          <textarea
            id="message"
            name="message"
            placeholder="Any specific interests or questions? (optional)"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            className="w-full border-0 border-b border-gray-300 rounded-none px-0 py-2 bg-transparent focus:ring-0 focus:outline-none resize-none placeholder:text-gray-500 text-base md:text-sm"
            aria-label="Message (optional)"
          />
        </div>

        <div className="pt-4">
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-black/80 hover:bg-black text-white font-normal py-6 rounded-none min-h-[56px] touch-manipulation"
          >
            {isSubmitting ? 'Submitting...' : 'Join Waitlist'}
          </Button>
        </div>
        
        <p className="text-xs text-center text-gray-500 mt-4 px-2">
          By clicking "Join Waitlist", I authorize Voluntus Long-term Capital to reach out to me about their service, exclusive events, service updates, and company news.
        </p>
      </form>
    </div>
  );
};

export default WaitlistForm;
