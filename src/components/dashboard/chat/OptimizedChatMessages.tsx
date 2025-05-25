
import React, { useEffect, useRef, useMemo } from 'react';
import ChatMessage from './ChatMessage';
import { Message } from './types';

interface OptimizedChatMessagesProps {
  messages: Message[];
}

const OptimizedChatMessages: React.FC<OptimizedChatMessagesProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Memoize messages to prevent unnecessary re-renders
  const memoizedMessages = useMemo(() => messages, [messages.length, messages[messages.length - 1]?.id]);

  const scrollToBottom = React.useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'end'
    });
  }, []);

  useEffect(() => {
    const timer = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timer);
  }, [memoizedMessages.length, scrollToBottom]);

  return (
    <div 
      ref={containerRef}
      className="flex-1 overflow-y-auto p-4 flex flex-col gap-4"
    >
      {memoizedMessages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default React.memo(OptimizedChatMessages);
