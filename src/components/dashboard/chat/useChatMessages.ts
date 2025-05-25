
import { useState, useCallback, useMemo } from 'react';
import { Message } from './types';
import { sendToN8NAgent } from './chatService';
import { useToast } from '@/hooks/use-toast';

const initialMessage: Message = {
  id: 1,
  text: 'Hello! Welcome to Voluntas. How can I assist you today?',
  sender: 'advisor',
  timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000)
};

export const useChatMessages = () => {
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const clearMessages = useCallback(() => {
    setMessages([initialMessage]);
  }, []);

  const sendMessage = useCallback(async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;
    
    const userMessage: Message = {
      id: Date.now(),
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    };
    
    // Add user message immediately
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Add a loading message from advisor
    const loadingMessageId = Date.now() + 1;
    const loadingMessage: Message = {
      id: loadingMessageId,
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
        id: loadingMessageId,
        text: aiResponse,
        sender: 'advisor',
        timestamp: new Date()
      };
      
      setMessages(prev => prev.map(msg => 
        msg.id === loadingMessageId ? advisorMessage : msg
      ));
    } catch (error) {
      console.error('Failed to get AI response:', error);
      
      // Replace loading message with error message
      const errorMessage: Message = {
        id: loadingMessageId,
        text: "I apologize, but I'm having trouble connecting right now. Please try again in a moment.",
        sender: 'advisor',
        timestamp: new Date()
      };
      
      setMessages(prev => prev.map(msg => 
        msg.id === loadingMessageId ? errorMessage : msg
      ));
      
      toast({
        title: "Connection Error",
        description: "Unable to connect to the AI agent. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, toast]);

  return useMemo(() => ({
    messages,
    isLoading,
    sendMessage,
    clearMessages
  }), [messages, isLoading, sendMessage, clearMessages]);
};
