
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface ReplyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedInquiry: any;
  onSendReply: () => void;
  replyText: string;
  setReplyText: (text: string) => void;
}

const ReplyDialog: React.FC<ReplyDialogProps> = ({
  isOpen,
  onClose,
  selectedInquiry,
  onSendReply,
  replyText,
  setReplyText
}) => {
  if (!selectedInquiry) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reply to {selectedInquiry.first_name} {selectedInquiry.last_name}</DialogTitle>
          <DialogDescription>
            Send a response to the contact inquiry.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">Recipient</p>
            <p className="text-sm">{selectedInquiry.contact_info}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Original Message</p>
            <p className="text-sm bg-gray-100 p-3 rounded">{selectedInquiry.message}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Your Reply</p>
            <Textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows={5}
              placeholder="Type your response here..."
              className="resize-none"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={onSendReply}>Send Reply</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReplyDialog;
