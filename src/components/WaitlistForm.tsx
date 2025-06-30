import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const WaitlistForm = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('waitlist')
        .insert([{ email }]);

      if (error) throw error;

      toast.success(t('waitlist.success'));
      setEmail('');
    } catch (error) {
      console.error('Error adding to waitlist:', error);
      toast.error(t('waitlist.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto text-center">
      {/* Editorial title */}
      <div className="editorial-spacing">
        <h2 className="text-2xl md:text-3xl font-light tracking-wide mb-8 leading-tight">
          {t('common.joinWaitlist')}
        </h2>
        <p className="text-base font-light text-gray-600 leading-relaxed">
          {t('waitlist.description')}
        </p>
      </div>

      {/* Minimal form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="max-w-md mx-auto">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isSubmitting}
            className="w-full text-center bg-transparent border-0 border-b border-gray-300 rounded-none text-base font-light focus:border-black transition-colors duration-200"
          />
        </div>
        
        <Button 
          type="submit" 
          disabled={isSubmitting || !email}
          variant="default"
          size="lg"
        >
          {isSubmitting ? 'Joining...' : 'Join Waitlist'}
        </Button>
      </form>
    </div>
  );
};

export default WaitlistForm;
