
import React from 'react';
import { format } from 'date-fns';

interface Note {
  id: string;
  note: string;
  created_at: string;
  created_by: string;
}

interface NotesSectionProps {
  notes: Note[];
}

const NotesSection: React.FC<NotesSectionProps> = ({ notes }) => {
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy h:mm a');
  };

  return (
    <div className="space-y-3 mt-3">
      {notes.map((note) => (
        <div key={note.id} className="bg-gray-50 p-3 rounded-md">
          <p className="text-sm whitespace-pre-wrap">{note.note}</p>
          <div className="text-xs text-gray-500 mt-2 flex justify-between">
            <span>By: {note.created_by}</span>
            <span>{formatDate(note.created_at)}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotesSection;
