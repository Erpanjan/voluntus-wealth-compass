
import React from 'react';
import { Paperclip, Mic, Video } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Message } from './types';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
      {message.sender === 'advisor' && (
        <Avatar className="h-8 w-8 mr-2 self-end mb-1">
          <AvatarImage src="/lovable-uploads/8ec091e2-c307-4976-bfd9-4f1a3e654c9b.png" />
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
  );
};

export default ChatMessage;
