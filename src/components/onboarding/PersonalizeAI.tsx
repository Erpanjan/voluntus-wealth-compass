
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Image, Mic, Video } from 'lucide-react';

const PersonalizeAI = () => {
  const { toast } = useToast();
  const [textInput, setTextInput] = useState('');
  
  const handleFileUpload = (type: string) => {
    toast({
      title: "Feature Coming Soon",
      description: `${type} upload functionality will be available in the future.`,
    });
  };
  
  const handleTextSubmit = () => {
    if (textInput.trim()) {
      toast({
        title: "Information Received",
        description: "Thank you for sharing your information. Our AI will use this to personalize your experience.",
      });
    } else {
      toast({
        title: "Empty Input",
        description: "Please enter some text or skip this step.",
        variant: "destructive"
      });
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6">Personalize Your Experience</h1>
      <p className="text-lg mb-8">
        Share more information about yourself to help us customize your financial planning experience. This step is optional and you can skip it if you prefer.
      </p>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Share Your Financial Context</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-6">
            You can share information in multiple formats to help us understand your financial situation, goals, and preferences better.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Button 
              variant="outline" 
              className="h-24 flex flex-col items-center justify-center gap-2"
              onClick={() => handleFileUpload('Image')}
            >
              <Image size={24} />
              <span>Upload Images</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-24 flex flex-col items-center justify-center gap-2"
              onClick={() => handleFileUpload('Audio')}
            >
              <Mic size={24} />
              <span>Record Audio</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-24 flex flex-col items-center justify-center gap-2"
              onClick={() => handleFileUpload('Video')}
            >
              <Video size={24} />
              <span>Record Video</span>
            </Button>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium">Or simply tell us about yourself:</h3>
            <Textarea 
              placeholder="Describe your financial history, goals, concerns, or any other information that might help us serve you better..."
              className="min-h-[150px]"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
            />
            <Button onClick={handleTextSubmit}>
              Submit Information
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="font-medium text-lg mb-2">Why share this information?</h3>
        <p className="text-gray-600">
          Providing additional context helps us create a more personalized experience for you. Our AI and advisors can use this information to better understand your unique financial situation and goals. All information shared is securely stored and protected according to our privacy policy.
        </p>
      </div>
    </div>
  );
};

export default PersonalizeAI;
