
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    contact: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

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
      // Simulating form submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success toast
      toast({
        title: "Message sent",
        description: "Thank you for contacting us. Our advisor will reach out to you shortly.",
        duration: 5000,
      });

      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        contact: '',
        message: '',
      });
    } catch (error) {
      // Show error toast
      toast({
        title: "Error",
        description: "There was an error sending your message. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-semibold mb-4 bg-gradient-to-r from-black to-[#9F9EA1] bg-clip-text text-transparent">
          Contact Us
        </h2>
        <p className="text-black text-lg">
          Our advisor will contact you shortly
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label htmlFor="firstName" className="block text-sm font-medium text-black">
              First name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              placeholder="Jane"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="w-full rounded-xl border-[#F1F1F1] focus:border-[#D3E4FD] focus:ring-[#D3E4FD]/20 transition-all duration-200"
            />
          </div>

          <div className="space-y-3">
            <label htmlFor="lastName" className="block text-sm font-medium text-black">
              Last name
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              placeholder="Doe"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="w-full rounded-xl border-[#F1F1F1] focus:border-[#D3E4FD] focus:ring-[#D3E4FD]/20 transition-all duration-200"
            />
          </div>
        </div>

        <div className="space-y-3">
          <label htmlFor="contact" className="block text-sm font-medium text-black">
            Contact
          </label>
          <input
            id="contact"
            name="contact"
            type="text"
            placeholder="Provide Your Preferred Contact — Email, WhatsApp, or Any Other Method"
            value={formData.contact}
            onChange={handleChange}
            required
            className="w-full rounded-xl border-[#F1F1F1] focus:border-[#D3E4FD] focus:ring-[#D3E4FD]/20 transition-all duration-200"
          />
        </div>

        <div className="space-y-3">
          <label htmlFor="message" className="block text-sm font-medium text-black">
            Your message
          </label>
          <textarea
            id="message"
            name="message"
            placeholder="Enter your question or message"
            value={formData.message}
            onChange={handleChange}
            rows={5}
            required
            className="w-full rounded-xl border-[#F1F1F1] focus:border-[#D3E4FD] focus:ring-[#D3E4FD]/20 transition-all duration-200 resize-none"
          />
        </div>

        <div className="text-center pt-4">
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-black hover:bg-black/90 text-white transition-all duration-300 rounded-full px-12 py-6 text-lg"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
