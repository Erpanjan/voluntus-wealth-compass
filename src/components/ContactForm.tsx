
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const ContactForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
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
            contact_type: 'email',
            contact_info: formData.email,
            message: formData.message
          }
        ]);

      if (error) throw error;

      toast({
        title: "Message sent",
        description: "Thank you for contacting us. Our advisor will reach out to you shortly.",
      });

      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast({
        title: "Error",
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 md:p-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-heading font-semibold mb-6 text-brand-black-olive">
          Join Our Waitlist
        </h2>
        <p className="text-brand-muted-gray text-lg font-body">
          Be among the first to experience our service when we launch
        </p>
      </div>
      
      <div className="bg-white rounded-comfortable shadow-peaceful p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <Input
                name="firstName"
                type="text"
                required
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="First name"
                className="w-full bg-brand-white-smoke border border-brand-light-gray rounded-gentle shadow-inner-peaceful text-brand-black-olive placeholder:text-brand-muted-gray h-12 px-4 py-3 font-body focus-visible:ring-1 focus-visible:ring-brand-black-olive focus-visible:border-brand-black-olive transition-all duration-200"
              />
            </div>
            <div>
              <Input
                name="lastName"
                type="text"
                required
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Last name"
                className="w-full bg-brand-white-smoke border border-brand-light-gray rounded-gentle shadow-inner-peaceful text-brand-black-olive placeholder:text-brand-muted-gray h-12 px-4 py-3 font-body focus-visible:ring-1 focus-visible:ring-brand-black-olive focus-visible:border-brand-black-olive transition-all duration-200"
              />
            </div>
          </div>

          <div>
            <Input
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email address"
              className="w-full bg-brand-white-smoke border border-brand-light-gray rounded-gentle shadow-inner-peaceful text-brand-black-olive placeholder:text-brand-muted-gray h-12 px-4 py-3 font-body focus-visible:ring-1 focus-visible:ring-brand-black-olive focus-visible:border-brand-black-olive transition-all duration-200"
            />
          </div>

          <div>
            <Textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Your message"
              className="w-full bg-brand-white-smoke border border-brand-light-gray rounded-gentle shadow-inner-peaceful text-brand-black-olive placeholder:text-brand-muted-gray min-h-[80px] px-4 py-3 font-body resize-none focus-visible:ring-1 focus-visible:ring-brand-black-olive focus-visible:border-brand-black-olive transition-all duration-200"
            />
          </div>

          <div className="pt-4">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-brand-black-olive hover:bg-opacity-90 text-white py-4 h-auto text-base font-medium rounded-comfortable font-body shadow-gentle hover:shadow-comfortable transition-all duration-300"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </div>

          <p className="text-xs text-brand-muted-gray text-center mt-8 leading-relaxed font-body">
            By clicking 'Submit', I authorize [Company] to reach out to me about their service, exclusive events, service updates, and company news.
          </p>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
