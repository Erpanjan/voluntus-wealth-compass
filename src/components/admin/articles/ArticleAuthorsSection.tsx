
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X } from 'lucide-react';
import { FormDescription, FormLabel } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';

interface ArticleAuthorsSectionProps {
  selectedAuthors: string[];
  setSelectedAuthors: React.Dispatch<React.SetStateAction<string[]>>;
}

const ArticleAuthorsSection: React.FC<ArticleAuthorsSectionProps> = ({
  selectedAuthors,
  setSelectedAuthors
}) => {
  const [newAuthor, setNewAuthor] = useState('');
  const { toast } = useToast();

  const handleAddAuthor = () => {
    const trimmedAuthor = newAuthor.trim();
    if (!trimmedAuthor) {
      return;
    }
    
    // Check if author already exists to avoid duplicates
    if (selectedAuthors.includes(trimmedAuthor)) {
      toast({
        title: "Author already exists",
        description: `"${trimmedAuthor}" is already in the authors list.`,
        variant: "destructive",
      });
      return;
    }
    
    setSelectedAuthors(prev => [...prev, trimmedAuthor]);
    setNewAuthor(''); // Clear the input after adding
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
      <FormLabel className="text-gray-700 text-base">Authors</FormLabel>
      <FormDescription className="text-gray-500 mb-3">
        Add one or multiple authors for this article
      </FormDescription>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {selectedAuthors.map((author, index) => (
          <Badge 
            key={`${author}-${index}`} 
            variant="secondary"
            className="flex items-center gap-1 px-3 py-2 bg-gray-100 hover:bg-gray-200"
          >
            {author}
            <button 
              type="button"
              className="ml-1 hover:bg-gray-300 rounded-full p-1 transition-colors"
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
          className="flex-grow focus-visible:ring-gray-400"
        />
        <Button 
          type="button" 
          onClick={handleAddAuthor}
          variant="outline"
          disabled={!newAuthor.trim()}
          className="hover:bg-gray-100"
        >
          <Plus size={16} className="mr-2" />
          Add
        </Button>
      </div>
    </div>
  );
};

export default ArticleAuthorsSection;
