
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ChatHeaderProps {
  onClearChat: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ onClearChat }) => {
  const { toast } = useToast();

  const handleClearChat = () => {
    onClearChat();
    toast({
      title: "Chat cleared",
      description: "Your conversation history has been cleared."
    });
  };

  return (
    <div className="flex justify-between items-center p-4 border-b bg-white">
      <h2 className="text-lg font-medium text-[#333333]">AI Financial Advisor</h2>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleClearChat}
        className="text-[#9F9EA1] hover:text-[#333333] hover:bg-[#F1F1F1]"
      >
        <Trash2 size={16} />
        Clear Chat
      </Button>
    </div>
  );
};

export default ChatHeader;
