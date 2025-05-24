import React, { useState } from 'react';
import { Send, Paperclip, Image, Mic, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'advisor';
  timestamp: Date;
  attachmentType?: 'image' | 'audio' | 'video' | 'document';
  attachmentUrl?: string;
  isLoading?: boolean;
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
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendToN8NAgent = async (userMessage: string) => {
    try {
      // Prepare the data to send via GET request query parameters
      const params = new URLSearchParams({
        message: userMessage,
        timestamp: new Date().toISOString(),
        context: 'financial-planning-chat'
      });

      const response = await fetch(`https://voluntus-long-term-capita.app.n8n.cloud/webhook-test/4840a04a-c61f-4b8a-8806-4413e2249f88?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Handle different possible response formats from N8N
      let aiResponse = '';
      if (typeof data === 'string') {
        aiResponse = data;
      } else if (data.response) {
        aiResponse = data.response;
      } else if (data.message) {
        aiResponse = data.message;
      } else if (data.text) {
        aiResponse = data.text;
      } else {
        aiResponse = "I received your message and I'm processing it. How else can I help you?";
      }

      return aiResponse;
    } catch (error) {
      console.error('Error calling N8N agent:', error);
      throw error;
    }
  };
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || isLoading) return;
    
    const userMessage: Message = {
      id: messages.length + 1,
      text: newMessage,
      sender: 'user',
      timestamp: new Date()
    };
    
    // Add user message immediately
    setMessages(prev => [...prev, userMessage]);
    const currentMessage = newMessage;
    setNewMessage('');
    setIsLoading(true);

    // Add a loading message from advisor
    const loadingMessage: Message = {
      id: messages.length + 2,
      text: '',
      sender: 'advisor',
      timestamp: new Date(),
      isLoading: true
    };
    
    setMessages(prev => [...prev, loadingMessage]);

    try {
      // Call N8N AI agent
      const aiResponse = await sendToN8NAgent(currentMessage);
      
      // Replace loading message with actual response
      const advisorMessage: Message = {
        id: messages.length + 2,
        text: aiResponse,
        sender: 'advisor',
        timestamp: new Date()
      };
      
      setMessages(prev => prev.map(msg => 
        msg.id === loadingMessage.id ? advisorMessage : msg
      ));
    } catch (error) {
      console.error('Failed to get AI response:', error);
      
      // Replace loading message with error message
      const errorMessage: Message = {
        id: messages.length + 2,
        text: "I apologize, but I'm having trouble connecting right now. Please try again in a moment.",
        sender: 'advisor',
        timestamp: new Date()
      };
      
      setMessages(prev => prev.map(msg => 
        msg.id === loadingMessage.id ? errorMessage : msg
      ));
      
      toast({
        title: "Connection Error",
        description: "Unable to connect to the AI agent. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
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
              {message.isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <span className="text-sm text-gray-500">AI is thinking...</span>
                </div>
              ) : (
                message.text
              )}
              
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
              
              {!message.isLoading && (
                <div className={`text-xs mt-1 text-gray-500`}>
                  {formatTime(message.timestamp)}
                </div>
              )}
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
    </div>
  );
};

export default AdvisorChat;
