
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import ContactDetails from './ContactDetails';
import ContactActions from './ContactActions';
import NotesSection from './NotesSection';
import NotesToggle from './NotesToggle';
import AddNoteForm from './AddNoteForm';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  refreshInquiries: () => void;
  onDelete: (id: string) => Promise<void>;
}

const ContactCard: React.FC<ContactInquiryProps> = ({ 
  inquiry, 
  onStatusChange, 
  onReply,
  notes,
  refreshNotes,
  refreshInquiries,
  onDelete
}) => {
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

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

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      console.log("ContactCard: Initiating delete for inquiry ID:", inquiry.id);
      
      // Use the onDelete function passed from the parent component
      await onDelete(inquiry.id);
      
      // Close the dialog after successful deletion
      setIsDeleteDialogOpen(false);
      
      // Refresh inquiries to update the UI
      refreshInquiries();
      
      toast({
        title: "Success",
        description: "Contact inquiry deleted successfully."
      });
    } catch (error) {
      console.error('Error in ContactCard delete handler:', error);
      toast({
        title: "Error",
        description: "Failed to delete inquiry.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <div className={`border rounded-lg overflow-hidden ${inquiry.status === 'New' ? 'border-l-4 border-l-blue-500' : ''}`}>
      <div className="bg-white p-4">
        <div className="flex justify-between items-start mb-2">
          <ContactDetails inquiry={inquiry} />
          <Button 
            variant="ghost" 
            size="sm"
            className="text-gray-500 hover:text-red-500"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash size={16} />
          </Button>
        </div>
        
        <ContactActions 
          status={inquiry.status} 
          onReply={() => onReply(inquiry)} 
          onStatusChange={(newStatus) => onStatusChange(inquiry.id, newStatus)}
        />
        
        <div className="border-t pt-3">
          <NotesToggle 
            showNotes={showNotes}
            noteCount={notes.length}
            isAddingNote={isAddingNote}
            onToggle={() => setShowNotes(!showNotes)}
            onAddNote={() => setIsAddingNote(true)}
          />
          
          {showNotes && notes.length > 0 && (
            <NotesSection 
              notes={notes} 
              onNoteUpdate={refreshNotes}
            />
          )}
          
          {isAddingNote && (
            <AddNoteForm 
              newNote={newNote}
              setNewNote={setNewNote}
              onCancel={() => {
                setIsAddingNote(false);
                setNewNote('');
              }}
              onSave={handleAddNote}
            />
          )}
        </div>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the contact inquiry from 
              {' '}{inquiry.first_name} {inquiry.last_name} and all associated notes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              className="bg-red-500 hover:bg-red-600"
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ContactCard;
