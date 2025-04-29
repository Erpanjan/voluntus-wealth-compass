
import React, { useState } from 'react';
import { Send, Paperclip, Image, Mic, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'advisor';
  timestamp: Date;
  attachmentType?: 'image' | 'audio' | 'video' | 'document';
  attachmentUrl?: string;
}

const AdvisorChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Hello! Welcome to Voluntus Long-Term Capital. How can I assist you with your financial planning today?',
      sender: 'advisor',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
    }
  ]);
  
  const [newMessage, setNewMessage] = useState('');
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    const userMessage: Message = {
      id: messages.length + 1,
      text: newMessage,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages([...messages, userMessage]);
    setNewMessage('');
    
    // Simulate advisor response after a short delay
    setTimeout(() => {
      const advisorMessage: Message = {
        id: messages.length + 2,
        text: "Thank you for your message. I'll look into this and get back to you shortly.",
        sender: 'advisor',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, advisorMessage]);
    }, 1000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-white h-[calc(100vh-48px)] flex flex-col">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {messages.map((message) => (
          <div 
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.sender === 'advisor' && (
              <Avatar className="h-8 w-8 mr-2 self-end mb-1">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>FA</AvatarFallback>
              </Avatar>
            )}
            
            <div 
              className={`max-w-[80%] rounded-2xl p-3 ${
                message.sender === 'user' 
                  ? 'bg-[#F9F9F9] text-black rounded-br-none' 
                  : 'bg-[#F1F1F1] text-black rounded-bl-none'
              }`}
            >
              {message.text}
              {message.attachmentType && (
                <div className="mt-2">
                  {message.attachmentType === 'image' && (
                    <img src={message.attachmentUrl} alt="Attachment" className="max-w-full rounded" />
                  )}
                  {message.attachmentType === 'document' && (
                    <div className="bg-gray-200 p-2 rounded flex items-center gap-2">
                      <Paperclip size={16} />
                      <span>Document attachment</span>
                    </div>
                  )}
                  {message.attachmentType === 'audio' && (
                    <div className="bg-gray-200 p-2 rounded flex items-center gap-2">
                      <Mic size={16} />
                      <span>Audio recording</span>
                    </div>
                  )}
                  {message.attachmentType === 'video' && (
                    <div className="bg-gray-200 p-2 rounded flex items-center gap-2">
                      <Video size={16} />
                      <span>Video recording</span>
                    </div>
                  )}
                </div>
              )}
              <div className={`text-xs mt-1 text-gray-500`}>
                {formatTime(message.timestamp)}
              </div>
            </div>
            
            {message.sender === 'user' && (
              <Avatar className="h-8 w-8 ml-2 self-end mb-1">
                <AvatarImage src="/lovable-uploads/822caf58-c2a0-42b8-b572-0dcd908ddbd5.png" />
                <AvatarFallback>ME</AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
      </div>
      
      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 flex gap-2 bg-[#F9F9F9] rounded-3xl m-4">
        <Input 
          type="text" 
          placeholder="Ask anything" 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
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
        
        <Button type="submit" variant="default" size="icon" className="rounded-full">
          <Send size={18} />
        </Button>
      </form>
    </div>
  );
};

export default AdvisorChat;
