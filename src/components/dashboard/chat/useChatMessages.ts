
import { useState } from 'react';
import { Message } from './types';
import { sendToN8NAgent } from './chatService';
import { useToast } from '@/hooks/use-toast';

const initialMessage: Message = {
  id: 1,
  text: 'Hello! Welcome to Voluntas. How can I assist you today?',
  sender: 'advisor',
  timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
};

export const useChatMessages = () => {
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const clearMessages = () => {
    setMessages([initialMessage]);
  };

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;
    
    const userMessage: Message = {
      id: messages.length + 1,
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    };
    
    // Add user message immediately
    setMessages(prev => [...prev, userMessage]);
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
      const aiResponse = await sendToN8NAgent(messageText);
      
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

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages
  };
};
