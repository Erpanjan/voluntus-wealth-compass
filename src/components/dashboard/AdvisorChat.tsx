
import React, { useState } from 'react';
import { Send, Paperclip, Image, Mic, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';

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
    <Card className="border rounded-xl shadow-sm">
      <CardContent className="p-0">
        {/* Chat Header */}
        <div className="border-b p-4 flex items-center">
          <Avatar className="h-10 w-10 mr-4">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback>VLC</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">Your Financial Advisor</h3>
            <p className="text-sm text-gray-500">Online</p>
          </div>
        </div>
        
        {/* Messages Container */}
        <div className="h-[60vh] overflow-y-auto p-4 flex flex-col gap-4">
          {messages.map((message) => (
            <div 
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] rounded-lg p-4 ${
                  message.sender === 'user' 
                    ? 'bg-black text-white rounded-br-none' 
                    : 'bg-gray-100 text-black rounded-bl-none'
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
                <div className={`text-xs mt-1 ${message.sender === 'user' ? 'text-gray-300' : 'text-gray-500'}`}>
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Message Input */}
        <form onSubmit={handleSendMessage} className="border-t p-4 flex gap-2">
          <Input 
            type="text" 
            placeholder="Type your message..." 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1"
          />
          
          <Button type="button" variant="outline" size="icon">
            <Paperclip size={20} />
          </Button>
          
          <Button type="button" variant="outline" size="icon">
            <Image size={20} />
          </Button>
          
          <Button type="button" variant="outline" size="icon">
            <Mic size={20} />
          </Button>
          
          <Button type="button" variant="outline" size="icon">
            <Video size={20} />
          </Button>
          
          <Button type="submit">
            <Send size={20} />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AdvisorChat;
