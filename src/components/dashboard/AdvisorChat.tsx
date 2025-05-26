
import React from 'react';
import ChatHeader from './chat/ChatHeader';
import ChatMessageList from './chat/ChatMessageList';
import ChatInput from './chat/ChatInput';
import { useChatMessages } from './chat/useChatMessages';

const AdvisorChat = () => {
  const { messages, isLoading, sendMessage, clearMessages } = useChatMessages();

  return (
    <div className="bg-white h-[calc(100vh-48px)] flex flex-col">
      <ChatHeader onClearChat={clearMessages} />
      <ChatMessageList messages={messages} />
      <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
    </div>
  );
};

export default AdvisorChat;
