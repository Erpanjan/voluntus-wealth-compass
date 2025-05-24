
import React from 'react';
import ChatMessage from './ChatMessage';
import { Message } from './types';

interface ChatMessageListProps {
  messages: Message[];
}

const ChatMessageList: React.FC<ChatMessageListProps> = ({ messages }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
    </div>
  );
};

export default ChatMessageList;
