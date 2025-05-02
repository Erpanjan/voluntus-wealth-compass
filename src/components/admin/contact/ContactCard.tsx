
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Phone, Mail, MessageSquare, Plus, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import NotesSection from './NotesSection';

interface ContactNoteType {
  id: string;
  contact_id: string;
  note: string;
  created_at: string;
  created_by: string;
}

interface ContactInquiryProps {
  inquiry: {
    id: string;
    first_name: string;
    last_name: string;
    contact_type: string;
    contact_info: string;
    message: string;
    created_at: string;
    status: string;
  };
  onStatusChange: (id: string, newStatus: string) => Promise<void>;
  onReply: (inquiry: any) => void;
  notes: ContactNoteType[];
  refreshNotes: () => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'New': return 'bg-blue-100 text-blue-800';
    case 'Responded': return 'bg-yellow-100 text-yellow-800';
    case 'Closed': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getContactIcon = (contactType: string) => {
  const type = contactType.toLowerCase();
  if (type.includes('email')) return <Mail size={14} className="mr-1" />;
  if (type.includes('phone') || type.includes('call')) return <Phone size={14} className="mr-1" />;
  return <MessageSquare size={14} className="mr-1" />;
};

const ContactCard: React.FC<ContactInquiryProps> = ({ 
  inquiry, 
  onStatusChange, 
  onReply,
  notes,
  refreshNotes
}) => {
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  const { toast } = useToast();

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return format(new Date(dateString), 'MMM d, yyyy h:mm a');
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) {
      toast({
        title: "Error",
        description: "Note cannot be empty.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('contact_notes')
        .insert({
          contact_id: inquiry.id,
          note: newNote.trim(),
          created_by: localStorage.getItem('userEmail') || 'Admin'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Note added successfully.",
      });
      setNewNote('');
      setIsAddingNote(false);
      refreshNotes();
    } catch (error) {
      console.error('Error adding note:', error);
      toast({
        title: "Error",
        description: "Failed to add note.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className={`border rounded-lg overflow-hidden ${inquiry.status === 'New' ? 'border-l-4 border-l-blue-500' : ''}`}>
      <div className="bg-white p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-medium">{`${inquiry.first_name} ${inquiry.last_name}`}</h3>
          <Badge className={`px-2 py-1 text-xs ${getStatusColor(inquiry.status)}`}>
            {inquiry.status}
          </Badge>
        </div>
        
        <div className="text-sm text-gray-500 flex flex-wrap items-center gap-1 mb-3">
          <span className="flex items-center">
            {getContactIcon(inquiry.contact_type)}
            {inquiry.contact_type}
          </span>
          <span className="mx-2">•</span>
          <span className="flex items-center font-medium">
            {inquiry.contact_info}
          </span>
          <span className="mx-2">•</span>
          <span>{formatDate(inquiry.created_at)}</span>
        </div>
        
        <div className="mb-4 text-gray-700 bg-gray-50 p-3 rounded-md">
          {inquiry.message}
        </div>
        
        <div className="flex flex-wrap gap-2 mb-3">
          <Button 
            size="sm" 
            variant="default" 
            onClick={() => onReply(inquiry)}
          >
            Reply
          </Button>
          {inquiry.status === 'New' ? (
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => onStatusChange(inquiry.id, 'Responded')}
            >
              Mark as Responded
            </Button>
          ) : inquiry.status === 'Responded' ? (
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onStatusChange(inquiry.id, 'Closed')}
            >
              Mark as Closed
            </Button>
          ) : (
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onStatusChange(inquiry.id, 'New')}
            >
              Reopen
            </Button>
          )}
        </div>
        
        <div className="border-t pt-3">
          <div 
            className="flex justify-between items-center cursor-pointer text-sm font-medium text-gray-600" 
            onClick={() => setShowNotes(!showNotes)}
          >
            <span className="flex items-center">
              Notes {notes.length > 0 && `(${notes.length})`}
            </span>
            <div className="flex items-center">
              {!isAddingNote && (
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="mr-2 h-8 px-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsAddingNote(true);
                  }}
                >
                  <Plus size={16} className="mr-1" /> Add note
                </Button>
              )}
              {showNotes ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
          </div>
          
          {showNotes && notes.length > 0 && (
            <NotesSection notes={notes} />
          )}
          
          {isAddingNote && (
            <div className="mt-3">
              <Textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add a note about this inquiry..."
                className="min-h-[100px] mb-2"
              />
              <div className="flex justify-end gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => {
                    setIsAddingNote(false);
                    setNewNote('');
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleAddNote}
                >
                  Save Note
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactCard;
