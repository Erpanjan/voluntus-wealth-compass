
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
        <h2 className="text-3xl md:text-4xl font-semibold mb-4">
          Contact Us
        </h2>
        <p className="text-gray-600">
          Our advisor will contact you shortly
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <Input
              id="firstName"
              name="firstName"
              type="text"
              placeholder="First name"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="border-0 border-b border-gray-300 rounded-none px-0 h-12 bg-transparent focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-500"
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
              className="border-0 border-b border-gray-300 rounded-none px-0 h-12 bg-transparent focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-500"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Input
            id="contact"
            name="contact"
            type="text"
            placeholder="Email address"
            value={formData.contact}
            onChange={handleChange}
            required
            className="border-0 border-b border-gray-300 rounded-none px-0 h-12 bg-transparent focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-500"
          />
        </div>

        <div className="space-y-1.5">
          <Select>
            <SelectTrigger className="border-0 border-b border-gray-300 rounded-none px-0 h-12 bg-transparent focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-500">
              <SelectValue placeholder="Country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="us">United States</SelectItem>
              <SelectItem value="ca">Canada</SelectItem>
              <SelectItem value="uk">United Kingdom</SelectItem>
              <SelectItem value="au">Australia</SelectItem>
              <SelectItem value="de">Germany</SelectItem>
              <SelectItem value="fr">France</SelectItem>
              <SelectItem value="jp">Japan</SelectItem>
              <SelectItem value="cn">China</SelectItem>
              <SelectItem value="in">India</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <textarea
            id="message"
            name="message"
            placeholder="Your message"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            required
            className="w-full border-0 border-b border-gray-300 rounded-none px-0 py-2 bg-transparent focus:ring-0 focus:outline-none resize-none placeholder:text-gray-500"
          />
        </div>

        <div className="pt-4">
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-black/80 hover:bg-black text-white font-normal py-6 rounded-none"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </div>
        
        <p className="text-xs text-center text-gray-500 mt-4">
          By clicking "Submit", I authorize 1X to notify me about exclusive events, product updates, and company news.
        </p>
      </form>
    </div>
  );
};

export default ContactForm;
