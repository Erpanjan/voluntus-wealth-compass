
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { ChevronDown } from 'lucide-react';

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    country: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
        name: '',
        email: '',
        country: '',
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
      <div className="mb-16">
        <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-center">
          Contact Us
        </h2>
        <p className="text-[#9F9EA1] text-lg font-light text-center">
          Our advisor will contact you shortly
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-8">
          <div className="border-b border-[#F1F1F1]">
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full py-4 bg-transparent border-none focus:ring-0 text-black placeholder:text-[#9F9EA1] outline-none"
            />
          </div>

          <div className="border-b border-[#F1F1F1]">
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full py-4 bg-transparent border-none focus:ring-0 text-black placeholder:text-[#9F9EA1] outline-none"
            />
          </div>

          <div className="border-b border-[#F1F1F1] relative">
            <select
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
              className="w-full py-4 bg-transparent border-none focus:ring-0 text-black placeholder:text-[#9F9EA1] outline-none appearance-none"
            >
              <option value="" disabled>Country</option>
              <option value="us">United States</option>
              <option value="cn">China</option>
              <option value="uk">United Kingdom</option>
              <option value="ca">Canada</option>
              <option value="au">Australia</option>
              <option value="sg">Singapore</option>
              <option value="hk">Hong Kong</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-[#9F9EA1]" size={18} />
          </div>

          <div className="border-b border-[#F1F1F1]">
            <textarea
              id="message"
              name="message"
              placeholder="Your message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              required
              className="w-full py-4 bg-transparent border-none focus:ring-0 text-black placeholder:text-[#9F9EA1] outline-none resize-none"
            />
          </div>
        </div>

        <div className="pt-8">
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-black hover:bg-black/90 text-white transition-all duration-300 py-6"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </div>

        <p className="text-xs text-[#9F9EA1] text-center pt-4">
          By clicking "Submit", I authorize 1X to notify me about exclusive events, product updates, and company news.
        </p>
      </form>
    </div>
  );
};

export default ContactForm;
