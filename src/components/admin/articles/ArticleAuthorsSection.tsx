
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X } from 'lucide-react';
import { FormDescription, FormLabel } from '@/components/ui/form';

interface ArticleAuthorsSectionProps {
  selectedAuthors: string[];
  setSelectedAuthors: React.Dispatch<React.SetStateAction<string[]>>;
}

const ArticleAuthorsSection: React.FC<ArticleAuthorsSectionProps> = ({
  selectedAuthors,
  setSelectedAuthors
}) => {
  const [newAuthor, setNewAuthor] = useState('');

  const handleAddAuthor = () => {
    if (newAuthor.trim()) {
      setSelectedAuthors(prev => [...prev, newAuthor.trim()]);
      setNewAuthor('');
    }
  };

  const handleRemoveAuthor = (authorToRemove: string) => {
    setSelectedAuthors(prev => prev.filter(author => author !== authorToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddAuthor();
    }
  };

  return (
    <div>
      <FormLabel>Authors</FormLabel>
      <FormDescription className="mb-3">
        Add one or multiple authors for this article
      </FormDescription>
      
      <div className="flex flex-wrap gap-2 mb-3">
        {selectedAuthors.map((author, index) => (
          <Badge 
            key={`${author}-${index}`} 
            variant="secondary"
            className="flex items-center gap-1 px-3 py-1.5"
          >
            {author}
            <button 
              type="button"
              className="ml-1 hover:bg-gray-200 rounded-full p-1"
              onClick={() => handleRemoveAuthor(author)}
            >
              <X size={14} />
            </button>
          </Badge>
        ))}
      </div>
      
      <div className="flex gap-2">
        <Input
          value={newAuthor}
          onChange={(e) => setNewAuthor(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Enter author name"
          className="flex-grow"
        />
        <Button 
          type="button" 
          onClick={handleAddAuthor}
          variant="outline"
        >
          <Plus size={16} className="mr-2" />
          Add
        </Button>
      </div>
    </div>
  );
};

export default ArticleAuthorsSection;
