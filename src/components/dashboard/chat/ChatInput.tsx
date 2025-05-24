
import React, { useState } from 'react';
import { Send, Paperclip, Image, Mic, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [newMessage, setNewMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || isLoading) return;
    
    onSendMessage(newMessage);
    setNewMessage('');
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 flex gap-2 bg-[#F9F9F9] rounded-3xl m-4">
      <Input 
        type="text" 
        placeholder="Ask anything" 
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        disabled={isLoading}
        className="flex-1 bg-transparent border-0 shadow-none focus:ring-0"
      />
      
      <Button type="button" variant="ghost" size="icon" className="rounded-full">
        <Paperclip size={18} />
      </Button>
      
      <Button type="button" variant="ghost" size="icon" className="rounded-full">
        <Image size={18} />
      </Button>
      
      <Button type="button" variant="ghost" size="icon" className="rounded-full">
        <Mic size={18} />
      </Button>
      
      <Button type="button" variant="ghost" size="icon" className="rounded-full">
        <Video size={18} />
      </Button>
      
      <Button 
        type="submit" 
        variant="default" 
        size="icon" 
        className="rounded-full"
        disabled={isLoading || !newMessage.trim()}
      >
        <Send size={18} />
      </Button>
    </form>
  );
};

export default ChatInput;
